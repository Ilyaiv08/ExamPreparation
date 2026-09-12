import type { Quiz } from '../types';
import { MONTH_01_QUIZZES } from './month-01';
import { MONTH_02_QUIZZES } from './month-02';
import { MONTH_03_QUIZZES } from './month-03';
import { MONTH_04_QUIZZES } from './month-04';
import { MONTH_05_QUIZZES } from './month-05';
import { MONTH_06_QUIZZES } from './month-06';
import { MONTH_07_QUIZZES } from './month-07';

/** Все теоретические тесты платформы. */
export const ALL_QUIZZES: Quiz[] = [
  ...MONTH_01_QUIZZES,
  ...MONTH_02_QUIZZES,
  ...MONTH_03_QUIZZES,
  ...MONTH_04_QUIZZES,
  ...MONTH_05_QUIZZES,
  ...MONTH_06_QUIZZES,
  ...MONTH_07_QUIZZES,
];

const byId = new Map(ALL_QUIZZES.map((q) => [q.id, q]));

export function getQuiz(id: string): Quiz | undefined {
  return byId.get(id);
}

export function quizzesByTopic(topicId: string): Quiz[] {
  return ALL_QUIZZES.filter((q) => q.topicIds.includes(topicId));
}
