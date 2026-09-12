// Точка входа для сборки React в песочницу выполнения кода.
// Собирается esbuild'ом в public/vendor/react/react-bundle.js на этапе postinstall,
// чтобы React был доступен офлайн (на экзамене интернета нет).
import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

window.React = React;
window.ReactDOMClient = ReactDOMClient;
// React 19 отдаёт act прямо из пакета — нужен, чтобы тесты дожидались перерисовки.
window.ReactAct = React.act;
