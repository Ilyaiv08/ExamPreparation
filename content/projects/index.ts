import type { Project } from '../types';
import { PROJECTS } from './projects';

/** Мини-проекты: сложность растёт от месяца к месяцу (раздел 23 ТЗ). */
export const ALL_PROJECTS: Project[] = PROJECTS;

const byId = new Map(ALL_PROJECTS.map((p) => [p.id, p]));

export function getProject(id: string): Project | undefined {
  return byId.get(id);
}

export function projectsByMonth(monthNo: number): Project[] {
  return ALL_PROJECTS.filter((p) => p.monthNo === monthNo);
}
