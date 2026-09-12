import { describe, expect, it } from 'vitest';
import type { Hint, Question, Quiz } from '@/content/types';
import type { TestResult } from '@/lib/runner/types';
import type { ExamPartScore } from '@/lib/grading/logic';
import {
  checkQuestion,
  maxPointsOfTests,
  scoreQuiz,
  scoreSubmission,
  summarizeExam,
  visibleResults,
} from '@/lib/grading/logic';

function result(id: string, passed: boolean, points = 1, hidden = false): TestResult {
  return { id, name: id, passed, points, hidden, durationMs: 1 } as TestResult;
}

const hints: Hint[] = [
  { level: 1, text: 'подсказка 1', penaltyPercent: 10 },
  { level: 2, text: 'подсказка 2', penaltyPercent: 25 },
  { level: 3, text: 'подсказка 3', penaltyPercent: 40 },
];

describe('scoreSubmission', () => {
  it('считает балл от доли пройденных тестов, а не от совпадения текста', () => {
    const score = scoreSubmission({
      results: [result('a', true), result('b', true), result('c', false), result('d', false)],
      maxScore: 20,
      hintsUsed: 0,
      hints,
    });

    expect(score.passedTests).toBe(2);
    expect(score.totalTests).toBe(4);
    expect(score.rawScore).toBe(10);
    expect(score.score).toBe(10);
    expect(score.percent).toBe(50);
    expect(score.passed).toBe(false);
  });

  it('учитывает вес тестов: один тяжёлый тест дороже трёх лёгких', () => {
    const score = scoreSubmission({
      results: [result('heavy', true, 7), result('a', false, 1), result('b', false, 1), result('c', false, 1)],
      maxScore: 10,
      hintsUsed: 0,
      hints,
    });

    // 7 из 10 баллов тестов → 70 % от максимума задания.
    expect(score.rawScore).toBe(7);
  });

  it('снимает штраф за каждую открытую подсказку', () => {
    const base = { results: [result('a', true), result('b', true)], maxScore: 10, hints };

    expect(scoreSubmission({ ...base, hintsUsed: 0 }).score).toBe(10);
    expect(scoreSubmission({ ...base, hintsUsed: 1 }).score).toBe(9);
    // Первая и вторая подсказки: 10 % + 25 % = 35 %.
    expect(scoreSubmission({ ...base, hintsUsed: 2 }).score).toBe(6.5);
    // Все три: 75 %.
    expect(scoreSubmission({ ...base, hintsUsed: 3 }).score).toBe(2.5);
  });

  it('не уводит балл в минус даже при полном наборе подсказок', () => {
    const heavy: Hint[] = [
      { level: 1, text: '', penaltyPercent: 60 },
      { level: 2, text: '', penaltyPercent: 60 },
    ];
    const score = scoreSubmission({ results: [result('a', true)], maxScore: 10, hintsUsed: 2, hints: heavy });
    expect(score.score).toBe(0);
  });

  it('считает задание сданным только при всех пройденных тестах', () => {
    const all = scoreSubmission({ results: [result('a', true), result('b', true)], maxScore: 10, hintsUsed: 0, hints });
    const partial = scoreSubmission({ results: [result('a', true), result('b', false)], maxScore: 10, hintsUsed: 0, hints });

    expect(all.passed).toBe(true);
    expect(partial.passed).toBe(false);
  });

  it('пустой список тестов не считается сданным заданием', () => {
    const score = scoreSubmission({ results: [], maxScore: 10, hintsUsed: 0, hints });
    expect(score.passed).toBe(false);
    expect(score.rawScore).toBe(0);
  });
});

describe('visibleResults', () => {
  it('скрывает ожидаемые значения скрытых тестов', () => {
    const raw: TestResult[] = [
      { ...result('open', false), expected: '42', actual: '7', input: 'f(1)' } as TestResult,
      { ...result('secret', false, 1, true), expected: '42', actual: '7', input: 'f(1)' } as TestResult,
    ];

    const [open, secret] = visibleResults(raw);

    expect(open.expected).toBe('42');
    expect(secret.expected).toBeUndefined();
    expect(secret.actual).toBeUndefined();
    expect(secret.name).toContain('скрытый');
  });
});

describe('checkQuestion', () => {
  const single: Question = {
    id: 'q1',
    type: 'single',
    text: 'Код ответа при отсутствии токена?',
    options: [
      { id: 'a', text: '200' },
      { id: 'b', text: '401' },
    ],
    correct: 'b',
    explanation: '',
  };

  it('проверяет вопрос с одним ответом', () => {
    expect(checkQuestion(single, 'b').correct).toBe(true);
    expect(checkQuestion(single, 'a').correct).toBe(false);
    expect(checkQuestion(single, null).correct).toBe(false);
  });

  it('требует полного совпадения набора в вопросе с несколькими ответами', () => {
    const multiple: Question = {
      id: 'q2',
      type: 'multiple',
      text: '',
      options: [
        { id: 'a', text: 'a' },
        { id: 'b', text: 'b' },
        { id: 'c', text: 'c' },
      ],
      correct: ['a', 'b'],
      explanation: '',
    };

    expect(checkQuestion(multiple, ['a', 'b']).correct).toBe(true);
    // Порядок не важен.
    expect(checkQuestion(multiple, ['b', 'a']).correct).toBe(true);
    // Неполный ответ не засчитывается.
    expect(checkQuestion(multiple, ['a']).correct).toBe(false);
    // Лишний вариант тоже.
    expect(checkQuestion(multiple, ['a', 'b', 'c']).correct).toBe(false);
  });

  it('проверяет сопоставление целиком', () => {
    const match: Question = {
      id: 'q3',
      type: 'match',
      text: '',
      left: [
        { id: 'l1', text: '401' },
        { id: 'l2', text: '403' },
      ],
      right: [
        { id: 'r1', text: 'нет входа' },
        { id: 'r2', text: 'нет прав' },
      ],
      correct: { l1: 'r1', l2: 'r2' },
      explanation: '',
    };

    expect(checkQuestion(match, { l1: 'r1', l2: 'r2' }).correct).toBe(true);
    expect(checkQuestion(match, { l1: 'r2', l2: 'r1' }).correct).toBe(false);
    expect(checkQuestion(match, { l1: 'r1' }).correct).toBe(false);
  });

  it('проверяет последовательность с учётом порядка', () => {
    const order: Question = {
      id: 'q4',
      type: 'order',
      text: '',
      items: [
        { id: 'i1', text: 'git init' },
        { id: 'i2', text: 'git add' },
        { id: 'i3', text: 'git commit' },
      ],
      correct: ['i1', 'i2', 'i3'],
      explanation: '',
    };

    expect(checkQuestion(order, ['i1', 'i2', 'i3']).correct).toBe(true);
    expect(checkQuestion(order, ['i2', 'i1', 'i3']).correct).toBe(false);
    expect(checkQuestion(order, ['i1', 'i2']).correct).toBe(false);
  });

  it('в свободном ответе по умолчанию не придирается к регистру и пунктуации', () => {
    const text: Question = {
      id: 'q5',
      type: 'text',
      text: '',
      correct: ['break'],
      explanation: '',
    };

    expect(checkQuestion(text, 'break').correct).toBe(true);
    expect(checkQuestion(text, '  BREAK ').correct).toBe(true);
    expect(checkQuestion(text, 'continue').correct).toBe(false);
  });

  it('уважает caseSensitive: Admin26 проверяется дословно', () => {
    const text: Question = {
      id: 'q6',
      type: 'text',
      text: '',
      correct: ['Admin26'],
      caseSensitive: true,
      explanation: '',
    };

    expect(checkQuestion(text, 'Admin26').correct).toBe(true);
    expect(checkQuestion(text, ' Admin26 ').correct).toBe(true);
    expect(checkQuestion(text, 'admin26').correct).toBe(false);
  });

  it('приравнивает «ё» к «е» при мягком сравнении', () => {
    const text: Question = {
      id: 'q7',
      type: 'text',
      text: '',
      correct: ['Ещё'],
      explanation: '',
    };

    expect(checkQuestion(text, 'Еще').correct).toBe(true);
  });

  it('проверяет вопрос «верно / неверно»', () => {
    const boolQuestion: Question = { id: 'q8', type: 'boolean', text: '', correct: true, explanation: '' };

    expect(checkQuestion(boolQuestion, true).correct).toBe(true);
    expect(checkQuestion(boolQuestion, false).correct).toBe(false);
    // Нет ответа — не засчитываем как верный.
    expect(checkQuestion(boolQuestion, null).correct).toBe(false);
  });
});

describe('scoreQuiz', () => {
  const quiz: Quiz = {
    id: 'quiz-test',
    title: 'Тест',
    topicIds: ['web-basics'],
    tech: ['tools'],
    monthNo: 1,
    difficulty: 1,
    passPercent: 70,
    questions: [
      { id: 'q1', type: 'boolean', text: '', correct: true, explanation: '' },
      { id: 'q2', type: 'boolean', text: '', correct: true, explanation: '' },
      { id: 'q3', type: 'boolean', text: '', correct: true, explanation: '', points: 2 },
    ],
  };

  it('считает процент с учётом веса вопросов', () => {
    const score = scoreQuiz(quiz, { q1: true, q2: true, q3: false });

    expect(score.correctCount).toBe(2);
    expect(score.maxScore).toBe(4);
    expect(score.score).toBe(2);
    expect(score.percent).toBe(50);
    expect(score.passed).toBe(false);
  });

  it('засчитывает тест при достижении проходного процента', () => {
    const score = scoreQuiz(quiz, { q1: true, q2: false, q3: true });

    expect(score.percent).toBe(75);
    expect(score.passed).toBe(true);
  });

  it('пропущенные вопросы считаются неверными, а не игнорируются', () => {
    const score = scoreQuiz(quiz, {});

    expect(score.totalCount).toBe(3);
    expect(score.score).toBe(0);
    expect(score.passed).toBe(false);
  });
});

describe('summarizeExam', () => {
  function part(
    moduleNo: number,
    score: number,
    maxScore: number,
    manual: boolean,
  ): ExamPartScore & { moduleNo: number } {
    return {
      moduleNo,
      examTaskId: `${moduleNo}-${manual ? 'checklist' : 'code'}-${score}`,
      kind: manual ? 'checklist' : 'code',
      title: manual ? 'Чек-лист' : 'Код',
      score,
      maxScore,
      passed: score === maxScore,
      manual,
    };
  }

  it('считает автоматическую и ручную части отдельно', () => {
    const totals = summarizeExam([part(1, 6, 6, false), part(1, 16, 32, true), part(2, 5, 10, false)]);

    expect(totals.score).toBe(27);
    expect(totals.maxScore).toBe(48);
    expect(totals.autoScore).toBe(11);
    expect(totals.autoMaxScore).toBe(16);
    expect(totals.manualScore).toBe(16);
    expect(totals.manualMaxScore).toBe(32);
  });

  it('раскладывает результат по модулям в порядке номеров', () => {
    const totals = summarizeExam([part(3, 5, 10, false), part(1, 10, 10, false), part(2, 0, 10, false)]);

    expect(totals.byModule.map((item) => item.moduleNo)).toEqual([1, 2, 3]);
    expect(totals.byModule[0].percent).toBe(100);
    expect(totals.byModule[1].percent).toBe(0);
    expect(totals.byModule[2].percent).toBe(50);
  });

  it('пустой экзамен не делит на ноль', () => {
    const totals = summarizeExam([]);
    expect(totals.percent).toBe(0);
    expect(totals.byModule).toEqual([]);
  });
});

describe('maxPointsOfTests', () => {
  it('считает тест без явного веса как один балл', () => {
    expect(
      maxPointsOfTests([
        { id: 'a', name: 'a', type: 'expr', expression: '1', expected: 1 },
        { id: 'b', name: 'b', type: 'expr', expression: '1', expected: 1, points: 5 },
      ]),
    ).toBe(6);
  });
});
