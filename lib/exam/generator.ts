import 'server-only';

import type { Difficulty, Exam, ExamLevel, ExamModule, ExamTask, Task } from '@/content/types';
import { EXAM_MODULE_META, EXAM_REQUIREMENTS } from '@/content/exams/requirements';

/**
 * Генератор тренировочных вариантов (раздел 22 ТЗ).
 *
 * Вариант собирается не случайно: берутся задания, покрывающие требования
 * реального экзамена, с приоритетом слабых тем студента и с учётом
 * выбранного уровня сложности.
 */

const LEVEL_SETTINGS: Record<
  ExamLevel,
  { difficulties: Difficulty[]; tasksPerModule: number; minutes: [number, number, number]; title: string }
> = {
  easy: { difficulties: [1, 2], tasksPerModule: 2, minutes: [40, 40, 25], title: 'Лёгкий' },
  standard: { difficulties: [2, 3], tasksPerModule: 3, minutes: [60, 60, 40], title: 'Стандартный' },
  hard: { difficulties: [3, 4], tasksPerModule: 3, minutes: [75, 75, 50], title: 'Сложный' },
  exam: { difficulties: [3, 4, 5], tasksPerModule: 4, minutes: [90, 90, 60], title: 'Экзаменационный' },
};

/** Предметные области для тренировки: программа советует не зубрить один проект. */
export const PRACTICE_DOMAINS = [
  { id: 'courses', title: 'Запись на курсы', description: 'Пользователь выбирает курс, дату старта и способ оплаты; администратор меняет статусы.' },
  { id: 'autoservice', title: 'Запись в автосервис', description: 'Клиент выбирает услугу, дату визита и способ оплаты; мастер меняет статус заявки.' },
  { id: 'cleaning', title: 'Клининговые услуги', description: 'Заказ уборки помещения: тип уборки, дата, оплата; диспетчер ведёт статусы.' },
  { id: 'coworking', title: 'Аренда рабочих мест', description: 'Бронирование места в коворкинге: тип места, дата, оплата.' },
  { id: 'medical', title: 'Запись к врачу', description: 'Пациент выбирает специалиста, дату приёма и способ оплаты.' },
] as const;

export type PracticeDomainId = (typeof PRACTICE_DOMAINS)[number]['id'];

export interface GenerateOptions {
  level: ExamLevel;
  domainId?: PracticeDomainId;
  /** Темы, по которым студент слабее всего — они получают приоритет. */
  weakTopicIds?: string[];
  /** Задания, уже решённые студентом: их берём в последнюю очередь. */
  solvedTaskIds?: string[];
  /** Ограничить месяцами (например, только пройденный материал). */
  maxMonthNo?: number;
}

/** Оценка полезности задания для варианта. Чем выше — тем раньше попадёт. */
function scoreTask(task: Task, options: GenerateOptions, settings: (typeof LEVEL_SETTINGS)[ExamLevel]): number {
  let score = 0;

  if (settings.difficulties.includes(task.difficulty)) score += 40;
  else score -= Math.abs(task.difficulty - settings.difficulties[0]) * 12;

  // Задания, привязанные к требованиям экзамена, важнее прочих.
  score += task.examRefs.length * 12;
  for (const ref of task.examRefs) {
    const requirement = EXAM_REQUIREMENTS.find((item) => item.id === ref);
    if (requirement) score += requirement.weight;
  }

  if (options.weakTopicIds?.some((topicId) => task.topicIds.includes(topicId))) score += 30;
  if (options.solvedTaskIds?.includes(task.id)) score -= 25;
  if (options.maxMonthNo && task.monthNo > options.maxMonthNo) score -= 60;

  return score;
}

/** Модуль экзамена, к которому логичнее отнести задание. */
function moduleOf(task: Task): 1 | 2 | 3 {
  const refs = task.examRefs.join(' ');
  if (refs.includes('m2-')) return 2;
  if (refs.includes('m3-')) return 3;
  if (refs.includes('m1-')) return 1;
  if (task.tech.includes('css') || task.tech.includes('design')) return 2;
  if (task.tech.includes('security')) return 3;
  return 1;
}

export function generateExam(pool: Task[], options: GenerateOptions): Exam {
  const settings = LEVEL_SETTINGS[options.level];
  const domain = PRACTICE_DOMAINS.find((item) => item.id === options.domainId) ?? PRACTICE_DOMAINS[0];

  const ranked = [...pool]
    .map((task) => ({ task, score: scoreTask(task, options, settings) }))
    .sort((a, b) => b.score - a.score);

  const usedTopics = new Set<string>();
  const chosen: Record<1 | 2 | 3, Task[]> = { 1: [], 2: [], 3: [] };

  for (const { task } of ranked) {
    const moduleNo = moduleOf(task);
    if (chosen[moduleNo].length >= settings.tasksPerModule) continue;
    // Не берём подряд задания по одной и той же теме, пока есть другие.
    const overlaps = task.topicIds.some((topicId) => usedTopics.has(topicId));
    if (overlaps && chosen[moduleNo].length > 0) continue;
    chosen[moduleNo].push(task);
    task.topicIds.forEach((topicId) => usedTopics.add(topicId));
  }

  // Добираем недостающие задания, если по темам выбрать не удалось.
  for (const { task } of ranked) {
    const moduleNo = moduleOf(task);
    if (chosen[moduleNo].length >= settings.tasksPerModule) continue;
    if (chosen[moduleNo].some((item) => item.id === task.id)) continue;
    chosen[moduleNo].push(task);
  }

  const modules: ExamModule[] = EXAM_MODULE_META.map((meta, index) => {
    const tasks: ExamTask[] = chosen[meta.moduleNo].map((task) => ({
      id: `gen-${meta.moduleNo}-${task.id}`,
      kind: 'code' as const,
      taskId: task.id,
      points: Math.max(4, task.difficulty * 3),
      title: task.title,
    }));

    const requirements = EXAM_REQUIREMENTS.filter((item) => item.moduleNo === meta.moduleNo && item.verification !== 'auto');
    const checklistItems = requirements.map((requirement) => ({
      id: `gen-check-${requirement.id}`,
      text: requirement.checklist[0] ?? requirement.title,
      points: Math.max(1, Math.round(requirement.weight / 2)),
      quote: requirement.quote,
    }));
    const checklistPoints = checklistItems.reduce((sum, item) => sum + item.points, 0);

    if (checklistItems.length) {
      tasks.push({
        id: `gen-${meta.moduleNo}-checklist`,
        kind: 'checklist' as const,
        title: `Чек-лист модуля ${meta.moduleNo}`,
        description: `Проверьте в своём проекте по теме «${domain.title}».`,
        items: checklistItems,
        points: checklistPoints,
      });
    }

    return {
      id: `gen-module-${meta.moduleNo}`,
      moduleNo: meta.moduleNo,
      title: meta.title,
      minutes: settings.minutes[index],
      instruction: buildInstruction(meta.moduleNo, domain.title, domain.description),
      tasks,
    };
  });

  const totalMinutes = modules.reduce((sum, module) => sum + module.minutes, 0);

  return {
    id: `generated-${Date.now()}`,
    title: `Тренировочный вариант · ${settings.title} · ${domain.title}`,
    kind: 'generated',
    level: options.level,
    domain: domain.title,
    source: 'author',
    sourceNote:
      'Вариант собран платформой из базы заданий по структуре реального демоэкзамена. Это тренировка, а не официальное задание.',
    description: `${domain.description}\n\nСтруктура повторяет реальный экзамен: три модуля с отдельными таймерами. Задания подобраны под уровень «${settings.title.toLowerCase()}» с приоритетом ваших слабых тем.`,
    totalMinutes,
    modules,
    examRefs: EXAM_REQUIREMENTS.map((item) => item.id),
  };
}

function buildInstruction(moduleNo: 1 | 2 | 3, domainTitle: string, domainDescription: string): string {
  const base = EXAM_MODULE_META.find((item) => item.moduleNo === moduleNo);
  const common = `**Предметная область варианта:** ${domainTitle}. ${domainDescription}\n\n**Формулировка модуля реального экзамена:** ${base?.quote ?? ''}`;

  if (moduleNo === 1) {
    return `${common}\n\nВ своём проекте: спроектируйте БД и ER-диаграмму, сделайте регистрацию с валидацией, вход, личный кабинет, страницу заявки и админку со сменой статуса. Ниже — задания, которые платформа проверит автоматически.`;
  }
  if (moduleNo === 2) {
    return `${common}\n\nВ своём проекте: приведите внешний вид в порядок, проверьте экран 390×844, добавьте слайдер из четырёх изображений с автопереключением каждые 3 секунды, подсказки об ошибках и инструменты админки.`;
  }
  return `${common}\n\nВ своём проекте: доработайте БД, закройте дыры безопасности, добавьте состояния загрузки и ошибок, микроанимации и ещё раз проверьте мобильную версию.`;
}
