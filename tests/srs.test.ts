import { describe, expect, it } from 'vitest';
import {
  BASE_INTERVALS,
  INITIAL_REVIEW,
  dueLabel,
  isDue,
  nextReview,
  sortReviewQueue,
  type ReviewState,
} from '@/lib/srs/logic';

const NOW = new Date('2026-03-01T12:00:00');

function fresh(overrides: Partial<ReviewState> = {}): ReviewState {
  return { ...INITIAL_REVIEW, dueAt: new Date(NOW), ...overrides };
}

function daysFrom(now: Date, dueAt: Date): number {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return Math.round((dueAt.getTime() - start.getTime()) / 86_400_000);
}

describe('nextReview', () => {
  it('идёт по интервалам учебной программы: 2 → 5 → 10 → 21 день', () => {
    let state = fresh();
    const intervals: number[] = [];

    for (let i = 0; i < 4; i += 1) {
      state = nextReview(state, 2, NOW);
      intervals.push(state.intervalDays);
    }

    expect(intervals).toEqual(BASE_INTERVALS);
  });

  it('после четырёх успешных повторений интервал растёт по коэффициенту лёгкости', () => {
    let state = fresh();
    for (let i = 0; i < 4; i += 1) state = nextReview(state, 2, NOW);

    const before = state.intervalDays;
    state = nextReview(state, 2, NOW);

    expect(state.intervalDays).toBeGreaterThan(before);
    expect(state.intervalDays).toBe(Math.round(before * state.ease));
  });

  it('«не вспомнил» возвращает тему на завтра и увеличивает счётчик провалов', () => {
    let state = fresh();
    state = nextReview(state, 2, NOW);
    state = nextReview(state, 2, NOW);
    expect(state.repetitions).toBe(2);

    const failed = nextReview(state, 0, NOW);

    expect(failed.intervalDays).toBe(1);
    expect(failed.repetitions).toBe(0);
    expect(failed.lapses).toBe(1);
    expect(failed.ease).toBeLessThan(state.ease);
  });

  it('«с трудом» почти не увеличивает интервал', () => {
    let state = fresh();
    state = nextReview(state, 2, NOW);
    state = nextReview(state, 2, NOW);

    const hard = nextReview(state, 1, NOW);

    expect(hard.intervalDays).toBeGreaterThanOrEqual(2);
    expect(hard.intervalDays).toBeLessThan(BASE_INTERVALS[2]);
    expect(hard.ease).toBeLessThan(state.ease);
  });

  it('лёгкость не опускается ниже 1.3, сколько бы ни было провалов', () => {
    let state = fresh();
    for (let i = 0; i < 20; i += 1) state = nextReview(state, 0, NOW);

    expect(state.ease).toBeGreaterThanOrEqual(1.3);
  });

  it('лёгкость не поднимается выше 3.0', () => {
    let state = fresh();
    for (let i = 0; i < 20; i += 1) state = nextReview(state, 2, NOW);

    expect(state.ease).toBeLessThanOrEqual(3);
  });

  it('срок повторения отсчитывается от начала дня, а не от момента ответа', () => {
    const state = nextReview(fresh(), 2, NOW);

    expect(state.dueAt.getHours()).toBe(0);
    expect(daysFrom(NOW, state.dueAt)).toBe(2);
  });
});

describe('isDue', () => {
  it('карточка на сегодня готова к повторению', () => {
    expect(isDue({ dueAt: new Date('2026-03-01T00:00:00') }, NOW)).toBe(true);
  });

  it('просроченная карточка тоже готова', () => {
    expect(isDue({ dueAt: new Date('2026-02-20T00:00:00') }, NOW)).toBe(true);
  });

  it('карточка на завтра ещё не готова', () => {
    expect(isDue({ dueAt: new Date('2026-03-02T00:00:00') }, NOW)).toBe(false);
  });
});

describe('sortReviewQueue', () => {
  it('первыми идут самые просроченные', () => {
    const queue = sortReviewQueue(
      [
        { id: 'today', dueAt: new Date('2026-03-01T00:00:00'), lapses: 0 },
        { id: 'old', dueAt: new Date('2026-02-20T00:00:00'), lapses: 0 },
        { id: 'yesterday', dueAt: new Date('2026-02-28T00:00:00'), lapses: 0 },
      ],
      NOW,
    );

    expect(queue.map((item) => item.id)).toEqual(['old', 'yesterday', 'today']);
  });

  it('при равной просрочке выше идут темы, которые чаще забывали', () => {
    const queue = sortReviewQueue(
      [
        { id: 'easy', dueAt: new Date('2026-03-01T00:00:00'), lapses: 0 },
        { id: 'hard', dueAt: new Date('2026-03-01T00:00:00'), lapses: 4 },
      ],
      NOW,
    );

    expect(queue[0].id).toBe('hard');
  });

  it('не меняет исходный массив', () => {
    const items = [
      { id: 'a', dueAt: new Date('2026-03-01T00:00:00'), lapses: 0 },
      { id: 'b', dueAt: new Date('2026-02-01T00:00:00'), lapses: 0 },
    ];
    const copy = [...items];

    sortReviewQueue(items, NOW);

    expect(items).toEqual(copy);
  });
});

describe('dueLabel', () => {
  it('называет сроки по-человечески', () => {
    expect(dueLabel(new Date('2026-03-01T00:00:00'), NOW)).toBe('сегодня');
    expect(dueLabel(new Date('2026-03-02T00:00:00'), NOW)).toBe('завтра');
    expect(dueLabel(new Date('2026-03-04T00:00:00'), NOW)).toContain('3');
    expect(dueLabel(new Date('2026-02-27T00:00:00'), NOW)).toContain('просроч');
  });
});
