import { describe, expect, it } from 'vitest';
import {
  GRADING_WEIGHTS,
  computeReadiness,
  computeStreak,
  computeWeakness,
  currentDayIndex,
  daysUntilExam,
  isTopicUnlocked,
  isWeekUnlocked,
  longestStreak,
  monthNoFromWeekNo,
  planDayDate,
  planFinishDate,
  planWeekRange,
  preExamPlan,
  rankWeakTopics,
  readinessLabel,
  shiftDate,
  weekNoFromDayIndex,
  type TopicStatInput,
} from '@/lib/progress/logic';

const START = new Date('2026-01-01T09:00:00');

describe('currentDayIndex', () => {
  it('в день старта показывает нулевой день', () => {
    expect(currentDayIndex(START, new Date('2026-01-01T23:00:00'))).toBe(0);
  });

  it('считает календарные дни от старта', () => {
    expect(currentDayIndex(START, new Date('2026-01-11T08:00:00'))).toBe(10);
  });

  it('до старта не уходит в отрицательные значения', () => {
    expect(currentDayIndex(START, new Date('2025-12-20T08:00:00'))).toBe(0);
  });

  it('не выходит за пределы программы в 210 дней', () => {
    expect(currentDayIndex(START, new Date('2027-06-01T08:00:00'))).toBe(209);
  });
});

describe('weekNoFromDayIndex и monthNoFromWeekNo', () => {
  it('первые семь дней — первая неделя', () => {
    expect(weekNoFromDayIndex(0)).toBe(1);
    expect(weekNoFromDayIndex(6)).toBe(1);
    expect(weekNoFromDayIndex(7)).toBe(2);
  });

  it('последний день программы приходится на тридцатую неделю', () => {
    expect(weekNoFromDayIndex(209)).toBe(30);
  });

  it('раскладывает 30 недель по семи месяцам программы', () => {
    expect(monthNoFromWeekNo(1)).toBe(1);
    expect(monthNoFromWeekNo(4)).toBe(1);
    expect(monthNoFromWeekNo(5)).toBe(2);
    expect(monthNoFromWeekNo(16)).toBe(4);
    expect(monthNoFromWeekNo(24)).toBe(6);
    expect(monthNoFromWeekNo(25)).toBe(7);
    expect(monthNoFromWeekNo(30)).toBe(7);
  });
});

describe('календарь плана считается от даты старта студента', () => {
  it('первая неделя начинается в день старта', () => {
    const range = planWeekRange(new Date('2027-03-01T00:00:00'), 1);

    expect(range.from.getDate()).toBe(1);
    expect(range.from.getMonth()).toBe(2);
    expect(range.to.getDate()).toBe(7);
    expect(range.label).toBe('01.03 – 07.03');
  });

  it('каждая следующая неделя сдвигается ровно на семь дней', () => {
    const start = new Date('2027-03-01T00:00:00');

    expect(planWeekRange(start, 2).label).toBe('08.03 – 14.03');
    expect(planWeekRange(start, 5).label).toBe('29.03 – 04.04');
  });

  it('у разных студентов одна и та же неделя приходится на разные даты', () => {
    const first = planWeekRange(new Date('2026-09-14T00:00:00'), 3).label;
    const second = planWeekRange(new Date('2027-01-11T00:00:00'), 3).label;

    expect(first).not.toBe(second);
    expect(first).toBe('28.09 – 04.10');
    expect(second).toBe('25.01 – 31.01');
  });

  it('дата дня отсчитывается от старта', () => {
    const start = new Date('2027-03-01T00:00:00');

    expect(planDayDate(start, 0).getDate()).toBe(1);
    expect(planDayDate(start, 7).getDate()).toBe(8);
  });

  it('финиш — это 210-й день от старта, а не дата из файла программы', () => {
    const finish = planFinishDate(new Date('2026-09-14T00:00:00'), 210);

    expect(finish.getFullYear()).toBe(2027);
    expect(finish.getMonth()).toBe(3);
    expect(finish.getDate()).toBe(11);

    const later = planFinishDate(new Date('2027-01-11T00:00:00'), 210);
    expect(later.getTime()).toBeGreaterThan(finish.getTime());
  });

  it('переход через границу месяца и високосный год считается верно', () => {
    expect(planWeekRange(new Date('2028-02-21T00:00:00'), 2).label).toBe('28.02 – 05.03');
  });
});

describe('isWeekUnlocked', () => {
  it('первая неделя открыта всегда', () => {
    expect(isWeekUnlocked(1, {}, 1)).toBe(true);
  });

  it('календарь открывает недели сам — отставание не запирает студента', () => {
    // Ничего не сделано, но календарно идёт пятая неделя.
    expect(isWeekUnlocked(5, {}, 5)).toBe(true);
    expect(isWeekUnlocked(4, {}, 5)).toBe(true);
  });

  it('будущая неделя открывается досрочно при 60 % закрытых дней предыдущей', () => {
    expect(isWeekUnlocked(3, { 2: 5 }, 2)).toBe(true);
    expect(isWeekUnlocked(3, { 2: 4 }, 2)).toBe(false);
    expect(isWeekUnlocked(3, {}, 2)).toBe(false);
  });
});

describe('isTopicUnlocked', () => {
  const unlockedWeeks = new Set([1, 2]);

  it('тема открытой недели без предпосылок доступна', () => {
    expect(isTopicUnlocked({ weekNo: 1, prerequisites: [] }, new Set(), unlockedWeeks)).toBe(true);
  });

  it('тема открытой недели ждёт закрытия предпосылок', () => {
    const topic = { weekNo: 2, prerequisites: ['html-structure'] };

    expect(isTopicUnlocked(topic, new Set(), unlockedWeeks)).toBe(false);
    expect(isTopicUnlocked(topic, new Set(['html-structure']), unlockedWeeks)).toBe(true);
  });

  it('тема закрытой недели открывается досрочно, если все предпосылки пройдены', () => {
    const topic = { weekNo: 9, prerequisites: ['js-arrays', 'js-objects'] };

    expect(isTopicUnlocked(topic, new Set(['js-arrays']), unlockedWeeks)).toBe(false);
    expect(isTopicUnlocked(topic, new Set(['js-arrays', 'js-objects']), unlockedWeeks)).toBe(true);
  });

  it('тема закрытой недели без предпосылок остаётся закрытой', () => {
    expect(isTopicUnlocked({ weekNo: 20, prerequisites: [] }, new Set(), unlockedWeeks)).toBe(false);
  });
});

describe('computeStreak', () => {
  it('считает подряд идущие дни от сегодня', () => {
    expect(computeStreak(['2026-03-01', '2026-02-28', '2026-02-27'], '2026-03-01')).toBe(3);
  });

  it('не обрывает серию, если сегодня занятий ещё не было', () => {
    expect(computeStreak(['2026-02-28', '2026-02-27'], '2026-03-01')).toBe(2);
  });

  it('обрывается, если пропущены и сегодня, и вчера', () => {
    expect(computeStreak(['2026-02-25', '2026-02-24'], '2026-03-01')).toBe(0);
  });

  it('пустая история даёт нулевую серию', () => {
    expect(computeStreak([], '2026-03-01')).toBe(0);
  });

  it('игнорирует дубликаты дат', () => {
    expect(computeStreak(['2026-03-01', '2026-03-01', '2026-02-28'], '2026-03-01')).toBe(2);
  });
});

describe('longestStreak', () => {
  it('находит самую длинную серию в истории', () => {
    const dates = ['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-10', '2026-01-11'];
    expect(longestStreak(dates)).toBe(3);
  });

  it('одна дата — серия из одного дня', () => {
    expect(longestStreak(['2026-01-01'])).toBe(1);
  });

  it('пустая история — ноль', () => {
    expect(longestStreak([])).toBe(0);
  });
});

describe('shiftDate', () => {
  it('корректно переходит через границу месяца', () => {
    expect(shiftDate('2026-03-01', -1)).toBe('2026-02-28');
    expect(shiftDate('2026-02-28', 1)).toBe('2026-03-01');
  });

  it('учитывает високосный год', () => {
    expect(shiftDate('2028-02-28', 1)).toBe('2028-02-29');
  });
});

describe('computeWeakness и rankWeakTopics', () => {
  const NOW = new Date('2026-03-01T10:00:00');

  const weakStat: TopicStatInput = {
    topicId: 'sql-join',
    attempts: 10,
    solved: 3,
    failed: 7,
    hintsUsed: 15,
    quizCorrect: 4,
    quizTotal: 10,
    totalTimeMs: 900_000,
    lastAttemptAt: new Date('2026-01-01T10:00:00'),
    lastSuccessAt: new Date('2026-01-01T10:00:00'),
  };

  const strongStat: TopicStatInput = {
    topicId: 'html-structure',
    attempts: 10,
    solved: 10,
    failed: 0,
    hintsUsed: 0,
    quizCorrect: 10,
    quizTotal: 10,
    totalTimeMs: 300_000,
    lastAttemptAt: new Date('2026-02-28T10:00:00'),
    lastSuccessAt: new Date('2026-02-28T10:00:00'),
  };

  it('тема с низкой долей успеха считается слабой', () => {
    expect(computeWeakness(weakStat, NOW).weakness).toBeGreaterThan(0.25);
  });

  it('уверенно решаемая тема слабой не считается', () => {
    expect(computeWeakness(strongStat, NOW).weakness).toBeLessThan(0.25);
  });

  it('объясняет причину слабости словами, а не только числом', () => {
    const weak = computeWeakness(weakStat, NOW);

    expect(weak.reasons.length).toBeGreaterThan(0);
    expect(weak.reasons.join(' ')).toMatch(/неудачных|тест|подсказк|назад/);
  });

  it('частые подсказки повышают слабость', () => {
    const withHints = computeWeakness({ ...strongStat, hintsUsed: 30 }, NOW);
    const withoutHints = computeWeakness(strongStat, NOW);

    expect(withHints.weakness).toBeGreaterThan(withoutHints.weakness);
  });

  it('давно не повторявшаяся тема постепенно «остывает»', () => {
    const stale = computeWeakness(
      { ...strongStat, lastAttemptAt: new Date('2025-10-01T10:00:00'), lastSuccessAt: new Date('2025-10-01T10:00:00') },
      NOW,
    );

    expect(stale.weakness).toBeGreaterThan(computeWeakness(strongStat, NOW).weakness);
  });

  it('в рейтинг слабых попадают только темы с попытками', () => {
    const untouched: TopicStatInput = {
      topicId: 'untouched',
      attempts: 0,
      solved: 0,
      failed: 0,
      hintsUsed: 0,
      quizCorrect: 0,
      quizTotal: 0,
      totalTimeMs: 0,
      lastAttemptAt: null,
      lastSuccessAt: null,
    };

    const ranked = rankWeakTopics([weakStat, untouched, strongStat], NOW);

    expect(ranked.map((item) => item.topicId)).toEqual(['sql-join']);
  });

  it('сортирует слабые темы по убыванию слабости и ограничивает список', () => {
    const stats: TopicStatInput[] = [0, 1, 2, 3, 4, 5].map((index) => ({
      ...weakStat,
      topicId: `topic-${index}`,
      solved: index,
      failed: 10 - index,
      quizCorrect: index,
    }));

    const ranked = rankWeakTopics(stats, NOW, 3);

    expect(ranked).toHaveLength(3);
    expect(ranked[0].weakness).toBeGreaterThanOrEqual(ranked[1].weakness);
    expect(ranked[1].weakness).toBeGreaterThanOrEqual(ranked[2].weakness);
    // Самая слабая — та, где решено меньше всего.
    expect(ranked[0].topicId).toBe('topic-0');
  });
});

describe('computeReadiness', () => {
  const full = {
    theory: { done: 10, total: 10 },
    practice: { done: 10, total: 10 },
    control: { done: 10, total: 10 },
    projects: { done: 10, total: 10 },
    examPercent: 100,
  };

  it('полностью закрытая подготовка даёт 100 %', () => {
    expect(computeReadiness(full).percent).toBe(100);
  });

  it('пустая подготовка даёт 0 %', () => {
    expect(
      computeReadiness({
        theory: { done: 0, total: 10 },
        practice: { done: 0, total: 10 },
        control: { done: 0, total: 10 },
        projects: { done: 0, total: 10 },
        examPercent: null,
      }).percent,
    ).toBe(0);
  });

  it('веса в сумме дают единицу — иначе 100 % было бы недостижимо', () => {
    const sum = Object.values(GRADING_WEIGHTS).reduce((acc, value) => acc + value, 0);
    expect(Number(sum.toFixed(5))).toBe(1);
  });

  it('практика весит больше теории', () => {
    const onlyPractice = computeReadiness({ ...full, theory: { done: 0, total: 10 } });
    const onlyTheory = computeReadiness({ ...full, practice: { done: 0, total: 10 } });

    expect(onlyPractice.percent).toBeGreaterThan(onlyTheory.percent);
  });

  it('отсутствие экзаменационных попыток не ломает расчёт', () => {
    const result = computeReadiness({ ...full, examPercent: null });
    expect(result.percent).toBe(85);
  });

  it('раздел без заданий не считается проваленным', () => {
    const result = computeReadiness({ ...full, projects: { done: 0, total: 0 } });
    // Пустой раздел даёт 0 по своему весу, но не ломает остальное.
    expect(result.percent).toBe(90);
  });
});

describe('readinessLabel', () => {
  it('подписывает уровни готовности', () => {
    expect(readinessLabel(85).tone).toBe('ok');
    expect(readinessLabel(65).tone).toBe('warn');
    expect(readinessLabel(40).tone).toBe('warn');
    expect(readinessLabel(10).tone).toBe('bad');
  });
});

describe('daysUntilExam и preExamPlan', () => {
  const now = new Date('2026-03-01T12:00:00');

  it('считает оставшиеся дни', () => {
    expect(daysUntilExam(new Date('2026-03-11T09:00:00'), now)).toBe(10);
    expect(daysUntilExam(null, now)).toBeNull();
  });

  it('предэкзаменационный режим включается за 30 дней', () => {
    expect(preExamPlan(45)).toBeNull();
    expect(preExamPlan(30)?.week).toBe(1);
    expect(preExamPlan(20)?.week).toBe(2);
    expect(preExamPlan(10)?.week).toBe(3);
    expect(preExamPlan(3)?.week).toBe(4);
  });

  it('после экзамена режим выключается', () => {
    expect(preExamPlan(-1)).toBeNull();
  });
});
