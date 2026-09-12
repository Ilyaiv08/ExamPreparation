import type { WeakTopic } from '@/lib/progress/logic';
import { preExamPlan } from '@/lib/progress/logic';

/**
 * Система рекомендаций (разделы 18, 40, 42, 44 ТЗ).
 *
 * Чистая функция: на вход — снимок состояния студента, на выход — список
 * конкретных действий со ссылками. Никаких «молодец, продолжай»:
 * каждая рекомендация должна вести на конкретную страницу.
 */

export type RecommendationKind = 'review' | 'theory' | 'practice' | 'exam' | 'project' | 'plan' | 'rest';

export interface Recommendation {
  id: string;
  kind: RecommendationKind;
  /** Чем больше, тем выше в списке. */
  priority: number;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
}

export interface RecommendationContext {
  /** Сколько карточек повторения просрочено/готово к повтору. */
  dueReviews: { topicId: string; title: string }[];
  weakTopics: (WeakTopic & { title: string })[];
  /** Сегодняшний день программы. */
  today: {
    dayId: string;
    title: string;
    kind: string;
    topicIds: string[];
    taskIds: string[];
    completed: boolean;
  } | null;
  /** Незакрытые задания текущей недели. */
  pendingTasks: { id: string; title: string; difficulty: number }[];
  /** Незакрытые темы текущей недели. */
  pendingTopics: { id: string; title: string }[];
  /** Мини-проект текущего месяца, если он не сдан. */
  pendingProject: { id: string; title: string } | null;
  /** Процент последнего экзамена и сколько всего попыток. */
  exams: { attempts: number; lastPercent: number | null };
  daysUntilExam: number | null;
  /** Занимался ли студент сегодня. */
  activeToday: boolean;
  streak: number;
  readinessPercent: number;
}

export function buildRecommendations(context: RecommendationContext, limit = 5): Recommendation[] {
  const items: Recommendation[] = [];

  // 1. Просроченное повторение — всегда важнее нового материала.
  if (context.dueReviews.length) {
    const names = context.dueReviews.slice(0, 3).map((item) => item.title);
    items.push({
      id: 'review-due',
      kind: 'review',
      priority: 100 + Math.min(20, context.dueReviews.length),
      title: `Повторение: ${context.dueReviews.length} ${plural(context.dueReviews.length, 'тема', 'темы', 'тем')}`,
      description: `Пора вернуться к темам: ${names.join(', ')}${context.dueReviews.length > 3 ? ' и другим' : ''}.`,
      href: '/review',
      actionLabel: 'Начать повторение',
    });
  }

  // 2. Предэкзаменационный режим.
  const preExam = context.daysUntilExam !== null ? preExamPlan(context.daysUntilExam) : null;
  if (preExam) {
    items.push({
      id: 'pre-exam',
      kind: 'exam',
      priority: 95,
      title: `До экзамена ${context.daysUntilExam} ${plural(context.daysUntilExam ?? 0, 'день', 'дня', 'дней')}`,
      description: `${preExam.title} предэкзаменационного плана: ${preExam.focus.toLowerCase()}.`,
      href: '/exams',
      actionLabel: 'Открыть экзамены',
    });
  }

  // 3. Слабые темы.
  for (const [index, topic] of context.weakTopics.slice(0, 2).entries()) {
    items.push({
      id: `weak-${topic.topicId}`,
      kind: 'theory',
      priority: 85 - index * 5 + Math.round(topic.weakness * 10),
      title: `Слабая тема: ${topic.title}`,
      description: topic.reasons.length
        ? `Причины: ${topic.reasons.join(', ')}. Повторите теорию и решите дополнительные задания.`
        : 'Тема даётся тяжелее остальных — стоит вернуться к теории.',
      href: `/theory/${topic.topicId}`,
      actionLabel: 'Повторить теорию',
    });
  }

  // 4. Сегодняшний день программы.
  if (context.today && !context.today.completed) {
    items.push({
      id: 'today',
      kind: 'plan',
      priority: 80,
      title: `Сегодня по плану: ${context.today.title}`,
      description:
        context.today.kind === 'rest'
          ? 'По программе сегодня день отдыха. Это тоже часть подготовки.'
          : 'Откройте день плана: теория, практика и задания уже собраны вместе.',
      href: `/plan/day/${context.today.dayId}`,
      actionLabel: 'Открыть день',
    });
  }

  // 5. Незакрытая практика недели.
  if (context.pendingTasks.length) {
    const first = context.pendingTasks[0];
    items.push({
      id: 'pending-task',
      kind: 'practice',
      priority: 70,
      title: `Нерешённое задание: ${first.title}`,
      description: `В текущей неделе осталось ${context.pendingTasks.length} ${plural(
        context.pendingTasks.length,
        'задание',
        'задания',
        'заданий',
      )}. Практика весит 40 % итоговой готовности.`,
      href: `/tasks/${first.id}`,
      actionLabel: 'Решать',
    });
  }

  // 6. Теория недели.
  if (context.pendingTopics.length) {
    const first = context.pendingTopics[0];
    items.push({
      id: 'pending-topic',
      kind: 'theory',
      priority: 60,
      title: `Не пройдена тема: ${first.title}`,
      description: 'Без теории практика этой недели будет идти вслепую.',
      href: `/theory/${first.id}`,
      actionLabel: 'Изучить',
    });
  }

  // 7. Мини-проект месяца.
  if (context.pendingProject) {
    items.push({
      id: 'project',
      kind: 'project',
      priority: 55,
      title: `Мини-проект: ${context.pendingProject.title}`,
      description: 'Проект собирает отдельные умения в законченное приложение — как на экзамене.',
      href: `/projects/${context.pendingProject.id}`,
      actionLabel: 'Открыть проект',
    });
  }

  // 8. Экзаменационная практика.
  if (context.exams.attempts === 0 && context.readinessPercent >= 30) {
    items.push({
      id: 'first-exam',
      kind: 'exam',
      priority: 50,
      title: 'Пройдите первый тренировочный экзамен',
      description: 'Ранний прогон показывает реальные пробелы лучше, чем ещё десять решённых задач.',
      href: '/exams',
      actionLabel: 'Выбрать вариант',
    });
  } else if (context.exams.lastPercent !== null && context.exams.lastPercent < 70) {
    items.push({
      id: 'repeat-exam',
      kind: 'exam',
      priority: 45,
      title: `Последний экзамен: ${context.exams.lastPercent}%`,
      description: 'Разберите ошибки и пройдите вариант ещё раз — цель 80 % и выше.',
      href: '/exams',
      actionLabel: 'Повторить экзамен',
    });
  }

  // 9. Серия занятий.
  if (!context.activeToday && context.streak > 0) {
    items.push({
      id: 'streak',
      kind: 'plan',
      priority: 40,
      title: `Серия: ${context.streak} ${plural(context.streak, 'день', 'дня', 'дней')} подряд`,
      description: 'Сегодня занятий ещё не было. Даже 20 минут сохранят серию и ритм подготовки.',
      href: '/plan',
      actionLabel: 'Открыть план',
    });
  }

  return items.sort((a, b) => b.priority - a.priority).slice(0, limit);
}

/**
 * Итог дня (раздел 40 ТЗ): «сегодня ты …» + план на завтра.
 */
export interface DailySummary {
  topicsStudied: number;
  tasksSolved: number;
  quizPercent: number | null;
  minutes: number;
}

export function summarizeDay(summary: DailySummary): string[] {
  const lines: string[] = [];
  if (summary.topicsStudied) {
    lines.push(`Изучено ${summary.topicsStudied} ${plural(summary.topicsStudied, 'тема', 'темы', 'тем')}`);
  }
  if (summary.tasksSolved) {
    lines.push(`Решено ${summary.tasksSolved} ${plural(summary.tasksSolved, 'задание', 'задания', 'заданий')}`);
  }
  if (summary.quizPercent !== null) lines.push(`Результат тестов: ${summary.quizPercent}%`);
  if (summary.minutes) lines.push(`Время занятий: ${summary.minutes} мин`);
  if (!lines.length) lines.push('Сегодня занятий пока не было');
  return lines;
}

function plural(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
