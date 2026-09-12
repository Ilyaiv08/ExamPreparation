import { describe, expect, it } from 'vitest';

import { firstName } from '@/lib/utils';

describe('firstName', () => {
  it('берёт имя из ФИО, а не фамилию', () => {
    expect(firstName('Иванов Иван Иванович')).toBe('Иван');
    expect(firstName('Иванов Илья')).toBe('Илья');
  });

  it('одно слово — это и есть обращение', () => {
    expect(firstName('Илья')).toBe('Илья');
  });

  it('пустое поле заменяется запасным вариантом', () => {
    expect(firstName('', 'ilya26')).toBe('ilya26');
    expect(firstName('   ', 'ilya26')).toBe('ilya26');
    expect(firstName('')).toBe('');
  });

  it('лишние пробелы не мешают', () => {
    expect(firstName('  Иванов   Илья  ')).toBe('Илья');
  });

  it('название вместо имени не превращается в обращение по второму слову', () => {
    // Раньше на дашборде выходило «Доброй ночи, платформы».
    expect(firstName('Администратор платформы')).toBe('Администратор');
    expect(firstName('Отдел кадров')).toBe('Отдел');
  });

  it('небрежный ввод со строчных букв читается как ФИО', () => {
    expect(firstName('иванов илья')).toBe('илья');
  });

  it('латиница работает по тем же правилам', () => {
    expect(firstName('Ivanov Ilya')).toBe('Ilya');
    expect(firstName('Platform administrator')).toBe('Platform');
  });
});
