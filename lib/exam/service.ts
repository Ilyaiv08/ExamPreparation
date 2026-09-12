import 'server-only';

import type { Exam, ExamTask } from '@/content/types';
import { EXAM_REQUIREMENTS } from '@/content/exams/requirements';

/**
 * Разбор результатов экзамена: баллы по модулям, сильные и слабые стороны,
 * персональный план (разделы 21 и 44 ТЗ).
 */

export interface AnswerRecord {
  examTaskId: string;
  kind: string;
  score: number;
  maxScore: number;
  passed: boolean;
  answerJson: string;
  resultJson: string;
}

export interface ExamAnalysis {
  strengths: { title: string; percent: number }[];
  weaknesses: { title: string; percent: number; advice: string }[];
  plan: string[];
  byModule: { moduleNo: number; title: string; score: number; maxScore: number; percent: number }[];
  auto: { score: number; maxScore: number };
  manual: { score: number; maxScore: number };
}

export function maxPointsOf(task: ExamTask): number {
  return task.points;
}

export function examMaxScore(exam: Exam): number {
  return exam.modules.reduce(
    (sum, module) => sum + module.tasks.reduce((moduleSum, task) => moduleSum + maxPointsOf(task), 0),
    0,
  );
}

export function examTaskCount(exam: Exam): number {
  return exam.modules.reduce((sum, module) => sum + module.tasks.length, 0);
}

/** Разбор попытки: что получилось, что нет и что делать дальше. */
export function analyzeAttempt(exam: Exam, answers: AnswerRecord[]): ExamAnalysis {
  const byId = new Map(answers.map((item) => [item.examTaskId, item]));

  const byModule = exam.modules.map((module) => {
    const score = module.tasks.reduce((sum, task) => sum + (byId.get(task.id)?.score ?? 0), 0);
    const maxScore = module.tasks.reduce((sum, task) => sum + maxPointsOf(task), 0);
    return {
      moduleNo: module.moduleNo,
      title: module.title,
      score: Math.round(score * 100) / 100,
      maxScore,
      percent: maxScore ? Math.round((score / maxScore) * 100) : 0,
    };
  });

  // Автоматическая и ручная части считаются раздельно: студент должен видеть,
  // что реально проверено кодом, а что он отметил сам.
  let autoScore = 0;
  let autoMax = 0;
  let manualScore = 0;
  let manualMax = 0;
  for (const examModule of exam.modules) {
    for (const task of examModule.tasks) {
      const answer = byId.get(task.id);
      if (task.kind === 'checklist') {
        manualScore += answer?.score ?? 0;
        manualMax += task.points;
      } else {
        autoScore += answer?.score ?? 0;
        autoMax += task.points;
      }
    }
  }

  // Сильные и слабые стороны — по требованиям экзамена, а не по абстрактным темам.
  const requirementScores = new Map<string, { score: number; max: number }>();

  for (const examModule of exam.modules) {
    for (const task of examModule.tasks) {
      const answer = byId.get(task.id);
      if (task.kind !== 'checklist') continue;
      // Пункты чек-листа связаны с требованиями модуля по номеру модуля.
      const moduleRequirements = EXAM_REQUIREMENTS.filter((item) => item.moduleNo === examModule.moduleNo);
      const share = task.points ? (answer?.score ?? 0) / task.points : 0;
      for (const requirement of moduleRequirements) {
        const entry = requirementScores.get(requirement.id) ?? { score: 0, max: 0 };
        entry.score += share * requirement.weight;
        entry.max += requirement.weight;
        requirementScores.set(requirement.id, entry);
      }
    }
  }

  const ranked = [...requirementScores.entries()]
    .map(([id, value]) => {
      const requirement = EXAM_REQUIREMENTS.find((item) => item.id === id);
      return {
        id,
        title: requirement?.title ?? id,
        percent: value.max ? Math.round((value.score / value.max) * 100) : 0,
        advice: requirement?.pitfalls?.[0] ?? requirement?.checklist[0] ?? '',
      };
    })
    .sort((a, b) => b.percent - a.percent);

  const strengths = ranked.filter((item) => item.percent >= 80).slice(0, 5);
  const weaknesses = ranked.filter((item) => item.percent < 70).slice(0, 5);

  const plan: string[] = [];
  for (const item of weaknesses.slice(0, 3)) {
    plan.push(`Повторить: ${item.title}${item.advice ? ` — ${item.advice}` : ''}`);
  }
  const weakestModule = [...byModule].sort((a, b) => a.percent - b.percent)[0];
  if (weakestModule && weakestModule.percent < 80) {
    plan.push(
      `Прогнать модуль ${weakestModule.moduleNo} отдельно на время: сейчас ${weakestModule.percent}% от максимума.`,
    );
  }
  if (autoMax && autoScore / autoMax < 0.7) {
    plan.push('Добрать практику: автоматически проверяемые задания дались хуже ручного чек-листа.');
  }
  plan.push('Пройти вариант ещё раз через несколько дней и сравнить результат.');

  return {
    strengths: strengths.map((item) => ({ title: item.title, percent: item.percent })),
    weaknesses: weaknesses.map((item) => ({ title: item.title, percent: item.percent, advice: item.advice })),
    plan,
    byModule,
    auto: { score: Math.round(autoScore * 100) / 100, maxScore: autoMax },
    manual: { score: Math.round(manualScore * 100) / 100, maxScore: manualMax },
  };
}

export interface ModuleState {
  moduleId: string;
  moduleNo: number;
  startedAt: string | null;
  endsAt: string | null;
  finished: boolean;
}

export function initialModuleState(exam: Exam): ModuleState[] {
  return exam.modules.map((module) => ({
    moduleId: module.id,
    moduleNo: module.moduleNo,
    startedAt: null,
    endsAt: null,
    finished: false,
  }));
}
