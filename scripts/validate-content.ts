/**
 * Проверка целостности учебного контента.
 *
 * Запуск: npm run content:check
 *
 * Ловит ровно те ошибки, которые ломают платформу незаметно:
 * ссылка на несуществующую тему, дубликат идентификатора, тест без имени,
 * задание, которое ни с чем не связано.
 */
import { ALL_TOPICS } from '../content/topics';
import { ALL_TASKS } from '../content/tasks';
import { ALL_QUIZZES } from '../content/quizzes';
import { ALL_PROJECTS } from '../content/projects';
import { ALL_EXAMS } from '../content/exams';
import { EXAM_REQUIREMENTS } from '../content/exams/requirements';
import { ALL_DAYS, ALL_WEEKS } from '../content/curriculum';
import { ACHIEVEMENTS } from '../content/achievements';

const problems: string[] = [];
const warnings: string[] = [];

const fail = (message: string) => problems.push(message);
const warn = (message: string) => warnings.push(message);

const topicIds = new Set(ALL_TOPICS.map((item) => item.id));
const taskIds = new Set(ALL_TASKS.map((item) => item.id));
const quizIds = new Set(ALL_QUIZZES.map((item) => item.id));
const projectIds = new Set(ALL_PROJECTS.map((item) => item.id));
const requirementIds = new Set(EXAM_REQUIREMENTS.map((item) => item.id));
const dayIds = new Set(ALL_DAYS.map((item) => item.id));

function checkDuplicates(name: string, ids: string[]) {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) fail(`${name}: дубликат идентификатора «${id}»`);
    seen.add(id);
  }
}

checkDuplicates('Темы', ALL_TOPICS.map((item) => item.id));
checkDuplicates('Задания', ALL_TASKS.map((item) => item.id));
checkDuplicates('Тесты', ALL_QUIZZES.map((item) => item.id));
checkDuplicates('Проекты', ALL_PROJECTS.map((item) => item.id));
checkDuplicates('Экзамены', ALL_EXAMS.map((item) => item.id));
checkDuplicates('Достижения', ACHIEVEMENTS.map((item) => item.code));

// ───────────────────────────────── Темы ─────────────────────────────────
for (const topic of ALL_TOPICS) {
  const where = `Тема «${topic.id}»`;
  if (!topic.title) fail(`${where}: пустой заголовок`);
  if (!topic.summary) fail(`${where}: нет краткого описания`);
  if (!topic.theory || topic.theory.length < 200) fail(`${where}: теория слишком короткая`);
  if (!topic.mustKnow.length) fail(`${where}: пустой список «что необходимо знать»`);

  for (const id of topic.prerequisites) {
    if (!topicIds.has(id)) fail(`${where}: ссылается на несуществующую тему-предпосылку «${id}»`);
  }
  for (const id of topic.taskIds) {
    if (!taskIds.has(id)) fail(`${where}: ссылается на несуществующее задание «${id}»`);
  }
  for (const id of topic.projectIds ?? []) {
    if (!projectIds.has(id)) fail(`${where}: ссылается на несуществующий проект «${id}»`);
  }
  if (topic.quizId && !quizIds.has(topic.quizId)) {
    warn(`${where}: тест «${topic.quizId}» ещё не создан`);
  }
  for (const id of topic.examRefs) {
    if (!requirementIds.has(id)) fail(`${where}: неизвестное требование экзамена «${id}»`);
  }
  for (const dayId of topic.planDays) {
    if (!dayIds.has(dayId)) fail(`${where}: привязана к несуществующему дню «${dayId}»`);
  }
  if (!topic.planDays.length) warn(`${where}: не привязана ни к одному дню программы`);
}

// ──────────────────────────────── Задания ────────────────────────────────
for (const task of ALL_TASKS) {
  const where = `Задание «${task.id}»`;
  if (!task.title) fail(`${where}: пустой заголовок`);
  if (!task.statement) fail(`${where}: нет условия`);
  if (!task.tests.length) fail(`${where}: нет ни одного теста — проверять будет нечем`);
  if (!task.solution) fail(`${where}: нет разбора решения`);
  if (task.maxScore <= 0) fail(`${where}: maxScore должен быть больше нуля`);

  const testIds = new Set<string>();
  for (const test of task.tests) {
    if (!test.id) fail(`${where}: тест без идентификатора`);
    if (testIds.has(test.id)) fail(`${where}: дубликат теста «${test.id}»`);
    testIds.add(test.id);
    if (!test.name) fail(`${where}: тест «${test.id}» без названия`);
  }

  // Балл задания должен совпадать с суммой баллов тестов, иначе прогресс врёт.
  const testPoints = task.tests.reduce((sum, test) => sum + (test.points ?? 1), 0);
  if (testPoints !== task.maxScore) {
    fail(`${where}: сумма баллов тестов ${testPoints} не совпадает с maxScore ${task.maxScore}`);
  }

  const levels = task.hints.map((hint) => hint.level).sort();
  if (task.hints.length && levels.join(',') !== [...new Set(levels)].join(',')) {
    fail(`${where}: повторяющиеся уровни подсказок`);
  }
  if (task.hints.length !== 3) warn(`${where}: подсказок ${task.hints.length}, ожидалось три уровня`);

  for (const id of task.topicIds) {
    if (!topicIds.has(id)) fail(`${where}: ссылается на несуществующую тему «${id}»`);
  }
  for (const id of task.examRefs) {
    if (!requirementIds.has(id)) fail(`${where}: неизвестное требование экзамена «${id}»`);
  }
  for (const dayId of task.planDays ?? []) {
    if (!dayIds.has(dayId)) fail(`${where}: привязано к несуществующему дню «${dayId}»`);
  }
  // Задания вида «спроектируйте схему» начинают с пустой базы — setupSql им не нужен.
  if (task.runtime === 'sql' && task.kind !== 'db' && !task.setupSql) {
    warn(`${where}: SQL-задание без setupSql — студенту не с чем работать`);
  }
}

// ───────────────────────────────── Тесты ─────────────────────────────────
for (const quiz of ALL_QUIZZES) {
  const where = `Тест «${quiz.id}»`;
  if (!quiz.questions.length) fail(`${where}: нет вопросов`);
  const questionIds = new Set<string>();
  for (const question of quiz.questions) {
    if (questionIds.has(question.id)) fail(`${where}: дубликат вопроса «${question.id}»`);
    questionIds.add(question.id);
    if (!question.text) fail(`${where}: вопрос «${question.id}» без текста`);
    if (!question.explanation) warn(`${where}: вопрос «${question.id}» без пояснения`);

    if (question.type === 'single') {
      const ids = question.options.map((option) => option.id);
      if (!ids.includes(question.correct)) fail(`${where}: у вопроса «${question.id}» правильный ответ не из списка`);
      if (question.options.length < 2) fail(`${where}: у вопроса «${question.id}» меньше двух вариантов`);
    }
    if (question.type === 'multiple') {
      const ids = question.options.map((option) => option.id);
      for (const id of question.correct) {
        if (!ids.includes(id)) fail(`${where}: у вопроса «${question.id}» правильный ответ «${id}» не из списка`);
      }
      if (!question.correct.length) fail(`${where}: у вопроса «${question.id}» не отмечен ни один верный вариант`);
    }
    if (question.type === 'match') {
      const leftIds = question.left.map((option) => option.id);
      const rightIds = question.right.map((option) => option.id);
      for (const [left, right] of Object.entries(question.correct)) {
        if (!leftIds.includes(left)) fail(`${where}: в вопросе «${question.id}» нет левого элемента «${left}»`);
        if (!rightIds.includes(right)) fail(`${where}: в вопросе «${question.id}» нет правого элемента «${right}»`);
      }
    }
    if (question.type === 'order') {
      const ids = question.items.map((option) => option.id);
      if (question.correct.length !== ids.length) {
        fail(`${where}: в вопросе «${question.id}» порядок задан не для всех элементов`);
      }
    }
    if (question.type === 'text' && !question.correct.length) {
      fail(`${where}: у вопроса «${question.id}» нет ни одного правильного ответа`);
    }
  }
  for (const id of quiz.topicIds) {
    if (!topicIds.has(id)) fail(`${where}: ссылается на несуществующую тему «${id}»`);
  }
  for (const id of quiz.examRefs ?? []) {
    if (!requirementIds.has(id)) fail(`${where}: ссылается на несуществующее требование «${id}»`);
  }
  if (!quiz.topicIds.length) fail(`${where}: не привязан ни к одной теме`);
  if (quiz.passPercent < 1 || quiz.passPercent > 100) {
    fail(`${where}: проходной процент вне диапазона 1–100`);
  }
}

// ──────────────────────────────── Проекты ────────────────────────────────
for (const project of ALL_PROJECTS) {
  const where = `Проект «${project.id}»`;
  if (!project.brief) fail(`${where}: нет технического задания`);
  if (!project.checklist.length) fail(`${where}: нет чек-листа`);
  for (const id of project.topicIds) {
    if (!topicIds.has(id)) fail(`${where}: ссылается на несуществующую тему «${id}»`);
  }
  for (const id of project.examRefs) {
    if (!requirementIds.has(id)) fail(`${where}: неизвестное требование экзамена «${id}»`);
  }
  for (const dayId of project.planDays ?? []) {
    if (!dayIds.has(dayId)) fail(`${where}: привязан к несуществующему дню «${dayId}»`);
  }
  if (project.autoCheck) {
    if (!project.autoCheck.tests.length) fail(`${where}: автопроверка объявлена, но тестов нет`);
    const sum = project.autoCheck.tests.reduce((acc, test) => acc + (test.points ?? 1), 0);
    if (sum !== project.autoCheck.maxScore) {
      fail(`${where}: сумма баллов тестов ${sum} не совпадает с maxScore ${project.autoCheck.maxScore}`);
    }
  }
  if (!project.checklist.some((item) => item.verification === 'manual')) {
    warn(`${where}: в чек-листе нет ручных пунктов — проверьте, всё ли действительно проверяется автоматически`);
  }
}

// ──────────────────────────────── Экзамены ───────────────────────────────
for (const exam of ALL_EXAMS) {
  const where = `Экзамен «${exam.id}»`;
  if (!exam.modules.length) fail(`${where}: нет модулей`);
  const sumMinutes = exam.modules.reduce((sum, module) => sum + module.minutes, 0);
  if (sumMinutes !== exam.totalMinutes) {
    fail(`${where}: сумма модулей ${sumMinutes} мин не совпадает с общей длительностью ${exam.totalMinutes} мин`);
  }
  for (const examModule of exam.modules) {
    for (const task of examModule.tasks) {
      if (task.kind === 'code' && !taskIds.has(task.taskId)) {
        fail(`${where}: модуль ${examModule.moduleNo} ссылается на несуществующее задание «${task.taskId}»`);
      }
      if (task.kind === 'quiz' && !quizIds.has(task.quizId)) {
        fail(`${where}: модуль ${examModule.moduleNo} ссылается на несуществующий тест «${task.quizId}»`);
      }
      if (task.kind === 'checklist') {
        const sum = task.items.reduce((total, item) => total + item.points, 0);
        if (Math.abs(sum - task.points) > 0.001) {
          fail(`${where}: у чек-листа «${task.id}» сумма пунктов ${sum} не равна заявленным ${task.points}`);
        }
      }
    }
  }
  for (const id of exam.examRefs) {
    if (!requirementIds.has(id)) fail(`${where}: неизвестное требование экзамена «${id}»`);
  }
}

// ───────────────────────── Требования экзамена ───────────────────────────
for (const requirement of EXAM_REQUIREMENTS) {
  for (const id of requirement.topicIds) {
    if (!topicIds.has(id)) warn(`Требование «${requirement.id}»: тема «${id}» ещё не написана`);
  }
}

// ─────────────────────────── Дни учебного плана ──────────────────────────
// У каждого дня должно быть объяснение простыми словами: формулировка
// программы написана телеграфно и новичку ничего не говорит.
for (const day of ALL_DAYS) {
  const where = `День «${day.id}»`;
  if (!day.plain) {
    fail(`${where}: нет объяснения простыми словами (content/curriculum/day-notes.ts)`);
    continue;
  }
  if (!day.plain.theory.trim()) fail(`${where}: пустое объяснение «что изучаем»`);
  if (!day.plain.practice.trim()) fail(`${where}: пустое объяснение «что делаем руками»`);
  if (!day.title.trim()) fail(`${where}: пустой заголовок`);

  // Признак того, что текст скопировали из программы, а не переписали:
  // в объяснении остались обратные кавычки вокруг названий функций.
  if (day.plain.theory.includes('`') || day.plain.practice.includes('`')) {
    warn(`${where}: в объяснении остался код в обратных кавычках — стоит переписать словами`);
  }

  // Практика нужна каждый день, включая повторения, контрольные и выходные:
  // день без задания превращается в чтение, а платформа существует ради того,
  // чтобы студент писал код каждый день.
  if (day.taskIds.length === 0) {
    fail(`${where}: нет ни одного практического задания. Свяжите задание с днём через planDays`);
  }
}

// Седьмой день недели — сборка: задание опирается на всё, что было за неделю.
// Проверяем отдельно, потому что именно его проще всего забыть.
for (const week of ALL_WEEKS) {
  const seventh = week.days.find((day) => day.dayNo === 7);
  if (!seventh) continue;

  if (seventh.taskIds.length === 0) {
    fail(`Неделя ${week.weekNo}: у седьмого дня «${seventh.id}» нет задания-сборки`);
  }
}

// ───────────────────────────────── Итог ──────────────────────────────────
const stats = {
  'дни плана': ALL_DAYS.length,
  темы: ALL_TOPICS.length,
  задания: ALL_TASKS.length,
  тесты: ALL_QUIZZES.length,
  вопросы: ALL_QUIZZES.reduce((sum, quiz) => sum + quiz.questions.length, 0),
  проекты: ALL_PROJECTS.length,
  экзамены: ALL_EXAMS.length,
  'тест-кейсы': ALL_TASKS.reduce((sum, task) => sum + task.tests.length, 0),
};

console.log('Контент платформы:');
for (const [key, value] of Object.entries(stats)) console.log(`  ${key}: ${value}`);

if (warnings.length) {
  console.log(`\nПредупреждений: ${warnings.length}`);
  for (const message of warnings.slice(0, 40)) console.log(`  ! ${message}`);
  if (warnings.length > 40) console.log(`  … и ещё ${warnings.length - 40}`);
}

if (problems.length) {
  console.error(`\nОшибок: ${problems.length}`);
  for (const message of problems) console.error(`  ✗ ${message}`);
  process.exit(1);
}

console.log('\nОшибок нет.');
