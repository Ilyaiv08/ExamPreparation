import type { Task } from '../types';
import { WEEK_ASSEMBLY_M1 } from './week-assembly-m1';
import { WEEK_ASSEMBLY_M2 } from './week-assembly-m2';
import { WEEK_ASSEMBLY_M3 } from './week-assembly-m3';
import { WEEK_ASSEMBLY_M4 } from './week-assembly-m4';
import { WEEK_ASSEMBLY_M5 } from './week-assembly-m5';
import { WEEK_ASSEMBLY_M6 } from './week-assembly-m6';
import { WEEK_ASSEMBLY_M7 } from './week-assembly-m7';

/**
 * Седьмой день каждой недели — сборка.
 *
 * Отличие от обычного дня: задание не вводит ничего нового, а требует
 * применить всё, что появилось за неделю, сразу и без подсказок.
 * Так проверяется не «помню ли я свойство», а «умею ли я собрать из них
 * рабочую страницу» — ровно то, что происходит на демоэкзамене.
 *
 * Правило для всех заданий этой группы: каждое требование опирается
 * на конкретный день своей недели. Если в задании появилось то,
 * чего на неделе не было, — задание составлено неверно.
 *
 * Файлы разбиты по месяцам: сборки недель 1-4 лежат в week-assembly-m1 и так далее.
 */
export const WEEK_ASSEMBLY_TASKS: Task[] = [...WEEK_ASSEMBLY_M1, ...WEEK_ASSEMBLY_M2, ...WEEK_ASSEMBLY_M3, ...WEEK_ASSEMBLY_M4, ...WEEK_ASSEMBLY_M5, ...WEEK_ASSEMBLY_M6, ...WEEK_ASSEMBLY_M7];
