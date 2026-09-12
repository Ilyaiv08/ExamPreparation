import type { Hint, Question, Quiz, TestCase } from '@/content/types';
import type { TestResult } from '@/lib/runner/types';

/**
 * Подсчёт баллов. Чистые функции без базы — покрыты модульными тестами.
 *
 * Принципы (раздел 14 и 16 ТЗ):
 *  - балл считается от реально пройденных тестов, а не от совпадения текста;
 *  - каждая подсказка снимает фиксированный процент от максимума;
 *  - частичный результат засчитывается: 7 из 10 тестов — это 70 % практики.
 */

export interface SubmissionScore {
  passedTests: number;
  totalTests: number;
  /** Сумма баллов пройденных тестов с учётом их веса. */
  rawScore: number;
  maxScore: number;
  /** Итоговый балл после штрафа за подсказки. */
  score: number;
  percent: number;
  hintPenalty: number;
  passed: boolean;
}

export function scoreSubmission(options: {
  results: TestResult[];
  maxScore: number;
  hintsUsed: number;
  hints: Hint[];
}): SubmissionScore {
  const { results, maxScore, hintsUsed, hints } = options;
  const totalPoints = results.reduce((sum, item) => sum + (item.points || 1), 0);
  const earnedPoints = results.reduce((sum, item) => sum + (item.passed ? item.points || 1 : 0), 0);
  const passedTests = results.filter((item) => item.passed).length;

  const ratio = totalPoints > 0 ? earnedPoints / totalPoints : 0;
  const rawScore = Math.round(ratio * maxScore * 100) / 100;

  const penaltyPercent = hints
    .slice(0, Math.max(0, hintsUsed))
    .reduce((sum, hint) => sum + hint.penaltyPercent, 0);
  const hintPenalty = Math.round(((penaltyPercent / 100) * rawScore) * 100) / 100;

  const score = Math.max(0, Math.round((rawScore - hintPenalty) * 100) / 100);
  const passed = results.length > 0 && passedTests === results.length;

  return {
    passedTests,
    totalTests: results.length,
    rawScore,
    maxScore,
    score,
    percent: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
    hintPenalty,
    passed,
  };
}

/** Сколько тестов показывать в отчёте: скрытые тесты не раскрывают ожидаемые значения. */
export function visibleResults(results: TestResult[]): TestResult[] {
  return results.map((item) =>
    item.hidden
      ? { ...item, expected: undefined, actual: undefined, input: undefined, name: `${item.name} (скрытый тест)` }
      : item,
  );
}

// ───────────────────────────── Теоретические тесты ─────────────────────────────

export type QuizAnswer = string | string[] | boolean | Record<string, string> | null;

export interface QuestionResult {
  questionId: string;
  correct: boolean;
  points: number;
  maxPoints: number;
  expected: string;
  given: string;
  explanation: string;
}

export interface QuizScore {
  correctCount: number;
  totalCount: number;
  score: number;
  maxScore: number;
  percent: number;
  passed: boolean;
  results: QuestionResult[];
}

function normalizeText(value: string, normalize?: boolean): string {
  const trimmed = value.trim();
  if (!normalize) return trimmed;
  return trimmed
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

export function checkQuestion(question: Question, answer: QuizAnswer): QuestionResult {
  const maxPoints = question.points ?? 1;
  const base = {
    questionId: question.id,
    maxPoints,
    explanation: question.explanation,
  };

  switch (question.type) {
    case 'single': {
      const given = typeof answer === 'string' ? answer : '';
      const correct = given === question.correct;
      return {
        ...base,
        correct,
        points: correct ? maxPoints : 0,
        expected: labelOf(question.options, question.correct),
        given: given ? labelOf(question.options, given) : '—',
      };
    }
    case 'multiple': {
      const given = Array.isArray(answer) ? [...answer].sort() : [];
      const expected = [...question.correct].sort();
      const correct = given.length === expected.length && given.every((item, index) => item === expected[index]);
      return {
        ...base,
        correct,
        points: correct ? maxPoints : 0,
        expected: expected.map((id) => labelOf(question.options, id)).join('; '),
        given: given.length ? given.map((id) => labelOf(question.options, id)).join('; ') : '—',
      };
    }
    case 'boolean': {
      const correct = typeof answer === 'boolean' && answer === question.correct;
      return {
        ...base,
        correct,
        points: correct ? maxPoints : 0,
        expected: question.correct ? 'Верно' : 'Неверно',
        given: typeof answer === 'boolean' ? (answer ? 'Верно' : 'Неверно') : '—',
      };
    }
    case 'match': {
      const given = answer && typeof answer === 'object' && !Array.isArray(answer) ? (answer as Record<string, string>) : {};
      const keys = Object.keys(question.correct);
      const correct = keys.every((key) => given[key] === question.correct[key]);
      return {
        ...base,
        correct,
        points: correct ? maxPoints : 0,
        expected: keys
          .map((key) => `${labelOf(question.left, key)} → ${labelOf(question.right, question.correct[key])}`)
          .join('; '),
        given: keys
          .map((key) => `${labelOf(question.left, key)} → ${given[key] ? labelOf(question.right, given[key]) : '—'}`)
          .join('; '),
      };
    }
    case 'order': {
      const given = Array.isArray(answer) ? answer : [];
      const correct =
        given.length === question.correct.length && given.every((item, index) => item === question.correct[index]);
      return {
        ...base,
        correct,
        points: correct ? maxPoints : 0,
        expected: question.correct.map((id, index) => `${index + 1}. ${labelOf(question.items, id)}`).join(' '),
        given: given.length ? given.map((id, index) => `${index + 1}. ${labelOf(question.items, id)}`).join(' ') : '—',
      };
    }
    case 'text': {
      const raw = typeof answer === 'string' ? answer : '';
      const normalize = question.normalize ?? true;
      const candidate = question.caseSensitive ? raw.trim() : normalizeText(raw, normalize);
      const correct = question.correct.some((variant) => {
        const target = question.caseSensitive ? variant.trim() : normalizeText(variant, normalize);
        return target === candidate;
      });
      return {
        ...base,
        correct,
        points: correct ? maxPoints : 0,
        expected: question.correct[0],
        given: raw.trim() || '—',
      };
    }
    default:
      return { ...base, correct: false, points: 0, expected: '', given: '' };
  }
}

function labelOf(options: { id: string; text: string }[], id: string): string {
  return options.find((option) => option.id === id)?.text ?? id;
}

export function scoreQuiz(quiz: Quiz, answers: Record<string, QuizAnswer>): QuizScore {
  const results = quiz.questions.map((question) => checkQuestion(question, answers[question.id] ?? null));
  const score = results.reduce((sum, item) => sum + item.points, 0);
  const maxScore = results.reduce((sum, item) => sum + item.maxPoints, 0);
  const correctCount = results.filter((item) => item.correct).length;
  const percent = maxScore ? Math.round((score / maxScore) * 100) : 0;

  return {
    correctCount,
    totalCount: results.length,
    score,
    maxScore,
    percent,
    passed: percent >= quiz.passPercent,
    results,
  };
}

// ───────────────────────────────── Экзамен ─────────────────────────────────

export interface ExamPartScore {
  examTaskId: string;
  kind: 'code' | 'quiz' | 'checklist';
  title: string;
  score: number;
  maxScore: number;
  passed: boolean;
  /** Для чек-листов: пункты проверяются студентом вручную. */
  manual: boolean;
}

export interface ExamTotals {
  score: number;
  maxScore: number;
  percent: number;
  autoScore: number;
  autoMaxScore: number;
  manualScore: number;
  manualMaxScore: number;
  byModule: { moduleNo: number; score: number; maxScore: number; percent: number }[];
}

export function summarizeExam(parts: (ExamPartScore & { moduleNo: number })[]): ExamTotals {
  const score = parts.reduce((sum, part) => sum + part.score, 0);
  const maxScore = parts.reduce((sum, part) => sum + part.maxScore, 0);
  const auto = parts.filter((part) => !part.manual);
  const manual = parts.filter((part) => part.manual);

  const modules = new Map<number, { score: number; maxScore: number }>();
  for (const part of parts) {
    const entry = modules.get(part.moduleNo) ?? { score: 0, maxScore: 0 };
    entry.score += part.score;
    entry.maxScore += part.maxScore;
    modules.set(part.moduleNo, entry);
  }

  return {
    score: Math.round(score * 100) / 100,
    maxScore: Math.round(maxScore * 100) / 100,
    percent: maxScore ? Math.round((score / maxScore) * 100) : 0,
    autoScore: Math.round(auto.reduce((sum, part) => sum + part.score, 0) * 100) / 100,
    autoMaxScore: auto.reduce((sum, part) => sum + part.maxScore, 0),
    manualScore: Math.round(manual.reduce((sum, part) => sum + part.score, 0) * 100) / 100,
    manualMaxScore: manual.reduce((sum, part) => sum + part.maxScore, 0),
    byModule: [...modules.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([moduleNo, entry]) => ({
        moduleNo,
        score: Math.round(entry.score * 100) / 100,
        maxScore: entry.maxScore,
        percent: entry.maxScore ? Math.round((entry.score / entry.maxScore) * 100) : 0,
      })),
  };
}

/** Сколько всего баллов может дать задание с учётом весов тестов. */
export function maxPointsOfTests(tests: TestCase[]): number {
  return tests.reduce((sum, test) => sum + (test.points ?? 1), 0);
}
