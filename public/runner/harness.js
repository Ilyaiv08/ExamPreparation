/* eslint-disable */
/**
 * Песочница выполнения кода студента.
 *
 * Этот файл загружается ВНУТРИ iframe с атрибутом sandbox="allow-scripts"
 * (без allow-same-origin), то есть в уникальном opaque-origin:
 *   - нет доступа к cookie, localStorage и DOM приложения;
 *   - нет доступа к файловой системе и системным командам (это браузер);
 *   - сеть перекрыта заглушками ниже;
 *   - время выполнения ограничивает родитель, уничтожая iframe.
 *
 * Связь с приложением — только postMessage.
 * См. docs/ANALYSIS.md, раздел 9 и lib/runner/client.ts.
 */
(function () {
  'use strict';

  var PARENT = window.parent;
  var jobDone = false;
  var jobStarted = false;

  // ───────────────────────── Перехват вывода ─────────────────────────
  var logs = [];
  function serializeArg(value) {
    try {
      if (typeof value === 'string') return value;
      if (typeof value === 'function') return '[function ' + (value.name || 'anonymous') + ']';
      if (value instanceof Error) return value.name + ': ' + value.message;
      return JSON.stringify(value, replacer, 2);
    } catch (e) {
      return String(value);
    }
  }
  function replacer(key, value) {
    if (typeof value === 'function') return '[function]';
    if (typeof value === 'undefined') return '[undefined]';
    if (typeof value === 'bigint') return value.toString() + 'n';
    return value;
  }
  ['log', 'info', 'warn', 'error', 'debug'].forEach(function (level) {
    var original = console[level] ? console[level].bind(console) : function () {};
    console[level] = function () {
      var parts = [];
      for (var i = 0; i < arguments.length; i++) parts.push(serializeArg(arguments[i]));
      if (logs.length < 200) logs.push({ level: level, text: parts.join(' ') });
      try {
        original.apply(null, arguments);
      } catch (e) {}
    };
  });
  console.table = function (data) {
    console.log(serializeArg(data));
  };

  // ───────────────────── Блокировка сетевого доступа ─────────────────────
  // Раздел 8 ТЗ: ограничение сетевого доступа.
  // Заглушки ставятся ДО выполнения кода студента.
  var NETWORK_ERROR = 'Сетевые запросы в песочнице запрещены';
  function blocked() {
    throw new Error(NETWORK_ERROR);
  }
  var networkLocked = false;
  function lockNetwork() {
    if (networkLocked) return;
    networkLocked = true;
    try {
      window.fetch = blocked;
    } catch (e) {}
    try {
      window.XMLHttpRequest = function () {
        blocked();
      };
    } catch (e) {}
    try {
      window.WebSocket = function () {
        blocked();
      };
    } catch (e) {}
    try {
      window.EventSource = function () {
        blocked();
      };
    } catch (e) {}
    try {
      if (navigator.sendBeacon) navigator.sendBeacon = blocked;
    } catch (e) {}
  }

  // ───────────────────────── Сравнение значений ─────────────────────────
  function typeName(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  function deepEqual(a, b) {
    if (Object.is(a, b)) return true;
    if (typeof a === 'number' && typeof b === 'number') return Object.is(a, b);
    if (typeName(a) !== typeName(b)) return false;
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
      return true;
    }
    if (a && b && typeof a === 'object') {
      var ka = Object.keys(a);
      var kb = Object.keys(b);
      if (ka.length !== kb.length) return false;
      for (var j = 0; j < ka.length; j++) {
        if (!Object.prototype.hasOwnProperty.call(b, ka[j])) return false;
        if (!deepEqual(a[ka[j]], b[ka[j]])) return false;
      }
      return true;
    }
    return false;
  }

  function compareValues(actual, expected, mode, tolerance) {
    switch (mode) {
      case 'strict':
        return actual === expected;
      case 'approx':
        var eps = typeof tolerance === 'number' ? tolerance : 1e-6;
        return typeof actual === 'number' && Math.abs(actual - expected) <= eps;
      case 'string':
        return String(actual) === String(expected);
      case 'set':
        if (!Array.isArray(actual) || !Array.isArray(expected)) return false;
        if (actual.length !== expected.length) return false;
        var rest = expected.slice();
        for (var i = 0; i < actual.length; i++) {
          var found = -1;
          for (var j = 0; j < rest.length; j++) {
            if (deepEqual(actual[i], rest[j])) {
              found = j;
              break;
            }
          }
          if (found === -1) return false;
          rest.splice(found, 1);
        }
        return true;
      default:
        return deepEqual(actual, expected);
    }
  }

  function preview(value) {
    if (typeof value === 'string') return JSON.stringify(value);
    if (typeof value === 'undefined') return 'undefined';
    if (typeof value === 'function') return '[function ' + (value.name || '') + ']';
    try {
      return JSON.stringify(value, replacer);
    } catch (e) {
      return String(value);
    }
  }

  // ─────────────────────────── Вспомогательное ───────────────────────────
  function AssertionError(message, expected, actual) {
    var err = new Error(message || 'Проверка не пройдена');
    err.name = 'AssertionError';
    err.isAssertion = true;
    err.expectedValue = expected;
    err.actualValue = actual;
    return err;
  }

  function makeAssert() {
    function assert(condition, message, expected, actual) {
      if (!condition) throw AssertionError(message, expected, actual);
    }
    assert.equal = function (actual, expected, message) {
      if (!deepEqual(actual, expected)) {
        throw AssertionError(
          message || 'Ожидалось ' + preview(expected) + ', получено ' + preview(actual),
          expected,
          actual,
        );
      }
    };
    assert.notEqual = function (actual, expected, message) {
      if (deepEqual(actual, expected)) throw AssertionError(message || 'Значения не должны совпадать', expected, actual);
    };
    assert.ok = function (value, message) {
      if (!value) throw AssertionError(message || 'Ожидалось истинное значение', true, value);
    };
    assert.includes = function (haystack, needle, message) {
      var ok = haystack && typeof haystack.indexOf === 'function' && haystack.indexOf(needle) !== -1;
      if (!ok) throw AssertionError(message || 'Не найдено: ' + preview(needle), needle, haystack);
    };
    assert.match = function (value, regexp, message) {
      if (!regexp.test(String(value))) {
        throw AssertionError(message || 'Значение ' + preview(value) + ' не подходит под ' + regexp, String(regexp), value);
      }
    };
    assert.throws = function (fn, message) {
      var threw = false;
      try {
        fn();
      } catch (e) {
        threw = true;
      }
      if (!threw) throw AssertionError(message || 'Ожидалась ошибка, но её не было');
    };
    return assert;
  }

  /**
   * Песочница ничего не загружает из сети: библиотеки приходят строкой
   * в самом задании (их для нас скачала родительская страница) и
   * выполняются здесь. Так требование «нет сетевого доступа» соблюдается
   * буквально, а не на словах.
   */
  function evalAsset(source, what) {
    if (!source) throw new Error('Песочнице не передан ресурс: ' + what + '. Выполните npm run assets.');
    // Часть библиотек — сборки CommonJS: они кладут себя в module.exports,
    // а не в глобальную область. Подставляем свой module и возвращаем результат.
    var shim = { exports: {} };
    // eslint-disable-next-line no-new-func
    new Function('module', 'exports', source)(shim, shim.exports);
    return shim.exports;
  }

  // ────────────────────── Исполнение кода JS/TS ──────────────────────
  /**
   * Выполняет код студента в собственной области видимости и возвращает
   * «ручку» для доступа к объявленным именам.
   */
  function createScope(jsCode, extraGlobals) {
    var names = Object.keys(extraGlobals || {});
    var values = names.map(function (n) {
      return extraGlobals[n];
    });
    var body =
      '"use strict";\n' +
      jsCode +
      '\n;return {' +
      'get: function (name) { try { return eval(name); } catch (e) { return undefined; } },' +
      'has: function (name) { try { eval(name); return true; } catch (e) { return false; } },' +
      'evaluate: function (src) { return eval(src); }' +
      '};';
    var factory = Function.apply(null, names.concat([body]));
    return factory.apply(null, values);
  }

  function runValueTests(scope, tests, source) {
    var results = [];
    var chain = Promise.resolve();
    tests.forEach(function (test) {
      chain = chain.then(function () {
        return runSingleValueTest(scope, test, source).then(function (res) {
          results.push(res);
        });
      });
    });
    return chain.then(function () {
      return results;
    });
  }

  function baseResult(test) {
    return {
      id: test.id,
      name: test.name,
      points: typeof test.points === 'number' ? test.points : 1,
      hidden: !!test.hidden,
      passed: false,
      durationMs: 0,
    };
  }

  function runSingleValueTest(scope, test, source) {
    var result = baseResult(test);
    var started = performance.now();
    return Promise.resolve()
      .then(function () {
        if (test.type === 'call') {
          var fn = scope.get(test.entry);
          if (typeof fn !== 'function') {
            throw AssertionError(
              'Функция «' + test.entry + '» не найдена. Проверьте имя и то, что она объявлена на верхнем уровне.',
            );
          }
          result.input = (test.args || []).map(preview).join(', ');
          return fn.apply(null, test.args || []);
        }
        if (test.type === 'expr') {
          result.input = test.expression;
          return scope.evaluate(test.expression);
        }
        if (test.type === 'assert') {
          var assert = makeAssert();
          var fn2 = new Function('ctx', test.code);
          return Promise.resolve(
            fn2({
              solution: scope,
              get: scope.get,
              evaluate: scope.evaluate,
              assert: assert,
              equal: deepEqual,
              preview: preview,
              source: source || '',
            }),
          ).then(function (custom) {
            if (custom && custom.pass === false) {
              throw AssertionError(custom.message, custom.expected, custom.actual);
            }
            return { __assertOnly: true, value: custom };
          });
        }
        throw new Error('Неизвестный тип теста: ' + test.type);
      })
      .then(function (actual) {
        return Promise.resolve(actual);
      })
      .then(function (actual) {
        result.durationMs = Math.round((performance.now() - started) * 100) / 100;
        if (actual && actual.__assertOnly) {
          result.passed = true;
          return result;
        }
        result.actual = preview(actual);
        if (Object.prototype.hasOwnProperty.call(test, 'expected')) {
          result.expected = preview(test.expected);
          result.passed = compareValues(actual, test.expected, test.compare, test.tolerance);
          if (!result.passed) {
            result.message = 'Ожидалось ' + result.expected + ', получено ' + result.actual;
          }
        } else {
          result.passed = true;
        }
        return result;
      })
      .catch(function (error) {
        result.durationMs = Math.round((performance.now() - started) * 100) / 100;
        result.passed = false;
        if (error && error.isAssertion) {
          result.message = error.message;
          if (typeof error.expectedValue !== 'undefined') result.expected = preview(error.expectedValue);
          if (typeof error.actualValue !== 'undefined') result.actual = preview(error.actualValue);
        } else {
          result.message = (error && error.name ? error.name + ': ' : '') + (error && error.message ? error.message : String(error));
          result.error = true;
        }
        return result;
      });
  }

  // ───────────────────────────── Раннер: JS/TS ─────────────────────────────
  // TypeScript уже превращён в JavaScript родительской страницей:
  // транспиляция — это разбор текста, её незачем делать внутри песочницы.
  function runJs(job) {
    return Promise.resolve().then(function () {
      lockNetwork();
      var scope = createScope(job.code, {});
      return runValueTests(scope, job.tests, job.source || job.code);
    });
  }

  // ───────────────────────────── Раннер: DOM ─────────────────────────────
  // Для DOM-заданий разметка студента уже вставлена в документ песочницы
  // при его создании (см. lib/runner/client.ts) — поэтому его <script>
  // выполняется по-настоящему, а тесты работают с живым DOM.
  function runDom(job) {
    lockNetwork();
    var results = [];
    var chain = Promise.resolve();
    job.tests.forEach(function (test) {
      chain = chain.then(function () {
        var result = baseResult(test);
        var started = performance.now();
        return Promise.resolve()
          .then(function () {
            var assert = makeAssert();
            var fn = new Function('ctx', test.code);
            return fn({
              document: document,
              window: window,
              assert: assert,
              $: function (sel, root) {
                return (root || document).querySelector(sel);
              },
              $$: function (sel, root) {
                return Array.prototype.slice.call((root || document).querySelectorAll(sel));
              },
              text: function (sel) {
                var el = document.querySelector(sel);
                return el ? (el.textContent || '').trim() : null;
              },
              css: function (elOrSel, prop) {
                var el = typeof elOrSel === 'string' ? document.querySelector(elOrSel) : elOrSel;
                if (!el) return null;
                return getComputedStyle(el).getPropertyValue(prop).trim();
              },
              html: function () {
                return document.body.innerHTML;
              },
              source: job.source || job.code,
              wait: function (ms) {
                return new Promise(function (r) {
                  setTimeout(r, ms);
                });
              },
              click: function (elOrSel) {
                var el = typeof elOrSel === 'string' ? document.querySelector(elOrSel) : elOrSel;
                if (!el) throw AssertionError('Элемент не найден: ' + elOrSel);
                el.click();
              },
              preview: preview,
            });
          })
          .then(function (custom) {
            result.durationMs = Math.round((performance.now() - started) * 100) / 100;
            if (custom && custom.pass === false) {
              result.passed = false;
              result.message = custom.message;
              if (typeof custom.expected !== 'undefined') result.expected = preview(custom.expected);
              if (typeof custom.actual !== 'undefined') result.actual = preview(custom.actual);
            } else {
              result.passed = true;
            }
            results.push(result);
          })
          .catch(function (error) {
            result.durationMs = Math.round((performance.now() - started) * 100) / 100;
            result.passed = false;
            if (error && error.isAssertion) {
              result.message = error.message;
              if (typeof error.expectedValue !== 'undefined') result.expected = preview(error.expectedValue);
              if (typeof error.actualValue !== 'undefined') result.actual = preview(error.actualValue);
            } else {
              result.error = true;
              result.message = (error && error.message) || String(error);
            }
            results.push(result);
          });
      });
    });
    return chain.then(function () {
      return results;
    });
  }

  // ──────────────────────────── Раннер: React ────────────────────────────
  function runReact(job) {
    return Promise.resolve()
      .then(function () {
        evalAsset(job.assets && job.assets.react, 'React');
        if (!window.React || !window.ReactDOMClient) {
          throw new Error('Сборка React для песочницы не инициализировалась. Выполните npm run assets.');
        }
        return job.code;
      })
      .then(function (jsCode) {
        lockNetwork();
        var React = window.React;
        var ReactDOMClient = window.ReactDOMClient;
        var scope = createScope(jsCode, { React: React });

        var mount = document.createElement('div');
        mount.id = 'react-root';
        document.body.appendChild(mount);

        var root = ReactDOMClient.createRoot(mount);
        var actImpl = window.ReactAct;

        function act(fn) {
          if (actImpl) {
            var out;
            actImpl(function () {
              out = fn();
            });
            return Promise.resolve(out);
          }
          var r = fn();
          return Promise.resolve(r).then(function (v) {
            return new Promise(function (res) {
              setTimeout(function () {
                res(v);
              }, 0);
            });
          });
        }

        function render(componentName, props) {
          var Component = typeof componentName === 'function' ? componentName : scope.get(componentName);
          if (typeof Component !== 'function') {
            throw AssertionError(
              'Компонент «' + componentName + '» не найден. Объявите его на верхнем уровне: function ' +
                componentName +
                '() { … }',
            );
          }
          return act(function () {
            root.render(React.createElement(Component, props || null));
          });
        }

        var results = [];
        var chain = Promise.resolve();
        job.tests.forEach(function (test) {
          chain = chain.then(function () {
            var result = baseResult(test);
            var started = performance.now();
            return Promise.resolve()
              .then(function () {
                var assert = makeAssert();
                var fn = new Function('ctx', test.code);
                return fn({
                  React: React,
                  render: render,
                  act: act,
                  root: mount,
                  container: mount,
                  solution: scope,
                  get: scope.get,
                  assert: assert,
                  $: function (sel) {
                    return mount.querySelector(sel);
                  },
                  $$: function (sel) {
                    return Array.prototype.slice.call(mount.querySelectorAll(sel));
                  },
                  text: function (sel) {
                    var el = sel ? mount.querySelector(sel) : mount;
                    return el ? (el.textContent || '').trim() : null;
                  },
                  click: function (elOrSel) {
                    var el = typeof elOrSel === 'string' ? mount.querySelector(elOrSel) : elOrSel;
                    if (!el) throw AssertionError('Элемент не найден: ' + elOrSel);
                    return act(function () {
                      el.click();
                    });
                  },
                  change: function (elOrSel, value) {
                    var el = typeof elOrSel === 'string' ? mount.querySelector(elOrSel) : elOrSel;
                    if (!el) throw AssertionError('Поле не найдено: ' + elOrSel);
                    return act(function () {
                      var setter = Object.getOwnPropertyDescriptor(
                        el instanceof window.HTMLTextAreaElement
                          ? window.HTMLTextAreaElement.prototype
                          : el instanceof window.HTMLSelectElement
                            ? window.HTMLSelectElement.prototype
                            : window.HTMLInputElement.prototype,
                        'value',
                      ).set;
                      setter.call(el, value);
                      el.dispatchEvent(new Event('input', { bubbles: true }));
                      el.dispatchEvent(new Event('change', { bubbles: true }));
                    });
                  },
                  submit: function (elOrSel) {
                    var el = typeof elOrSel === 'string' ? mount.querySelector(elOrSel) : elOrSel;
                    if (!el) throw AssertionError('Форма не найдена: ' + elOrSel);
                    return act(function () {
                      el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                    });
                  },
                  advanceTime: function (ms) {
                    return new Promise(function (res) {
                      setTimeout(res, ms);
                    });
                  },
                  // Синоним advanceTime: в dom-раннере та же операция называется wait.
                  wait: function (ms) {
                    return new Promise(function (res) {
                      setTimeout(res, ms);
                    });
                  },
                  // Исходный текст студента, а не результат транспиляции:
                  // в react-заданиях JSX компилируется, и проверки вида
                  // «есть ли className и key» по скомпилированному коду
                  // не сработали бы никогда.
                  source: job.source || job.code,
                  unmount: function () {
                    return act(function () {
                      root.unmount();
                    });
                  },
                  assertNoError: function () {},
                  preview: preview,
                });
              })
              .then(function (custom) {
                result.durationMs = Math.round((performance.now() - started) * 100) / 100;
                if (custom && custom.pass === false) {
                  result.passed = false;
                  result.message = custom.message;
                } else {
                  result.passed = true;
                }
                results.push(result);
              })
              .catch(function (error) {
                result.durationMs = Math.round((performance.now() - started) * 100) / 100;
                result.passed = false;
                if (error && error.isAssertion) {
                  result.message = error.message;
                  if (typeof error.expectedValue !== 'undefined') result.expected = preview(error.expectedValue);
                  if (typeof error.actualValue !== 'undefined') result.actual = preview(error.actualValue);
                } else {
                  result.error = true;
                  result.message = (error && error.message) || String(error);
                }
                results.push(result);
              });
          });
        });
        return chain.then(function () {
          return results;
        });
      });
  }

  // ───────────────────────────── Раннер: SQL ─────────────────────────────
  function ensureSqlJs(job) {
    return Promise.resolve().then(function () {
      var exported = evalAsset(job.assets && job.assets.sqlLoader, 'sql.js');
      var initSqlJs = typeof exported === 'function' ? exported : window.initSqlJs;
      if (typeof initSqlJs !== 'function') {
        throw new Error('sql.js не инициализировался. Выполните npm run assets.');
      }
      var wasm = job.assets && job.assets.sqlWasm;
      if (!wasm) throw new Error('Песочнице не передан модуль SQLite (wasm). Выполните npm run assets.');
      // wasmBinary избавляет от сетевого запроса за .wasm изнутри песочницы.
      return initSqlJs({ wasmBinary: wasm });
    });
  }

  // Слой совместимости MySQL → SQLite живёт в public/runner/sql-adapt.js:
  // этот файл склеивается с песочницей при загрузке и отдельно покрыт тестами.
  var adaptMysqlToSqlite = window.__adaptMysqlToSqlite;

  function runSql(job) {
    return ensureSqlJs(job).then(function (SQL) {
      lockNetwork();
      var db = new SQL.Database();
      var results = [];
      var adaptNotes = [];

      function exec(sqlText, label) {
        var adapted = adaptMysqlToSqlite(sqlText);
        adapted.notes.forEach(function (n) {
          if (adaptNotes.indexOf(n) === -1) adaptNotes.push(n);
        });
        try {
          db.exec(adapted.sql);
        } catch (error) {
          var e = new Error((label ? label + ': ' : '') + error.message);
          e.sqlError = true;
          throw e;
        }
      }

      // 1. Подготовка окружения задания.
      if (job.setupSql) exec(job.setupSql, 'Подготовка данных');

      // 2. Код студента.
      var userError = null;
      try {
        exec(job.code, 'Ваш SQL');
      } catch (error) {
        userError = error;
      }

      job.tests.forEach(function (test) {
        var result = baseResult(test);
        var started = performance.now();
        if (userError) {
          result.passed = false;
          result.error = true;
          result.message = userError.message;
          result.durationMs = 0;
          results.push(result);
          return;
        }
        try {
          if (test.type === 'sql-schema') {
            checkSchema(db, test, result);
          } else {
            checkQuery(db, test, result);
          }
        } catch (error) {
          result.passed = false;
          result.error = true;
          result.message = error.message;
        }
        result.durationMs = Math.round((performance.now() - started) * 100) / 100;
        results.push(result);
      });

      try {
        db.close();
      } catch (e) {}

      return { results: results, notes: adaptNotes };
    });
  }

  function rowsFromExec(db, sql) {
    var res = db.exec(sql);
    if (!res.length) return { columns: [], rows: [] };
    return { columns: res[0].columns, rows: res[0].values };
  }

  function checkQuery(db, test, result) {
    var out = rowsFromExec(db, test.check);
    result.input = test.check;
    var actualRows = out.rows.map(function (row) {
      return row.map(function (cell) {
        return cell === null ? null : cell;
      });
    });
    var expectedRows = test.expectedRows || [];

    if (test.expectedColumns && test.expectedColumns.length) {
      var okCols =
        out.columns.length === test.expectedColumns.length &&
        out.columns.every(function (c, i) {
          return String(c).toLowerCase() === String(test.expectedColumns[i]).toLowerCase();
        });
      if (!okCols) {
        result.passed = false;
        result.expected = 'колонки: ' + test.expectedColumns.join(', ');
        result.actual = 'колонки: ' + out.columns.join(', ');
        result.message = 'Набор или порядок колонок отличается';
        return;
      }
    }

    var a = actualRows;
    var b = expectedRows;
    if (!test.ordered) {
      a = a.slice().sort(rowCompare);
      b = b.slice().sort(rowCompare);
    }
    result.expected = formatRows(expectedRows);
    result.actual = formatRows(actualRows);
    result.passed = deepEqual(a, b);
    if (!result.passed) {
      result.message =
        actualRows.length !== expectedRows.length
          ? 'Ожидалось строк: ' + expectedRows.length + ', получено: ' + actualRows.length
          : 'Данные в строках отличаются';
    }
  }

  function rowCompare(x, y) {
    var sx = JSON.stringify(x);
    var sy = JSON.stringify(y);
    return sx < sy ? -1 : sx > sy ? 1 : 0;
  }

  function formatRows(rows) {
    if (!rows || !rows.length) return '(пусто)';
    return rows
      .map(function (r) {
        return '[' + r.map(preview).join(', ') + ']';
      })
      .join('\n');
  }

  function checkSchema(db, test, result) {
    var info;
    try {
      info = rowsFromExec(db, "PRAGMA table_info('" + test.table.replace(/'/g, "''") + "')");
    } catch (e) {
      result.passed = false;
      result.message = 'Таблица «' + test.table + '» не найдена';
      return;
    }
    if (!info.rows.length) {
      result.passed = false;
      result.expected = 'таблица ' + test.table;
      result.actual = 'таблица не создана';
      result.message = 'Таблица «' + test.table + '» не найдена';
      return;
    }
    var cols = info.rows.map(function (r) {
      return { name: String(r[1]), type: String(r[2] || '').toUpperCase(), notNull: r[3] === 1, pk: r[5] > 0 };
    });
    var problems = [];
    (test.columns || []).forEach(function (want) {
      var got = cols.filter(function (c) {
        return c.name.toLowerCase() === want.name.toLowerCase();
      })[0];
      if (!got) {
        problems.push('нет колонки «' + want.name + '»');
        return;
      }
      if (want.type) {
        var wantType = String(want.type).toUpperCase();
        if (got.type.indexOf(wantType) === -1 && wantType.indexOf(got.type) === -1) {
          problems.push('колонка «' + want.name + '»: тип ' + got.type + ', ожидался ' + wantType);
        }
      }
      if (want.notNull && !got.notNull) problems.push('колонка «' + want.name + '» должна быть NOT NULL');
      if (want.pk && !got.pk) problems.push('колонка «' + want.name + '» должна быть первичным ключом');
    });

    if (test.foreignKeys && test.foreignKeys.length) {
      var fks = rowsFromExec(db, "PRAGMA foreign_key_list('" + test.table.replace(/'/g, "''") + "')");
      var fkList = fks.rows.map(function (r) {
        return { refTable: String(r[2]), from: String(r[3]), to: String(r[4] || '') };
      });
      test.foreignKeys.forEach(function (want) {
        var found = fkList.filter(function (f) {
          return (
            f.from.toLowerCase() === want.column.toLowerCase() &&
            f.refTable.toLowerCase() === want.refTable.toLowerCase()
          );
        })[0];
        if (!found) problems.push('нет внешнего ключа ' + want.column + ' → ' + want.refTable);
      });
    }

    result.expected = (test.columns || [])
      .map(function (c) {
        return c.name + (c.type ? ' ' + c.type : '');
      })
      .join(', ');
    result.actual = cols
      .map(function (c) {
        return c.name + ' ' + c.type;
      })
      .join(', ');
    result.passed = problems.length === 0;
    if (!result.passed) result.message = problems.join('; ');
  }

  // ─────────────────────── Свободный запуск (без тестов) ───────────────────────
  function runFree(job) {
    return Promise.resolve().then(function () {
      lockNetwork();
      var scope = createScope(job.code, {});
      return { results: [], scope: scope };
    });
  }

  // ──────────────────────────── Обработка задания ────────────────────────────
  function handleJob(job) {
    var started = performance.now();
    var runner;
    if (job.mode === 'run' && (job.runtime === 'js' || job.runtime === 'ts')) {
      runner = runFree(job).then(function () {
        return { results: [] };
      });
    } else if (job.runtime === 'js' || job.runtime === 'ts') {
      runner = runJs(job).then(function (results) {
        return { results: results };
      });
    } else if (job.runtime === 'dom') {
      runner = runDom(job).then(function (results) {
        return { results: results };
      });
    } else if (job.runtime === 'react') {
      runner = runReact(job).then(function (results) {
        return { results: results };
      });
    } else if (job.runtime === 'sql') {
      runner = runSql(job);
    } else {
      runner = Promise.reject(new Error('Неизвестная среда выполнения: ' + job.runtime));
    }

    runner
      .then(function (payload) {
        send({
          type: 'result',
          jobId: job.jobId,
          results: payload.results || [],
          notes: payload.notes || [],
          logs: logs,
          durationMs: Math.round(performance.now() - started),
        });
      })
      .catch(function (error) {
        send({
          type: 'failure',
          jobId: job.jobId,
          message: (error && error.message) || String(error),
          stack: error && error.stack ? String(error.stack).split('\n').slice(0, 4).join('\n') : '',
          logs: logs,
          durationMs: Math.round(performance.now() - started),
        });
      });
  }

  function send(message) {
    if (jobDone && message.type !== 'log') return;
    if (message.type === 'result' || message.type === 'failure') jobDone = true;
    try {
      PARENT.postMessage(message, '*');
    } catch (e) {}
  }

  window.addEventListener('message', function (event) {
    var data = event.data;
    if (!data || data.type !== 'job') return;
    // Задание выполняется ровно один раз, даже если сообщение придёт дважды.
    if (jobStarted) return;
    jobStarted = true;
    try {
      handleJob(data.job);
    } catch (error) {
      send({ type: 'failure', jobId: data.job && data.job.jobId, message: String(error && error.message), logs: logs });
    }
  });

  window.addEventListener('error', function (event) {
    if (logs.length < 200) {
      logs.push({ level: 'error', text: event.message + (event.lineno ? ' (строка ' + event.lineno + ')' : '') });
    }
  });

  window.addEventListener('unhandledrejection', function (event) {
    if (logs.length < 200) {
      logs.push({ level: 'error', text: 'Необработанная ошибка Promise: ' + (event.reason && event.reason.message) });
    }
  });

  // Готовы принимать задание.
  send({ type: 'ready' });
})();
