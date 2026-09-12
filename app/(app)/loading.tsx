/**
 * Состояние загрузки страниц приложения (раздел 33 ТЗ).
 *
 * Скелет повторяет типичную раскладку: заголовок, три карточки-показателя
 * и блок содержимого. Так переход не выглядит как зависание.
 */
export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5" aria-busy="true" aria-live="polite">
      <span className="sr-only">Загрузка страницы</span>

      <div className="flex flex-col gap-2">
        <div className="skeleton h-6 w-56 rounded-lg" />
        <div className="skeleton h-4 w-80 rounded-lg" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="card p-4">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton mt-3 h-7 w-16 rounded" />
          </div>
        ))}
      </div>

      <div className="card p-4">
        <div className="skeleton h-4 w-40 rounded" />
        <div className="skeleton mt-3 h-3 w-full rounded" />
        <div className="skeleton mt-2 h-3 w-11/12 rounded" />
        <div className="skeleton mt-2 h-3 w-9/12 rounded" />
      </div>
    </div>
  );
}
