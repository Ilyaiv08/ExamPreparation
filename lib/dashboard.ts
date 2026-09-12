import 'server-only';
import { cache } from 'react';

import { prisma } from '@/lib/db';
import { ALL_DAYS, ALL_WEEKS, MONTHS, getMonth, getWeek } from '@/content/curriculum';
import { getProjects, getQuizzes, getTasks, getTopics } from '@/lib/content';
import { getProgressMap, getStreak, getTopicStats, todayPlanDay } from '@/lib/progress/service';
import {
  computeReadiness,
  daysUntilExam,
  preExamPlan,
  rankWeakTopics,
  readinessLabel,
  planWeekRange,
  weekNoFromDayIndex,
} from '@/lib/progress/logic';
import { buildRecommendations, type Recommendation } from '@/lib/recommend/logic';
import { dateKey } from '@/lib/utils';
import type { Tech } from '@/content/types';

/**
 * Сбор данных для дашборда и страницы прогресса.
 * Один проход по прогрессу — дальше все цифры считаются из него,
 * чтобы не делать десяток запросов к базе на одну страницу.
 */

export interface TechProgress {
  tech: Tech;
  done: number;
  total: number;
  percent: number;
}

export const getDashboardData = cache(async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const [progressMap, topics, tasks, quizzes, projects, streak, topicStats] = await Promise.all([
    getProgressMap(userId),
    getTopics(),
    getTasks(),
    getQuizzes(),
    getProjects(),
    getStreak(userId),
    getTopicStats(userId),
  ]);

  const { index: todayIndex, day: today } = todayPlanDay(user.startDate);
  const currentWeekNo = weekNoFromDayIndex(todayIndex);
  const currentWeek = ALL_WEEKS.find((week) => week.weekNo === currentWeekNo) ?? ALL_WEEKS[0];
  const currentMonth = getMonth(currentWeek.monthId) ?? MONTHS[0];

  const isDone = (type: string, id: string) => progressMap.get(`${type}:${id}`)?.status === 'completed';

  // ── Общий прогресс ──────────────────────────────────────────────────────────
  const doneTopics = topics.filter((topic) => isDone('topic', topic.id));
  // Решённые задания считаются не отсюда, а по попыткам (solvedTaskIds ниже):
  // задание засчитывается прохождением тестов, а не отметкой в прогрессе.
  const doneProjects = projects.filter((project) => isDone('project', project.id));
  const doneDays = ALL_DAYS.filter((day) => isDone('day', day.id));

  const controlDays = ALL_DAYS.filter((day) => day.kind === 'control' || day.kind === 'review');
  const doneControlDays = controlDays.filter((day) => isDone('day', day.id));

  // ── Практика: попытки и успешность ─────────────────────────────────────────
  const submissions = await prisma.submission.findMany({
    where: { userId },
    select: { taskId: true, passed: true, hintsUsed: true, runtimeMs: true, createdAt: true, score: true, maxScore: true },
    orderBy: { createdAt: 'desc' },
    take: 500,
  });
  const solvedTaskIds = new Set(submissions.filter((item) => item.passed).map((item) => item.taskId));
  const attemptedTaskIds = new Set(submissions.map((item) => item.taskId));
  const successRate = submissions.length
    ? Math.round((submissions.filter((item) => item.passed).length / submissions.length) * 100)
    : 0;
  const hintsUsedTotal = submissions.reduce((sum, item) => sum + item.hintsUsed, 0);

  // ── Экзамены ────────────────────────────────────────────────────────────────
  const examAttempts = await prisma.examAttempt.findMany({
    where: { userId, status: 'finished' },
    orderBy: { finishedAt: 'desc' },
    take: 10,
  });
  const lastExam = examAttempts[0] ?? null;
  const avgExamPercent = examAttempts.length
    ? Math.round(examAttempts.slice(0, 3).reduce((sum, item) => sum + item.percent, 0) / Math.min(3, examAttempts.length))
    : null;

  // ── Повторение ──────────────────────────────────────────────────────────────
  const dueReviewRows = await prisma.reviewItem.findMany({
    where: { userId, dueAt: { lte: new Date() } },
    orderBy: { dueAt: 'asc' },
    take: 20,
  });
  const topicById = new Map(topics.map((topic) => [topic.id, topic]));
  const dueReviews = dueReviewRows.map((row) => ({
    topicId: row.topicId,
    title: topicById.get(row.topicId)?.title ?? row.topicId,
  }));

  // ── Слабые темы ─────────────────────────────────────────────────────────────
  const weakTopics = rankWeakTopics(
    topicStats.map((stat) => ({
      topicId: stat.topicId,
      attempts: stat.attempts,
      solved: stat.solved,
      failed: stat.failed,
      hintsUsed: stat.hintsUsed,
      quizCorrect: stat.quizCorrect,
      quizTotal: stat.quizTotal,
      totalTimeMs: stat.totalTimeMs,
      lastAttemptAt: stat.lastAttemptAt,
      lastSuccessAt: stat.lastSuccessAt,
    })),
  ).map((item) => ({ ...item, title: topicById.get(item.topicId)?.title ?? item.topicId }));

  // ── Прогресс по технологиям ────────────────────────────────────────────────
  const techMap = new Map<Tech, { done: number; total: number }>();
  for (const topic of topics) {
    for (const tech of topic.tech) {
      const entry = techMap.get(tech) ?? { done: 0, total: 0 };
      entry.total += 1;
      if (isDone('topic', topic.id)) entry.done += 1;
      techMap.set(tech, entry);
    }
  }
  for (const task of tasks) {
    for (const tech of task.tech) {
      const entry = techMap.get(tech) ?? { done: 0, total: 0 };
      entry.total += 1;
      if (solvedTaskIds.has(task.id)) entry.done += 1;
      techMap.set(tech, entry);
    }
  }
  const techProgress: TechProgress[] = [...techMap.entries()]
    .map(([tech, entry]) => ({
      tech,
      done: entry.done,
      total: entry.total,
      percent: entry.total ? Math.round((entry.done / entry.total) * 100) : 0,
    }))
    .filter((item) => item.total >= 2)
    .sort((a, b) => b.percent - a.percent);

  // ── Готовность ──────────────────────────────────────────────────────────────
  const readiness = computeReadiness({
    theory: { done: doneTopics.length, total: topics.length },
    practice: { done: solvedTaskIds.size, total: tasks.length },
    control: { done: doneControlDays.length, total: controlDays.length },
    projects: { done: doneProjects.length, total: projects.length },
    examPercent: avgExamPercent,
  });

  // ── Ближайшая контрольная точка ────────────────────────────────────────────
  const nextControl = ALL_DAYS.slice(todayIndex).find(
    (day) => (day.kind === 'control' || day.kind === 'exam') && !isDone('day', day.id),
  );

  // ── Незакрытые задачи и темы текущей недели ────────────────────────────────
  const weekDayIds = new Set(currentWeek.days.map((day) => day.id));
  const pendingTasks = tasks
    .filter((task) => (task.planDays ?? []).some((dayId) => weekDayIds.has(dayId)) && !solvedTaskIds.has(task.id))
    .map((task) => ({ id: task.id, title: task.title, difficulty: task.difficulty }));
  const pendingTopics = topics
    .filter((topic) => topic.planDays.some((dayId) => weekDayIds.has(dayId)) && !isDone('topic', topic.id))
    .map((topic) => ({ id: topic.id, title: topic.title }));

  const pendingProjectSource = projects.find(
    (project) => project.monthNo === currentMonth.monthNo && !isDone('project', project.id),
  );

  // ── Активность сегодня ─────────────────────────────────────────────────────
  const todaySession = await prisma.studySession.findUnique({
    where: { userId_date: { userId, date: dateKey() } },
  });
  const activeToday = Boolean(
    todaySession &&
      todaySession.theoryMinutes +
        todaySession.practiceMinutes +
        todaySession.tasksAttempted +
        todaySession.quizzesTaken +
        todaySession.lessonsDone >
        0,
  );

  const untilExam = daysUntilExam(user.examDate);

  const recommendations: Recommendation[] = buildRecommendations({
    dueReviews,
    weakTopics,
    today: today
      ? {
          dayId: today.id,
          title: today.title,
          kind: today.kind,
          topicIds: today.topicIds,
          taskIds: today.taskIds,
          completed: isDone('day', today.id),
        }
      : null,
    pendingTasks,
    pendingTopics,
    pendingProject: pendingProjectSource
      ? { id: pendingProjectSource.id, title: pendingProjectSource.title }
      : null,
    exams: { attempts: examAttempts.length, lastPercent: lastExam?.percent ?? null },
    daysUntilExam: untilExam,
    activeToday,
    streak: streak.current,
    readinessPercent: readiness.percent,
  });

  // ── Прогресс месяца ─────────────────────────────────────────────────────────
  const monthDays = currentMonth.weeks.flatMap((week) => week.days);
  const monthDone = monthDays.filter((day) => isDone('day', day.id)).length;

  const taskById = new Map(tasks.map((task) => [task.id, task]));

  return {
    user,
    today,
    todayTopics: (today?.topicIds ?? [])
      .map((id) => topicById.get(id))
      .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic))
      .map((topic) => ({ id: topic.id, title: topic.title, done: isDone('topic', topic.id) })),
    todayTasks: (today?.taskIds ?? [])
      .map((id) => taskById.get(id))
      .filter((task): task is NonNullable<typeof task> => Boolean(task))
      .map((task) => ({ id: task.id, title: task.title, done: solvedTaskIds.has(task.id) })),
    todayIndex,
    currentWeek,
    // Даты недели считаются от даты старта студента, а не берутся из файла
    // программы: план одинаков для всех, а календарь у каждого свой.
    currentWeekDates: planWeekRange(user.startDate, currentWeekNo).label,
    currentMonth,
    monthProgress: { done: monthDone, total: monthDays.length },
    weekProgress: {
      done: currentWeek.days.filter((day) => isDone('day', day.id)).length,
      total: currentWeek.days.length,
    },
    overall: {
      days: { done: doneDays.length, total: ALL_DAYS.length },
      topics: { done: doneTopics.length, total: topics.length },
      tasks: { done: solvedTaskIds.size, total: tasks.length },
      quizzes: { total: quizzes.length },
      projects: { done: doneProjects.length, total: projects.length },
      attemptedTasks: attemptedTaskIds.size,
      successRate,
      hintsUsedTotal,
      submissions: submissions.length,
    },
    techProgress,
    weakTopics,
    dueReviews,
    streak,
    readiness: { ...readiness, ...readinessLabel(readiness.percent) },
    nextControl,
    recommendations,
    lastExam,
    examAttempts,
    daysUntilExam: untilExam,
    preExam: untilExam !== null ? preExamPlan(untilExam) : null,
    todaySession,
    pendingTasks,
    pendingTopics,
  };
});

export const getWeekOverview = cache(async (userId: string, weekId: string) => {
  const week = getWeek(weekId);
  if (!week) return null;
  const progressMap = await getProgressMap(userId);
  return {
    week,
    days: week.days.map((day) => ({
      day,
      status: progressMap.get(`day:${day.id}`)?.status ?? 'not_started',
    })),
  };
});
