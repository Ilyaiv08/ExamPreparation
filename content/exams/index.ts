import type { Exam } from '../types';
import { DEMO_EXAMS } from './demo';
import { PRACTICE_EXAMS } from './practice';

/** Экзаменационные варианты: реальный ДЭ + тренировочные. */
export const ALL_EXAMS: Exam[] = [...DEMO_EXAMS, ...PRACTICE_EXAMS];

const byId = new Map(ALL_EXAMS.map((e) => [e.id, e]));

export function getExam(id: string): Exam | undefined {
  return byId.get(id);
}

export { EXAM_REQUIREMENTS, EXAM_META, EXAM_MODULE_META, requirementById, requirementsByModule } from './requirements';
