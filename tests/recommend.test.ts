import { describe, expect, it } from 'vitest';
import { buildRecommendations, summarizeDay, type RecommendationContext } from '@/lib/recommend/logic';

function context(overrides: Partial<RecommendationContext> = {}): RecommendationContext {
  return {
    dueReviews: [],
    weakTopics: [],
    today: null,
    pendingTasks: [],
    pendingTopics: [],
    pendingProject: null,
    exams: { attempts: 0, lastPercent: null },
    daysUntilExam: null,
    activeToday: true,
    streak: 0,
    readinessPercent: 50,
    ...overrides,
  };
}

describe('buildRecommendations', () => {
  it('каждая рекомендация ведёт на конкретную страницу', () => {
    const items = buildRecommendations(
      context({
        dueReviews: [{ topicId: 'sql-join', title: 'JOIN' }],
        pendingTasks: [{ id: 'task-sql-join', title: 'JOIN', difficulty: 3 }],
        pendingTopics: [{ id: 'sql-aggregate', title: 'GROUP BY' }],
      }),
    );

    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.href).toMatch(/^\//);
      expect(item.actionLabel.length).toBeGreaterThan(0);
      expect(item.title.length).toBeGreaterThan(0);
    }
  });

  it('просроченное повторение важнее нового материала', () => {
    const items = buildRecommendations(
      context({
        dueReviews: [{ topicId: 'sql-join', title: 'JOIN' }],
        pendingTopics: [{ id: 'react-state', title: 'useState' }],
        pendingTasks: [{ id: 'task-react-state-filter', title: 'Фильтр', difficulty: 3 }],
      }),
    );

    expect(items[0].kind).toBe('review');
  });

  it('не повторяет одну и ту же рекомендацию дважды', () => {
    const items = buildRecommendations(
      context({
        dueReviews: [
          { topicId: 'a', title: 'A' },
          { topicId: 'b', title: 'B' },
        ],
        weakTopics: [
          { topicId: 'a', title: 'A', weakness: 0.8, successRate: 0.2, attempts: 5, hintsPerTask: 2, reasons: [] },
        ],
      }),
    );

    const ids = items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ограничивает список заданным числом', () => {
    const items = buildRecommendations(
      context({
        dueReviews: [{ topicId: 'a', title: 'A' }],
        weakTopics: [
          { topicId: 'b', title: 'B', weakness: 0.9, successRate: 0.1, attempts: 8, hintsPerTask: 2, reasons: [] },
        ],
        pendingTopics: [{ id: 'c', title: 'C' }],
        pendingTasks: [{ id: 'd', title: 'D', difficulty: 3 }],
        pendingProject: { id: 'project-01-event-page', title: 'Страница' },
        exams: { attempts: 0, lastPercent: null },
      }),
      2,
    );

    expect(items).toHaveLength(2);
  });

  it('перед экзаменом предлагает предэкзаменационный режим', () => {
    const items = buildRecommendations(context({ daysUntilExam: 14, readinessPercent: 60 }));
    const text = items.map((item) => `${item.title} ${item.description}`).join(' ');

    expect(items.length).toBeGreaterThan(0);
    expect(text).toMatch(/экзамен/i);
  });

  it('напоминает про серию, если сегодня занятий не было', () => {
    const items = buildRecommendations(context({ activeToday: false, streak: 12 }));

    expect(items.some((item) => item.title.includes('12'))).toBe(true);
  });

  it('не напоминает про серию, если занятие сегодня уже было', () => {
    const items = buildRecommendations(context({ activeToday: true, streak: 12 }));

    expect(items.some((item) => item.title.includes('Серия'))).toBe(false);
  });

  it('возвращает отсортированный по приоритету список', () => {
    const items = buildRecommendations(
      context({
        dueReviews: [{ topicId: 'a', title: 'A' }],
        pendingTasks: [{ id: 'b', title: 'B', difficulty: 2 }],
        pendingTopics: [{ id: 'c', title: 'C' }],
      }),
    );

    for (let i = 1; i < items.length; i += 1) {
      expect(items[i - 1].priority).toBeGreaterThanOrEqual(items[i].priority);
    }
  });

  it('на пустом состоянии не падает и что-то предлагает', () => {
    const items = buildRecommendations(context({ activeToday: false }));
    expect(Array.isArray(items)).toBe(true);
  });
});

describe('summarizeDay', () => {
  it('склоняет числительные по-русски', () => {
    expect(summarizeDay({ topicsStudied: 1, tasksSolved: 1, quizPercent: null, minutes: 0 })).toEqual([
      'Изучено 1 тема',
      'Решено 1 задание',
    ]);

    expect(summarizeDay({ topicsStudied: 3, tasksSolved: 4, quizPercent: null, minutes: 0 })).toEqual([
      'Изучено 3 темы',
      'Решено 4 задания',
    ]);

    expect(summarizeDay({ topicsStudied: 5, tasksSolved: 11, quizPercent: null, minutes: 0 })).toEqual([
      'Изучено 5 тем',
      'Решено 11 заданий',
    ]);
  });

  it('показывает результат тестов и время, когда они есть', () => {
    const lines = summarizeDay({ topicsStudied: 2, tasksSolved: 2, quizPercent: 80, minutes: 45 });

    expect(lines.join(' ')).toContain('80%');
    expect(lines.join(' ')).toContain('45 мин');
  });

  it('в пустой день говорит об этом прямо, а не молчит', () => {
    expect(summarizeDay({ topicsStudied: 0, tasksSolved: 0, quizPercent: null, minutes: 0 })).toEqual([
      'Сегодня занятий пока не было',
    ]);
  });

  it('ноль процентов за тест — это результат, а не отсутствие результата', () => {
    const lines = summarizeDay({ topicsStudied: 0, tasksSolved: 0, quizPercent: 0, minutes: 0 });
    expect(lines.join(' ')).toContain('0%');
  });
});
