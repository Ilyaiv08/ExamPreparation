import type { Task } from '../types';
import { MONTH_01_TASKS } from './month-01';
import { MONTH_01_CSS_TASKS } from './month-01-css';
import { MONTH_01_DAILY_TASKS } from './month-01-daily';
import { MONTH_02_TASKS } from './month-02';
import { MONTH_02_JS_TASKS } from './month-02-js';
import { MONTH_02_DOM_TASKS } from './month-02-dom';
import { MONTH_02_TS_TASKS } from './month-02-ts';
import { MONTH_02_DAILY_TASKS } from './month-02-daily';
import { MONTH_03_TASKS } from './month-03';
import { MONTH_03_APP_TASKS } from './month-03-app';
import { MONTH_03_DAILY_TASKS } from './month-03-daily';
import { MONTH_04_TASKS } from './month-04';
import { MONTH_04_SQL_TASKS } from './month-04-sql';
import { MONTH_04_SERVER_TASKS } from './month-04-server';
import { MONTH_04_DAILY_TASKS } from './month-04-daily';
import { MONTH_05_TASKS } from './month-05';
import { MONTH_05_DAILY_TASKS } from './month-05-daily';
import { MONTH_06_TASKS } from './month-06';
import { MONTH_06_DAILY_TASKS } from './month-06-daily';
import { MONTH_07_TASKS } from './month-07';
import { MONTH_07_DAILY_TASKS } from './month-07-daily';
import { WEEK_ASSEMBLY_TASKS } from './week-assembly';

/** Все практические задания платформы. */
export const ALL_TASKS: Task[] = [
  ...MONTH_01_TASKS,
  ...MONTH_01_CSS_TASKS,
  ...MONTH_01_DAILY_TASKS,
  ...MONTH_02_TASKS,
  ...MONTH_02_JS_TASKS,
  ...MONTH_02_DOM_TASKS,
  ...MONTH_02_TS_TASKS,
  ...MONTH_02_DAILY_TASKS,
  ...MONTH_03_TASKS,
  ...MONTH_03_APP_TASKS,
  ...MONTH_03_DAILY_TASKS,
  ...MONTH_04_TASKS,
  ...MONTH_04_SQL_TASKS,
  ...MONTH_04_SERVER_TASKS,
  ...MONTH_04_DAILY_TASKS,
  ...MONTH_05_TASKS,
  ...MONTH_05_DAILY_TASKS,
  ...MONTH_06_TASKS,
  ...MONTH_06_DAILY_TASKS,
  ...MONTH_07_TASKS,
  ...MONTH_07_DAILY_TASKS,
  ...WEEK_ASSEMBLY_TASKS,
];

const byId = new Map(ALL_TASKS.map((t) => [t.id, t]));

export function getTask(id: string): Task | undefined {
  return byId.get(id);
}

export function tasksByTopic(topicId: string): Task[] {
  return ALL_TASKS.filter((t) => t.topicIds.includes(topicId));
}

export function tasksByMonth(monthNo: number): Task[] {
  return ALL_TASKS.filter((t) => t.monthNo === monthNo);
}
