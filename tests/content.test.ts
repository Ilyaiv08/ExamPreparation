import { describe, expect, it } from 'vitest';
import { ALL_TOPICS } from '@/content/topics';
import { ALL_TASKS } from '@/content/tasks';
import { ALL_QUIZZES } from '@/content/quizzes';
import { ALL_PROJECTS } from '@/content/projects';
import { ALL_EXAMS } from '@/content/exams';
import { EXAM_REQUIREMENTS } from '@/content/exams/requirements';
import { ALL_DAYS, ALL_WEEKS } from '@/content/curriculum';
import { ACHIEVEMENTS } from '@/content/achievements';
import { scoreQuiz } from '@/lib/grading/logic';

/**
 * Интеграционные проверки контента.
 *
 * Дублируют часть `npm run content:check` намеренно: скрипт удобно запускать
 * руками, но в CI ошибки контента должны ронять тесты вместе с остальными.
 */

const topicIds = new Set(ALL_TOPICS.map((item) => item.id));
const taskIds = new Set(ALL_TASKS.map((item) => item.id));
const quizIds = new Set(ALL_QUIZZES.map((item) => item.id));
const projectIds = new Set(ALL_PROJECTS.map((item) => item.id));
const requirementIds = new Set(EXAM_REQUIREMENTS.map((item) => item.id));
const dayIds = new Set(ALL_DAYS.map((item) => item.id));

describe('учебная программа', () => {
  it('разобрана целиком: 30 недель по 7 дней', () => {
    expect(ALL_DAYS).toHaveLength(210);
  });

  it('идентификаторы дней уникальны', () => {
    expect(dayIds.size).toBe(ALL_DAYS.length);
  });

  it('у каждого дня есть объяснение простыми словами', () => {
    const without = ALL_DAYS.filter((day) => !day.plain).map((day) => day.id);
    expect(without).toEqual([]);
  });

  it('объяснение не пустое и не повторяет формулировку программы дословно', () => {
    const problems: string[] = [];

    for (const day of ALL_DAYS) {
      if (!day.plain) continue;
      if (day.plain.theory.trim().length < 30) problems.push(`${day.id}: слишком короткое «что изучаем»`);
      if (day.plain.practice.trim().length < 30) problems.push(`${day.id}: слишком короткое «что делаем»`);
      if (day.theory && day.plain.theory.trim() === day.theory.trim()) {
        problems.push(`${day.id}: объяснение совпадает с текстом программы`);
      }
      // Обратные кавычки — признак нетронутого технического перечисления.
      if (day.plain.theory.includes('`') || day.plain.practice.includes('`')) {
        problems.push(`${day.id}: в объяснении остался код в кавычках`);
      }
    }

    expect(problems).toEqual([]);
  });

  it('заголовок дня короткий и человеческий, а не обрезанный список терминов', () => {
    const problems = ALL_DAYS.filter((day) => day.title.length > 60 || day.title.includes('`')).map(
      (day) => `${day.id}: «${day.title}»`,
    );

    expect(problems).toEqual([]);
  });

  it('у каждого дня есть практическое задание', () => {
    // Практика нужна каждый день, включая повторения, контрольные и выходные:
    // день без задания превращается в чтение.
    const without = ALL_DAYS.filter((day) => day.taskIds.length === 0).map(
      (day) => `${day.id} (${day.kind})`,
    );

    expect(without).toEqual([]);
  });

  it('у седьмого дня каждой недели есть задание-сборка', () => {
    const without = ALL_WEEKS.map((week) => week.days.find((day) => day.dayNo === 7))
      .filter((day): day is NonNullable<typeof day> => Boolean(day) && day!.taskIds.length === 0)
      .map((day) => day.id);

    expect(without).toEqual([]);
  });

  it('задание седьмого дня опирается на материал своей недели', () => {
    // Сборка недели не должна ссылаться на день другой недели: иначе она
    // проверяет не то, что студент только что прошёл.
    const problems: string[] = [];

    for (const week of ALL_WEEKS) {
      const seventh = week.days.find((day) => day.dayNo === 7);
      if (!seventh) continue;

      for (const taskId of seventh.taskIds) {
        const task = ALL_TASKS.find((item) => item.id === taskId);
        if (!task) continue;
        if (task.weekNo !== undefined && task.weekNo !== week.weekNo) {
          problems.push(`${taskId}: неделя ${task.weekNo} вместо ${week.weekNo}`);
        }
      }
    }

    expect(problems).toEqual([]);
  });

  it('дословный текст программы остаётся нетронутым', () => {
    // Платформа переводит формулировки на человеческий язык, но первоисточник
    // не переписывает: раздел 46 ТЗ запрещает подменять содержание программы.
    const first = ALL_DAYS.find((day) => day.id === 'day-01-1');

    expect(first?.theory).toContain('HTTP-запрос и ответ');
    expect(first?.practice).toContain('node -v');
  });
});

describe('связность контента', () => {
  it('идентификаторы уникальны во всех коллекциях', () => {
    expect(topicIds.size).toBe(ALL_TOPICS.length);
    expect(taskIds.size).toBe(ALL_TASKS.length);
    expect(quizIds.size).toBe(ALL_QUIZZES.length);
    expect(projectIds.size).toBe(ALL_PROJECTS.length);
  });

  it('все ссылки тем ведут на существующие объекты', () => {
    const broken: string[] = [];

    for (const topic of ALL_TOPICS) {
      if (topic.quizId && !quizIds.has(topic.quizId)) broken.push(`${topic.id} → quiz ${topic.quizId}`);
      for (const id of topic.taskIds) if (!taskIds.has(id)) broken.push(`${topic.id} → task ${id}`);
      for (const id of topic.projectIds ?? []) {
        if (!projectIds.has(id)) broken.push(`${topic.id} → project ${id}`);
      }
      for (const id of topic.prerequisites) if (!topicIds.has(id)) broken.push(`${topic.id} → prereq ${id}`);
      for (const id of topic.examRefs) if (!requirementIds.has(id)) broken.push(`${topic.id} → req ${id}`);
      for (const id of topic.planDays) if (!dayIds.has(id)) broken.push(`${topic.id} → day ${id}`);
    }

    expect(broken).toEqual([]);
  });

  it('в предпосылках тем нет циклов', () => {
    const byId = new Map(ALL_TOPICS.map((topic) => [topic.id, topic]));
    const state = new Map<string, 'visiting' | 'done'>();
    const cycles: string[] = [];

    function visit(id: string, path: string[]): void {
      if (state.get(id) === 'done') return;
      if (state.get(id) === 'visiting') {
        cycles.push([...path, id].join(' → '));
        return;
      }
      state.set(id, 'visiting');
      for (const prereq of byId.get(id)?.prerequisites ?? []) visit(prereq, [...path, id]);
      state.set(id, 'done');
    }

    for (const topic of ALL_TOPICS) visit(topic.id, []);

    expect(cycles).toEqual([]);
  });

  it('каждая тема привязана хотя бы к одному дню программы', () => {
    const orphans = ALL_TOPICS.filter((topic) => topic.planDays.length === 0).map((topic) => topic.id);
    expect(orphans).toEqual([]);
  });

  it('у каждой темы есть теория, чек-лист «надо знать» и типичные ошибки', () => {
    const thin = ALL_TOPICS.filter(
      (topic) => !topic.theory.trim() || topic.mustKnow.length === 0 || topic.mistakes.length === 0,
    ).map((topic) => topic.id);

    expect(thin).toEqual([]);
  });
});

describe('практические задания', () => {
  it('у каждого задания есть тесты, разбор и три уровня подсказок', () => {
    const problems: string[] = [];

    for (const task of ALL_TASKS) {
      if (!task.tests.length) problems.push(`${task.id}: нет тестов`);
      if (!task.solution.trim()) problems.push(`${task.id}: нет разбора`);
      if (!task.solutionExplanation.trim()) problems.push(`${task.id}: нет объяснения разбора`);
      if (task.hints.length !== 3) problems.push(`${task.id}: подсказок ${task.hints.length}`);
      if (!task.starterCode.trim()) problems.push(`${task.id}: нет заготовки кода`);
    }

    expect(problems).toEqual([]);
  });

  it('максимальный балл задания равен сумме баллов его тестов', () => {
    const mismatched = ALL_TASKS.filter((task) => {
      const sum = task.tests.reduce((acc, test) => acc + (test.points ?? 1), 0);
      return sum !== task.maxScore;
    }).map((task) => task.id);

    expect(mismatched).toEqual([]);
  });

  it('штраф за подсказки растёт с их уровнем', () => {
    const wrong = ALL_TASKS.filter((task) => {
      const sorted = [...task.hints].sort((a, b) => a.level - b.level);
      return sorted.some((hint, index) => index > 0 && hint.penaltyPercent <= sorted[index - 1].penaltyPercent);
    }).map((task) => task.id);

    expect(wrong).toEqual([]);
  });

  it('SQL-задания на выборку получают данные для работы', () => {
    const empty = ALL_TASKS.filter((task) => task.runtime === 'sql' && task.kind !== 'db' && !task.setupSql).map(
      (task) => task.id,
    );

    expect(empty).toEqual([]);
  });

  it('каждое задание привязано хотя бы к одной теме', () => {
    const orphans = ALL_TASKS.filter((task) => task.topicIds.length === 0).map((task) => task.id);
    expect(orphans).toEqual([]);
  });
});

describe('теоретические тесты', () => {
  it('у каждой темы есть свой тест', () => {
    const without = ALL_TOPICS.filter((topic) => !topic.quizId).map((topic) => topic.id);
    expect(without).toEqual([]);
  });

  it('правильные ответы взяты из списка вариантов', () => {
    const problems: string[] = [];

    for (const quiz of ALL_QUIZZES) {
      for (const question of quiz.questions) {
        if (question.type === 'single') {
          const ids = question.options.map((option) => option.id);
          if (!ids.includes(question.correct)) problems.push(`${quiz.id}/${question.id}`);
        }
        if (question.type === 'multiple') {
          const ids = question.options.map((option) => option.id);
          if (!question.correct.length || question.correct.some((id) => !ids.includes(id))) {
            problems.push(`${quiz.id}/${question.id}`);
          }
        }
        if (question.type === 'order' && question.correct.length !== question.items.length) {
          problems.push(`${quiz.id}/${question.id}`);
        }
        if (question.type === 'match') {
          const left = question.left.map((option) => option.id);
          const right = question.right.map((option) => option.id);
          const pairs = Object.entries(question.correct);
          if (pairs.length !== left.length) problems.push(`${quiz.id}/${question.id}`);
          for (const [a, b] of pairs) {
            if (!left.includes(a) || !right.includes(b)) problems.push(`${quiz.id}/${question.id}`);
          }
        }
        if (question.type === 'text' && !question.correct.length) problems.push(`${quiz.id}/${question.id}`);
      }
    }

    expect(problems).toEqual([]);
  });

  it('у каждого вопроса есть пояснение — иначе тест не учит', () => {
    const silent: string[] = [];

    for (const quiz of ALL_QUIZZES) {
      for (const question of quiz.questions) {
        if (!question.explanation.trim()) silent.push(`${quiz.id}/${question.id}`);
      }
    }

    expect(silent).toEqual([]);
  });

  it('эталонные ответы действительно проходят проверку', () => {
    const failed: string[] = [];

    for (const quiz of ALL_QUIZZES) {
      const answers: Record<string, unknown> = {};
      for (const question of quiz.questions) {
        switch (question.type) {
          case 'single':
          case 'boolean':
            answers[question.id] = question.correct;
            break;
          case 'multiple':
          case 'order':
            answers[question.id] = [...question.correct];
            break;
          case 'match':
            answers[question.id] = { ...question.correct };
            break;
          case 'text':
            answers[question.id] = question.correct[0];
            break;
        }
      }

      const score = scoreQuiz(quiz, answers as never);
      if (score.percent !== 100) failed.push(`${quiz.id}: ${score.percent}%`);
    }

    expect(failed).toEqual([]);
  });

  it('проходной процент в разумных пределах', () => {
    const wrong = ALL_QUIZZES.filter((quiz) => quiz.passPercent < 50 || quiz.passPercent > 100).map((quiz) => quiz.id);
    expect(wrong).toEqual([]);
  });
});

describe('мини-проекты', () => {
  it('есть проект на каждый месяц программы', () => {
    const months = new Set(ALL_PROJECTS.map((project) => project.monthNo));
    expect([...months].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('сложность растёт от месяца к месяцу', () => {
    const byMonth = [...ALL_PROJECTS].sort((a, b) => a.monthNo - b.monthNo);
    for (let i = 1; i < byMonth.length; i += 1) {
      expect(byMonth[i].difficulty).toBeGreaterThanOrEqual(byMonth[i - 1].difficulty);
    }
  });

  it('у каждого проекта есть ТЗ, требования, ограничения, чек-лист и подсказки', () => {
    const problems: string[] = [];

    for (const project of ALL_PROJECTS) {
      if (!project.brief.trim()) problems.push(`${project.id}: нет ТЗ`);
      if (!project.requirements.length) problems.push(`${project.id}: нет требований`);
      if (!project.constraints.length) problems.push(`${project.id}: нет ограничений`);
      if (!project.checklist.length) problems.push(`${project.id}: нет чек-листа`);
      if (project.hints.length !== 3) problems.push(`${project.id}: подсказок ${project.hints.length}`);
    }

    expect(problems).toEqual([]);
  });

  it('баллы автопроверки сходятся с заявленным максимумом', () => {
    const mismatched = ALL_PROJECTS.filter((project) => {
      if (!project.autoCheck) return false;
      const sum = project.autoCheck.tests.reduce((acc, test) => acc + (test.points ?? 1), 0);
      return sum !== project.autoCheck.maxScore;
    }).map((project) => project.id);

    expect(mismatched).toEqual([]);
  });

  it('в каждом чек-листе есть хотя бы один ручной пункт — платформа не притворяется, что проверяет всё', () => {
    const allAuto = ALL_PROJECTS.filter(
      (project) => !project.checklist.some((item) => item.verification === 'manual'),
    ).map((project) => project.id);

    expect(allAuto).toEqual([]);
  });
});

describe('требования демоэкзамена', () => {
  it('веса требований в сумме дают ровно 100', () => {
    const total = EXAM_REQUIREMENTS.reduce((sum, item) => sum + item.weight, 0);
    expect(total).toBe(100);
  });

  it('требования покрывают все три модуля', () => {
    const modules = new Set(EXAM_REQUIREMENTS.map((item) => item.moduleNo));
    expect([...modules].sort()).toEqual([1, 2, 3]);
  });

  it('у каждого требования есть дословная цитата задания и чек-лист', () => {
    const problems = EXAM_REQUIREMENTS.filter((item) => !item.quote.trim() || !item.checklist.length).map(
      (item) => item.id,
    );
    expect(problems).toEqual([]);
  });

  it('каждое требование связано с темами, по которым к нему готовятся', () => {
    const problems: string[] = [];

    for (const requirement of EXAM_REQUIREMENTS) {
      if (!requirement.topicIds.length) problems.push(`${requirement.id}: нет тем`);
      for (const id of requirement.topicIds) {
        if (!topicIds.has(id)) problems.push(`${requirement.id} → ${id}`);
      }
    }

    expect(problems).toEqual([]);
  });
});

describe('экзаменационные варианты', () => {
  it('официальный вариант ровно один и помечен как задание демоэкзамена', () => {
    const demo = ALL_EXAMS.filter((exam) => exam.kind === 'demo');

    expect(demo).toHaveLength(1);
    expect(demo[0].source).toBe('exam');
  });

  it('тренировочные варианты честно помечены как авторские', () => {
    for (const exam of ALL_EXAMS.filter((item) => item.kind === 'practice')) {
      expect(exam.source).toBe('author');
      expect(exam.sourceNote).toMatch(/разработчиком платформы/i);
    }
  });

  it('регламент соблюдён: три модуля и четыре часа', () => {
    for (const exam of ALL_EXAMS) {
      expect(exam.modules.map((module) => module.moduleNo)).toEqual([1, 2, 3]);
      const minutes = exam.modules.reduce((sum, module) => sum + module.minutes, 0);
      expect(minutes).toBe(exam.totalMinutes);
      expect(exam.totalMinutes).toBe(240);
    }
  });

  it('все задания вариантов ссылаются на существующий контент', () => {
    const broken: string[] = [];

    for (const exam of ALL_EXAMS) {
      for (const examModule of exam.modules) {
        for (const task of examModule.tasks) {
          if (task.kind === 'code' && !taskIds.has(task.taskId)) broken.push(`${exam.id} → task ${task.taskId}`);
          if (task.kind === 'quiz' && !quizIds.has(task.quizId)) broken.push(`${exam.id} → quiz ${task.quizId}`);
          if (task.kind === 'checklist') {
            const sum = task.items.reduce((acc, item) => acc + item.points, 0);
            if (sum !== task.points) broken.push(`${exam.id} → чек-лист ${task.id}: ${sum} ≠ ${task.points}`);
          }
        }
      }
    }

    expect(broken).toEqual([]);
  });

  it('в каждом модуле есть и автопроверка, и ручной чек-лист', () => {
    const problems: string[] = [];

    for (const exam of ALL_EXAMS) {
      for (const examModule of exam.modules) {
        const hasAuto = examModule.tasks.some((task) => task.kind !== 'checklist');
        const hasManual = examModule.tasks.some((task) => task.kind === 'checklist');
        if (!hasAuto) problems.push(`${exam.id}/${examModule.id}: нет автопроверяемых заданий`);
        if (!hasManual) problems.push(`${exam.id}/${examModule.id}: нет чек-листа`);
      }
    }

    expect(problems).toEqual([]);
  });
});

describe('достижения', () => {
  it('коды уникальны, у каждого достижения есть название, описание и значок', () => {
    const codes = new Set(ACHIEVEMENTS.map((item) => item.code));
    expect(codes.size).toBe(ACHIEVEMENTS.length);

    const problems = ACHIEVEMENTS.filter(
      (item) => !item.title.trim() || !item.description.trim() || !item.icon.trim(),
    ).map((item) => item.code);
    expect(problems).toEqual([]);
  });

  it('достижения за счётчики идут по возрастанию и не дублируют порог', () => {
    const counters = new Map<string, number[]>();

    for (const item of ACHIEVEMENTS) {
      if ('count' in item.rule) {
        const list = counters.get(item.rule.type) ?? [];
        list.push(item.rule.count);
        counters.set(item.rule.type, list);
      }
    }

    for (const [type, values] of counters) {
      expect(new Set(values).size, `дубликат порога в ${type}`).toBe(values.length);
    }
  });
});
