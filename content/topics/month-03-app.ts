import type { Topic } from '../types';

/** Месяц 3, недели 11–12: маршруты, эффекты, слайдер, авторизация на фронте, сборка приложения. */
export const MONTH_03_APP_TOPICS: Topic[] = [
  {
    id: 'react-router',
    title: 'React Router: страницы и переходы',
    tech: ['react'],
    monthNo: 3,
    weekNo: 11,
    importance: 'core',
    summary:
      'Пять страниц задания — вход, регистрация, кабинет, заявка, админка — это пять маршрутов. Каждая доступна по своему адресу, как требует модуль 2.',
    mustKnow: [
      '`BrowserRouter`, `Routes`, `Route`',
      '`Link` вместо `<a>` — без перезагрузки',
      '`useNavigate` для перехода из кода',
      '`useParams` для адресов с параметром',
      'Страница 404',
    ],
    theory: `## Установка и каркас

\`\`\`bash
npm install react-router-dom
\`\`\`

\`\`\`tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cabinet" element={<CabinetPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
\`\`\`

Маршрут \`*\` ловит всё остальное — страница «не найдено» нужна, иначе при опечатке в адресе пользователь увидит пустой экран.

## Ссылки

\`\`\`tsx
import { Link, NavLink } from 'react-router-dom';

<Link to="/register">Еще не зарегистрированы? Регистрация</Link>

<NavLink to="/cabinet" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
  Кабинет
</NavLink>
\`\`\`

Обычный \`<a href>\` перезагрузит страницу и сбросит всё состояние приложения. Внутри приложения всегда \`Link\`.

\`NavLink\` дополнительно знает, активен ли маршрут — удобно для подсветки текущего пункта меню.

## Переход из кода

\`\`\`tsx
const navigate = useNavigate();

async function handleSubmit() {
  await api.post('/login', values);
  navigate('/cabinet');              // после входа
}

navigate(-1);                        // назад
navigate('/login', { replace: true }); // без записи в историю
\`\`\`

\`replace: true\` нужен после выхода: иначе кнопка «назад» вернёт на страницу, доступа к которой уже нет.

## Параметры адреса

\`\`\`tsx
<Route path="/applications/:id" element={<ApplicationPage />} />

function ApplicationPage() {
  const { id } = useParams();   // строка!
  …
}
\`\`\`

Значение всегда строка — для сравнения с числовым id переводите через \`Number(id)\`.

## Про требование модуля 2

«Готовые макеты можно оформить в виде отдельных HTML-файлов, каждый из которых соответствует отдельной странице сайта». В React каждая страница и так доступна по своему адресу. Учебная программа советует уточнить у преподавателя, достаточно ли этого или нужны ещё статичные HTML-файлы.

## Тонкость с обновлением страницы

При обновлении страницы по адресу \`/cabinet\` сервер разработки Vite сам вернёт \`index.html\`. На настоящем сервере это нужно настроить отдельно, иначе будет 404 — деталь, о которой стоит знать заранее.`,
    examples: [
      {
        title: 'Шапка с навигацией по ролям',
        language: 'tsx',
        code: `import { Link, NavLink, useNavigate } from 'react-router-dom';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-md bg-body-tertiary">
      <div className="container">
        <Link className="navbar-brand" to="/">Конференции.РФ</Link>

        <ul className="navbar-nav ms-auto">
          {user ? (
            <>
              <li className="nav-item"><NavLink className="nav-link" to="/order">Заявка</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/cabinet">Кабинет</NavLink></li>
              {user.role === 'admin' && (
                <li className="nav-item"><NavLink className="nav-link" to="/admin">Админка</NavLink></li>
              )}
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>Выход</button>
              </li>
            </>
          ) : (
            <li className="nav-item"><NavLink className="nav-link" to="/login">Вход</NavLink></li>
          )}
        </ul>
      </div>
    </nav>
  );
}`,
        explanation:
          'Меню зависит от того, кто вошёл — задание дня 3 недели 17. Пункт админки скрыт от обычного пользователя, но доступ всё равно закрывает сервер.',
      },
    ],
    mistakes: [
      {
        title: '<a href> вместо Link',
        why: 'Страница перезагрузится: состояние приложения и данные о входе в памяти будут потеряны.',
      },
      {
        title: 'Нет маршрута 404',
        why: 'При опечатке в адресе пользователь видит пустую страницу вместо объяснения.',
      },
      {
        title: 'Прятать админку только в меню',
        why: 'Адрес /admin можно ввести руками. Нужен защищённый маршрут и обязательно проверка на сервере.',
      },
    ],
    quizId: 'quiz-react-router',
    taskIds: [],
    resources: [
      { title: 'React Router — документация', url: 'https://reactrouter.com/en/main/start/tutorial', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-login', 'm2-layouts'],
    prerequisites: ['react-forms'],
    estimatedMinutes: 45,
    planDays: ['day-11-1'],
    source: 'plan',
  },

  {
    id: 'react-effects',
    title: 'useEffect: загрузка данных и очистка',
    tech: ['react'],
    monthNo: 3,
    weekNo: 11,
    importance: 'core',
    summary:
      'useEffect выполняет побочные действия: загрузку с сервера, таймеры, подписки. Функция очистки — ключ к слайдеру, который не ломается при переходе между страницами.',
    mustKnow: [
      'Массив зависимостей и когда эффект повторяется',
      'Загрузка данных при открытии страницы',
      'Функция очистки и зачем она нужна',
      'Состояния загрузки и ошибки',
      'Почему не нужен эффект для вычисляемых данных',
    ],
    theory: `## Синтаксис

\`\`\`tsx
useEffect(() => {
  // что сделать
  return () => {
    // как убрать за собой (необязательно)
  };
}, [зависимости]);
\`\`\`

Массив зависимостей решает, когда эффект выполнится:

| Запись | Когда |
|---|---|
| \`[]\` | Один раз при появлении компонента |
| \`[id]\` | При появлении и при каждом изменении \`id\` |
| нет массива | После каждой отрисовки — почти всегда ошибка |

## Загрузка данных

\`\`\`tsx
const [applications, setApplications] = useState<Application[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  let cancelled = false;

  async function load() {
    try {
      setLoading(true);
      const data = await api.get<Application[]>('/applications/my');
      if (!cancelled) setApplications(data);
    } catch (e) {
      if (!cancelled) setError('Не удалось загрузить заявки');
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  load();
  return () => { cancelled = true; };
}, []);
\`\`\`

Флаг \`cancelled\` защищает от ситуации, когда пользователь ушёл со страницы раньше, чем пришёл ответ: обновлять состояние исчезнувшего компонента не нужно.

## Функция очистки

Всё, что вы «включили», нужно «выключить»:

\`\`\`tsx
useEffect(() => {
  const timer = setInterval(next, 3000);
  return () => clearInterval(timer);   // обязательно!
}, []);
\`\`\`

Без \`clearInterval\` таймер продолжит работать после ухода со страницы. Вернувшись, вы получите два таймера, потом три — слайдер начнёт «прыгать». Это самая частая ошибка со слайдером на экзамене.

То же касается \`addEventListener\` и любых подписок.

## StrictMode

В режиме разработки React намеренно вызывает эффект дважды — чтобы показать, правильно ли написана очистка. Если слайдер в разработке дёргается, а очистки нет — это не «баг React», а подсказка.

## Когда эффект НЕ нужен

Самая частая ошибка новичков — считать в эффекте то, что можно вычислить при отрисовке:

\`\`\`tsx
// не нужно
useEffect(() => { setFiltered(applications.filter(...)); }, [applications, status]);

// нужно
const filtered = applications.filter(...);
\`\`\`

Эффект нужен только для выхода за пределы React: сеть, таймеры, подписки, работа с localStorage.`,
    examples: [
      {
        title: 'Страница кабинета с четырьмя состояниями',
        language: 'tsx',
        code: `export function CabinetPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const data = await api.get<Application[]>('/applications/my');
      setApplications(data);
    } catch {
      setError('Не удалось загрузить заявки. Проверьте соединение и попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border" role="status" /></div>;

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <button className="btn btn-sm btn-outline-danger ms-2" onClick={load}>Повторить</button>
      </div>
    );
  }

  if (!applications.length) {
    return <div className="alert alert-light border">У вас пока нет заявок.</div>;
  }

  return <ApplicationList applications={applications} />;
}`,
        explanation:
          'Четыре состояния — загрузка, ошибка с кнопкой «Повторить», пусто и данные — прямо отвечают требованиям к качеству кода.',
      },
    ],
    mistakes: [
      {
        title: 'Забыть clearInterval',
        why: 'Таймер живёт после ухода со страницы. Слайдер начинает переключаться по нескольку раз за такт.',
      },
      {
        title: 'Эффект без массива зависимостей',
        wrong: 'useEffect(() => { load(); });',
        right: 'useEffect(() => { load(); }, []);',
        why: 'Без массива эффект выполняется после каждой отрисовки — получается бесконечная загрузка.',
      },
      {
        title: 'Вычисления в эффекте',
        why: 'Фильтрацию и сортировку делают при отрисовке. Эффект — только для побочных действий.',
      },
    ],
    quizId: 'quiz-react-effects',
    taskIds: ['task-react-effect-load', 'task-ui-four-states'],
    projectIds: ['project-03-cabinet-ui'],
    resources: [
      { title: 'ru.react.dev — useEffect', url: 'https://ru.react.dev/reference/react/useEffect', kind: 'docs', source: 'plan' },
      { title: 'ru.react.dev — когда эффект не нужен', url: 'https://ru.react.dev/learn/you-might-not-need-an-effect', kind: 'docs', source: 'plan' },
    ],
    examRefs: ['m1-cabinet', 'm3-quality'],
    prerequisites: ['react-state', 'js-fetch'],
    estimatedMinutes: 50,
    planDays: ['day-11-2'],
    source: 'plan',
  },

  {
    id: 'react-slider',
    title: 'Слайдер на React',
    tech: ['react'],
    monthNo: 3,
    weekNo: 11,
    importance: 'core',
    summary:
      'Требование модуля 2 в виде компонента: четыре изображения, автопереключение каждые три секунды, кнопки вперёд и назад, очистка таймера при размонтировании.',
    mustKnow: [
      'Индекс слайда в `useState`',
      '`setInterval` внутри `useEffect`',
      'Обязательный `clearInterval` в очистке',
      'Перелистывание по кругу',
      'Одинаковый размер изображений',
    ],
    theory: `## Состояние и таймер

\`\`\`tsx
const [index, setIndex] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setIndex((prev) => (prev + 1) % images.length);
  }, 3000);

  return () => clearInterval(timer);   // без этого слайдер сломается
}, [images.length]);
\`\`\`

Три важные детали:

1. **3000 мс** — дословное требование задания «каждые три секунды».
2. **Функция обновления** \`(prev) => …\` обязательна: если написать \`setIndex(index + 1)\`, эффект «запомнит» первое значение \`index\` и слайдер застрянет на втором слайде.
3. **clearInterval** в очистке — иначе после перехода на другую страницу и обратно таймеров станет два.

## Кнопки

\`\`\`tsx
const next = () => setIndex((prev) => (prev + 1) % images.length);
const prev = () => setIndex((p) => (p - 1 + images.length) % images.length);
\`\`\`

Прибавление длины в \`prev\` даёт корректный переход с первого слайда на последний.

## Разметка и стили

\`\`\`tsx
<div className="slider">
  <div className="slider__track" style={{ transform: \`translateX(-\${index * 100}%)\` }}>
    {images.map((src, i) => (
      <img key={src} src={src} alt={\`Слайд \${i + 1}\`} />
    ))}
  </div>
  <button type="button" onClick={prev} aria-label="Предыдущий слайд">‹</button>
  <button type="button" onClick={next} aria-label="Следующий слайд">›</button>
</div>
\`\`\`

\`\`\`css
.slider { position: relative; overflow: hidden; border-radius: 12px; }
.slider__track { display: flex; transition: transform .4s ease; }
.slider img { flex: 0 0 100%; width: 100%; aspect-ratio: 16/9; object-fit: cover; }
\`\`\`

\`object-fit: cover\` приводит четыре разных изображения к одному размеру — требование «четыре одинаковых по размерам изображения».

## Пауза при наведении

Необязательно, но приятно:

\`\`\`tsx
const [paused, setPaused] = useState(false);

useEffect(() => {
  if (paused) return;
  const timer = setInterval(…, 3000);
  return () => clearInterval(timer);
}, [paused, images.length]);

<div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
\`\`\`

## Карусель Bootstrap

У Bootstrap есть готовая карусель, но для неё нужен JavaScript библиотеки, который конфликтует с React (оба хотят управлять DOM). Свой слайдер на 40 строк надёжнее и показывает понимание useEffect.`,
    examples: [
      {
        title: 'Готовый компонент Slider',
        language: 'tsx',
        code: `import { useEffect, useState } from 'react';

interface Props {
  images: string[];
  intervalMs?: number;
}

export function Slider({ images, intervalMs = 3000 }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  if (!images.length) return null;

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((p) => (p - 1 + images.length) % images.length);

  return (
    <div className="slider">
      <div className="slider__track" style={{ transform: \`translateX(-\${index * 100}%)\` }}>
        {images.map((src, i) => (
          <img key={src} src={src} alt={\`Слайд \${i + 1}\`} loading={i === 0 ? 'eager' : 'lazy'} />
        ))}
      </div>

      <button type="button" className="slider__btn slider__btn--prev" onClick={prev} aria-label="Предыдущий слайд">‹</button>
      <button type="button" className="slider__btn slider__btn--next" onClick={next} aria-label="Следующий слайд">›</button>

      <div className="slider__dots" role="tablist">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className={i === index ? 'active' : ''}
            onClick={() => setIndex(i)}
            aria-label={\`Слайд \${i + 1}\`}
            aria-selected={i === index}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
}`,
      },
    ],
    mistakes: [
      {
        title: 'setIndex(index + 1) внутри интервала',
        wrong: 'setInterval(() => setIndex(index + 1), 3000)',
        right: 'setInterval(() => setIndex((prev) => (prev + 1) % total), 3000)',
        why: 'Эффект создаётся один раз и «запоминает» значение index. Слайдер застрянет на втором слайде.',
      },
      {
        title: 'Нет clearInterval',
        why: 'После ухода со страницы таймер продолжает работать; вернувшись, получите несколько таймеров сразу.',
      },
      {
        title: 'Интервал не 3000 мс',
        why: 'Задание называет три секунды дословно. Это проверяемое требование.',
      },
    ],
    quizId: 'quiz-react-slider',
    taskIds: ['task-react-slider', 'task-exam-slider-speed'],
    resources: [
      { title: 'ru.react.dev — синхронизация с эффектами', url: 'https://ru.react.dev/learn/synchronizing-with-effects', kind: 'docs', source: 'plan' },
    ],
    examRefs: ['m2-slider'],
    prerequisites: ['react-effects', 'js-timers'],
    estimatedMinutes: 50,
    planDays: ['day-11-3'],
    source: 'plan',
  },

  {
    id: 'react-context',
    title: 'Контекст: данные о входе во всём приложении',
    tech: ['react', 'security'],
    monthNo: 3,
    weekNo: 11,
    importance: 'core',
    summary:
      'AuthContext хранит текущего пользователя и токен. Благодаря ему шапка, кабинет и админка знают, кто вошёл, без передачи props через всё дерево.',
    mustKnow: [
      '`createContext` и провайдер',
      'Свой хук `useAuth`',
      'Хранение токена в localStorage',
      'Восстановление сессии при загрузке',
      'Что контекст не заменяет проверку на сервере',
    ],
    theory: `## Зачем

Без контекста данные о пользователе пришлось бы передавать props через каждый промежуточный компонент. Контекст делает значение доступным всему поддереву.

## Создание

\`\`\`tsx
interface AuthValue {
  user: User | null;
  token: string | null;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthValue | null>(null);

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth должен использоваться внутри AuthProvider');
  return value;
}
\`\`\`

Проверка на \`null\` в собственном хуке сразу подскажет, если провайдер забыли подключить.

## Провайдер

\`\`\`tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Восстановление сессии после перезагрузки страницы
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (loginValue: string, password: string) => {
    const data = await api.post<{ token: string; user: User }>('/login', { login: loginValue, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
\`\`\`

Флаг \`loading\` важен: пока сессия восстанавливается, защищённый маршрут не должен выбрасывать пользователя на страницу входа.

## Использование

\`\`\`tsx
const { user, logout } = useAuth();
\`\`\`

## Граница ответственности

Контекст — удобство интерфейса, а не безопасность. Значение \`user.role === 'admin'\` в localStorage правится вручную за десять секунд. Поэтому:

- контекст решает, **что показать**;
- сервер решает, **что разрешить**.

Каждый админский маршрут на сервере обязан проверять токен и роль. Это прямое требование качества кода на экзамене.`,
    examples: [
      {
        title: 'Подключение провайдера',
        language: 'tsx',
        code: `// main.tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);

// LoginPage.tsx
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(values.login, values.password);
      navigate('/cabinet');
    } catch {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="alert alert-danger">{error}</div>}
      {/* поля формы */}
      <Link to="/register">Еще не зарегистрированы? Регистрация</Link>
    </form>
  );
}`,
        explanation:
          'Сообщение «Неверный логин или пароль» общее для обоих случаев — так форма не подсказывает, какие логины существуют.',
      },
    ],
    mistakes: [
      {
        title: 'Доверять роли из localStorage',
        why: 'Значение правится вручную. Роль проверяет сервер по подписанному токену.',
      },
      {
        title: 'Не восстанавливать сессию при загрузке',
        why: 'После F5 пользователь окажется разлогиненным, хотя токен лежит в хранилище.',
      },
      {
        title: 'Забыть про флаг loading',
        why: 'Защищённый маршрут успеет выбросить на страницу входа раньше, чем восстановится сессия.',
      },
    ],
    quizId: 'quiz-react-context',
    taskIds: [],
    resources: [
      { title: 'ru.react.dev — контекст', url: 'https://ru.react.dev/learn/passing-data-deeply-with-context', kind: 'docs', source: 'plan' },
    ],
    examRefs: ['m1-login', 'm1-admin', 'm3-quality'],
    prerequisites: ['react-effects', 'js-localstorage'],
    estimatedMinutes: 50,
    planDays: ['day-11-4'],
    source: 'plan',
  },

  {
    id: 'react-protected-routes',
    title: 'Защищённые маршруты и роль администратора',
    tech: ['react', 'security'],
    monthNo: 3,
    weekNo: 11,
    importance: 'core',
    summary:
      'Кабинет доступен только вошедшим, админка — только администратору. Компонент-обёртка решает это в одном месте, но настоящую защиту даёт сервер.',
    mustKnow: [
      'Компонент-обёртка вокруг защищённой страницы',
      '`Navigate` для перенаправления',
      'Ожидание восстановления сессии',
      'Отдельная проверка роли admin',
      'Почему клиентская защита — только удобство',
    ],
    theory: `## ProtectedRoute

\`\`\`tsx
import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="text-center py-5"><span className="spinner-border" /></div>;

  if (!user) {
    // Запоминаем, куда пользователь шёл, чтобы вернуть его после входа
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
\`\`\`

Проверка \`loading\` обязательна: без неё при обновлении страницы пользователя выбросит на вход, пока читается localStorage.

## AdminRoute

\`\`\`tsx
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/cabinet" replace />;

  return <>{children}</>;
}
\`\`\`

Обратите внимание: не вошедшего отправляем на вход, а вошедшего без прав — в кабинет. Показывать ему страницу входа бессмысленно: он уже вошёл.

## Подключение

\`\`\`tsx
<Route path="/cabinet" element={<ProtectedRoute><CabinetPage /></ProtectedRoute>} />
<Route path="/order" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
<Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
\`\`\`

## Возврат после входа

\`\`\`tsx
const location = useLocation();
const from = (location.state as { from?: Location })?.from?.pathname ?? '/cabinet';

await login(values.login, values.password);
navigate(from, { replace: true });
\`\`\`

Пользователь хотел открыть \`/order\`, его отправили на вход — после входа он попадает именно туда, куда шёл.

## Главное про безопасность

Всё перечисленное — **удобство**, а не защита. Данные приходят с сервера, и если сервер отдаёт список всех заявок любому, кто спросит, то спрятанная кнопка ничего не решает.

Настоящая защита выглядит так:

\`\`\`js
// на сервере
router.get('/admin/applications', requireAuth, requireAdmin, async (req, res) => { … });
\`\`\`

Клиент прячет то, чем нельзя пользоваться. Сервер запрещает то, что нельзя делать. На экзамене нужны обе половины.`,
    examples: [
      {
        title: 'Маршруты приложения целиком',
        language: 'tsx',
        code: `export default function App() {
  return (
    <>
      <Header />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/cabinet" element={<ProtectedRoute><CabinetPage /></ProtectedRoute>} />
          <Route path="/order" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />

          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}`,
      },
    ],
    mistakes: [
      {
        title: 'Защита только на клиенте',
        why: 'Запрос к API можно отправить напрямую. Без проверки на сервере данные всех пользователей доступны любому.',
      },
      {
        title: 'Перенаправление без replace',
        why: 'Кнопка «назад» вернёт на страницу, с которой пользователя только что выгнали, — получится цикл.',
      },
    ],
    quizId: 'quiz-react-protected',
    taskIds: ['task-react-protected-route'],
    resources: [
      { title: 'React Router — навигация', url: 'https://reactrouter.com/en/main/components/navigate', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m1-admin', 'm3-quality'],
    prerequisites: ['react-context', 'react-router'],
    estimatedMinutes: 45,
    planDays: ['day-11-5'],
    source: 'plan',
  },

  {
    id: 'react-toast',
    title: 'Всплывающие уведомления',
    tech: ['react'],
    monthNo: 3,
    weekNo: 11,
    importance: 'supporting',
    summary:
      'Модуль 2 требует всплывающие уведомления в админке. Свой компонент на useState и setTimeout решает задачу без библиотеки Bootstrap.',
    mustKnow: [
      'Состояние уведомления и автоскрытие',
      '`setTimeout` с очисткой',
      'Позиционирование поверх содержимого',
      'Доступность: role="status" и aria-live',
      'Когда уведомление, а когда сообщение на странице',
    ],
    theory: `## Простейший вариант

\`\`\`tsx
const [toast, setToast] = useState<string | null>(null);

useEffect(() => {
  if (!toast) return;
  const timer = setTimeout(() => setToast(null), 3000);
  return () => clearTimeout(timer);
}, [toast]);

{toast && (
  <div className="toast show position-fixed bottom-0 end-0 m-3 text-bg-success" role="status">
    <div className="toast-body">{toast}</div>
  </div>
)}
\`\`\`

Вызов \`setToast('Статус изменён')\` показывает уведомление, которое само исчезнет через три секунды.

## Общий компонент

Если уведомления нужны на нескольких страницах, их выносят в контекст — так же, как данные о входе:

\`\`\`tsx
const ToastContext = createContext<((message: string, tone?: Tone) => void) | null>(null);

export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error('useToast должен использоваться внутри ToastProvider');
  return show;
}
\`\`\`

Тогда в любом месте: \`const toast = useToast(); toast('Заявка отправлена');\`

## Доступность

\`role="status"\` и \`aria-live="polite"\` заставляют программы чтения с экрана озвучить появившееся сообщение. Для ошибок используют \`role="alert"\` — оно перебивает текущее чтение.

## Уведомление или сообщение на странице

| Ситуация | Что показать |
|---|---|
| Статус заявки изменён | Уведомление |
| Заявка отправлена | Уведомление + переход в кабинет |
| Ошибка валидации поля | Текст рядом с полем |
| Не загрузились данные | Блок на странице с кнопкой «Повторить» |

Правило: уведомление подходит для короткого подтверждения действия. Для ошибок, которые нужно исправлять, оно не годится — исчезнет раньше, чем пользователь прочитает.

## Подтверждение действия

Для смены статуса программа предлагает модальное окно «Точно сменить статус?». В React его тоже проще написать самому: состояние \`confirmId\`, окно рисуется, когда оно не \`null\`.`,
    examples: [
      {
        title: 'Провайдер уведомлений',
        language: 'tsx',
        code: `type Tone = 'success' | 'danger' | 'info';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; tone: Tone } | null>(null);

  const show = useCallback((message: string, tone: Tone = 'success') => {
    setToast({ message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div
          className={\`toast show position-fixed bottom-0 end-0 m-3 text-bg-\${toast.tone}\`}
          role={toast.tone === 'danger' ? 'alert' : 'status'}
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setToast(null)}
              aria-label="Закрыть"
            />
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}`,
      },
    ],
    mistakes: [
      {
        title: 'Показывать ошибки валидации уведомлением',
        why: 'Уведомление исчезает, а ошибку нужно исправить. Текст должен остаться рядом с полем.',
      },
      {
        title: 'Забыть clearTimeout',
        why: 'Быстрые повторные действия наложат таймеры друг на друга, и уведомление исчезнет раньше времени.',
      },
    ],
    quizId: 'quiz-react-toast',
    taskIds: [],
    resources: [
      { title: 'Bootstrap: Toasts', url: 'https://getbootstrap.com/docs/5.3/components/toasts/', kind: 'docs', source: 'plan' },
    ],
    examRefs: ['m2-admin-tools'],
    prerequisites: ['react-effects'],
    estimatedMinutes: 40,
    planDays: ['day-11-6'],
    source: 'plan',
  },

  {
    id: 'react-structure',
    title: 'Структура клиентского приложения',
    tech: ['react', 'ts'],
    monthNo: 3,
    weekNo: 12,
    importance: 'core',
    summary:
      'Понятная структура папок — часть оценки качества кода. Программа предлагает конкретный набор: api, components, context, pages, types.',
    mustKnow: [
      'Папки api, components, context, pages',
      'Единый файл types.ts',
      'Все запросы в одном месте',
      'Тестовые данные до появления сервера',
      'Что коммитить, а что нет',
    ],
    theory: `## Структура из учебной программы

\`\`\`text
client/
├── public/img/            4 картинки для слайдера
├── src/
│   ├── api/               функции запросов к серверу
│   │   ├── client.ts      класс ApiClient
│   │   ├── auth.ts        register, login
│   │   ├── applications.ts
│   │   └── admin.ts
│   ├── components/        Header, Slider, Toast, DateInput,
│   │                      ProtectedRoute, AdminRoute, Pagination
│   ├── context/           AuthContext
│   ├── pages/             Login, Register, Cabinet, Order, Admin
│   ├── types.ts           User, Room, Application, Review, Status
│   ├── App.tsx            маршруты
│   ├── main.tsx           подключение Bootstrap и провайдеров
│   └── index.css          своя тема и микроанимации
└── vite.config.ts         прокси /api → сервер
\`\`\`

Этот список стоит выучить наизусть: на экзамене структуру нужно воспроизвести по памяти за несколько минут.

## Почему запросы в отдельной папке

\`\`\`ts
// api/applications.ts
export function getMyApplications(): Promise<Application[]> {
  return api.get<Application[]>('/applications/my');
}

export function createApplication(data: NewApplication): Promise<Application> {
  return api.post<Application>('/applications', data);
}
\`\`\`

Компонент вызывает \`getMyApplications()\` и ничего не знает про адреса и заголовки. Если адрес изменится, правка будет в одном файле. Критерий «все запросы в папке api» прямо назван в программе.

## Тестовые данные

До появления сервера (неделя 12) фронтенд работает на тестовых данных:

\`\`\`ts
// api/mock.ts
export const MOCK_APPLICATIONS: Application[] = [
  { id: 1, roomId: 2, paymentId: 1, date: '2026-09-14', status: 'Новая' },
];
\`\`\`

Держите их в отдельном файле, чтобы потом заменить одной строкой импорта.

## Прокси в Vite

\`\`\`ts
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:3000' },
  },
});
\`\`\`

Так запросы идут на \`/api/...\` и в разработке, и в сборке — без ошибок CORS и без магических адресов в коде.

## .gitignore

\`\`\`text
node_modules/
dist/
.env
\`\`\`

Файл создаётся до первого коммита.`,
    examples: [
      {
        title: 'Слой api целиком',
        language: 'typescript',
        code: `// api/client.ts
class ApiClient {
  constructor(private readonly baseUrl = '/api') {}

  private headers(): Record<string, string> {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: \`Bearer \${token}\` } : {}),
    };
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(this.baseUrl + path, { headers: this.headers() });
    if (!response.ok) throw new Error(await this.message(response));
    return response.json();
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(this.baseUrl + path, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(await this.message(response));
    return response.json();
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(this.baseUrl + path, {
      method: 'PATCH',
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(await this.message(response));
    return response.json();
  }

  private async message(response: Response): Promise<string> {
    if (response.status === 401) return 'Требуется вход';
    if (response.status === 403) return 'Недостаточно прав';
    const data = await response.json().catch(() => ({}));
    return data.error ?? 'Ошибка запроса';
  }
}

export const api = new ApiClient();`,
      },
    ],
    mistakes: [
      {
        title: 'fetch прямо в компонентах',
        why: 'Адреса и заголовки расползаются по проекту. Критерий качества кода прямо требует собрать запросы в одном месте.',
      },
      {
        title: 'Все компоненты в одной папке',
        why: 'На пятнадцати файлах это ещё терпимо, но структура из программы читается проверяющим с первого взгляда.',
      },
    ],
    quizId: 'quiz-react-structure',
    taskIds: ['task-q-api-client'],
    resources: [
      { title: 'Vite: настройка прокси', url: 'https://vitejs.dev/config/server-options.html#server-proxy', kind: 'docs', source: 'docs' },
    ],
    examRefs: ['m3-quality'],
    prerequisites: ['react-protected-routes', 'ts-oop'],
    estimatedMinutes: 40,
    planDays: ['day-12-1'],
    source: 'plan',
  },

  {
    id: 'react-admin-ui',
    title: 'Админка на React: фильтр, сортировка, пагинация',
    tech: ['react'],
    monthNo: 3,
    weekNo: 12,
    importance: 'core',
    summary:
      'Все инструменты админки из модуля 2 в одном компоненте: фильтр по статусу, сортировка кликом по заголовку, страницы по пять записей и уведомление о смене статуса.',
    mustKnow: [
      'Состояние: фильтр, сортировка, страница',
      'Вычисление видимого списка при отрисовке',
      'Сброс страницы при смене фильтра',
      'Смена статуса без перезагрузки',
      'Подтверждение и уведомление',
    ],
    theory: `## Состояние

\`\`\`tsx
const [applications, setApplications] = useState<Application[]>([]);
const [status, setStatus] = useState('');
const [ascending, setAscending] = useState(true);
const [page, setPage] = useState(1);
\`\`\`

Отфильтрованный список в состоянии **не хранится** — он вычисляется:

\`\`\`tsx
const filtered = status ? applications.filter((a) => a.status === status) : applications;
const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date) * (ascending ? 1 : -1));
const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
const safePage = Math.min(page, totalPages);
const visible = sorted.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
\`\`\`

Копия массива перед \`sort\` обязательна: иначе изменится состояние напрямую.

## Сброс страницы

\`\`\`tsx
const handleFilter = (value: string) => {
  setStatus(value);
  setPage(1);     // иначе можно остаться на несуществующей странице
};
\`\`\`

Это прямо оговорено в учебной программе: «при смене фильтра — назад на страницу 1».

## Смена статуса

\`\`\`tsx
const changeStatus = async (id: number, next: Status) => {
  try {
    await api.patch(\`/admin/applications/\${id}\`, { status: next });
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: next } : a)));
    toast('Статус изменён');
  } catch {
    toast('Не удалось изменить статус', 'danger');
  }
};
\`\`\`

Таблица обновляется без перезагрузки: меняется состояние, React перерисовывает только изменившуюся строку.

**Важно:** список допустимых статусов проверяет и сервер. Фронтенд предлагает три варианта, но сервер обязан отклонить четвёртый.

## Сортировка кликом

\`\`\`tsx
<th scope="col">
  <button className="btn btn-link p-0" onClick={() => setAscending((prev) => !prev)}>
    Дата {ascending ? '↑' : '↓'}
  </button>
</th>
\`\`\`

Стрелка показывает текущее направление — без неё пользователь не понимает, что происходит.

## Мобильная версия

Таблица с шестью колонками не влезает в 390 px. Два решения: \`table-responsive\` (горизонтальная прокрутка) или карточки вместо строк в медиазапросе. Первое быстрее, второе аккуратнее.`,
    examples: [
      {
        title: 'Таблица админки',
        language: 'tsx',
        code: `const PER_PAGE = 5;
const STATUSES: Status[] = ['Новая', 'Мероприятие назначено', 'Мероприятие завершено'];

export function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [status, setStatus] = useState('');
  const [ascending, setAscending] = useState(true);
  const [page, setPage] = useState(1);
  const toast = useToast();

  useEffect(() => {
    api.get<Application[]>('/admin/applications').then(setApplications).catch(() => {
      toast('Не удалось загрузить заявки', 'danger');
    });
  }, [toast]);

  const filtered = status ? applications.filter((a) => a.status === status) : applications;
  const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date) * (ascending ? 1 : -1));
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const visible = sorted.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const changeStatus = async (id: number, next: Status) => {
    await api.patch(\`/admin/applications/\${id}\`, { status: next });
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: next } : a)));
    toast('Статус изменён');
  };

  return (
    <div>
      <select
        className="form-select mb-3"
        value={status}
        onChange={(event) => { setStatus(event.target.value); setPage(1); }}
      >
        <option value="">Все статусы</option>
        {STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th scope="col">№</th>
              <th scope="col">ФИО</th>
              <th scope="col">Помещение</th>
              <th scope="col">
                <button className="btn btn-link p-0" onClick={() => setAscending((p) => !p)}>
                  Дата {ascending ? '↑' : '↓'}
                </button>
              </th>
              <th scope="col">Статус</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.userName}</td>
                <td>{item.roomTitle}</td>
                <td>{toRuDate(item.date)}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={item.status}
                    onChange={(event) => changeStatus(item.id, event.target.value as Status)}
                  >
                    {STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}`,
      },
    ],
    mistakes: [
      {
        title: 'Не сбрасывать страницу при смене фильтра',
        why: 'Пользователь остаётся на третьей странице отфильтрованного списка из двух записей и видит пустоту.',
      },
      {
        title: 'sort напрямую по состоянию',
        why: 'sort меняет массив на месте. React не увидит изменения, а данные тихо испортятся.',
      },
      {
        title: 'Перезагружать список после каждой смены статуса',
        why: 'Лишний запрос и мигание таблицы. Достаточно обновить одну запись в состоянии.',
      },
    ],
    quizId: 'quiz-react-admin',
    taskIds: ['task-react-admin-table'],
    resources: [
      { title: 'ru.react.dev — обновление объектов в состоянии', url: 'https://ru.react.dev/learn/updating-objects-in-state', kind: 'docs', source: 'plan' },
    ],
    examRefs: ['m2-admin-tools', 'm1-admin'],
    prerequisites: ['react-structure', 'js-array-methods'],
    estimatedMinutes: 55,
    planDays: ['day-12-3', 'day-12-4'],
    source: 'plan',
  },
];
