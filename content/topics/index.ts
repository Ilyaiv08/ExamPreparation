import type { Topic } from '../types';
import { MONTH_01_TOPICS } from './month-01';
import { MONTH_02_TOPICS } from './month-02';
import { MONTH_03_TOPICS } from './month-03';
import { MONTH_04_TOPICS } from './month-04';
import { MONTH_05_TOPICS } from './month-05';
import { MONTH_06_TOPICS } from './month-06';
import { MONTH_07_TOPICS } from './month-07';

/** Все темы платформы. Порядок = порядок изучения по программе. */
export const ALL_TOPICS: Topic[] = [
  ...MONTH_01_TOPICS,
  ...MONTH_02_TOPICS,
  ...MONTH_03_TOPICS,
  ...MONTH_04_TOPICS,
  ...MONTH_05_TOPICS,
  ...MONTH_06_TOPICS,
  ...MONTH_07_TOPICS,
];

const byId = new Map(ALL_TOPICS.map((t) => [t.id, t]));

export function getTopic(id: string): Topic | undefined {
  return byId.get(id);
}

export function topicsByMonth(monthNo: number): Topic[] {
  return ALL_TOPICS.filter((t) => t.monthNo === monthNo);
}
