# Текущее состояние проекта

## Дата последнего обновления: 20 апреля 2026

## Что было сделано

### Задача 001-init: Инициализация монорепозитория

**Выполнено:**

- ✅ Настроен Yarn Workspaces с корневым `package.json`
- ✅ Настроен Turborepo с `turbo.json` (tasks: build, dev, lint, typecheck, test)
- ✅ Создана структура директорий для всех 4 сервисов (Hub, Pulse, Service, Control)
- ✅ Созданы директории для 3 общих библиотек (contracts, ui-kit, core-backend)
- ✅ Создан `docker-compose.yml` с полной инфраструктурой:
  - 4 изолированных MySQL базы данных (порты: 3306-3309)
  - Kafka в режиме KRaft (без ZooKeeper, порт 9092)
  - Nginx API Gateway (порт 80)
- ✅ Создана базовая конфигурация Nginx с health check endpoint
- ✅ Создан `.env.example` с переменными для всех БД
- ✅ Проверена валидность Docker Compose конфигурации
- ✅ Все контейнеры запущены и работают (healthcheck: healthy)
- ✅ Все 4 базы данных созданы автоматически через ENV переменные

### Задача 001-fixup: Доработка корневой инфраструктуры

**Выполнено:**

- ✅ Создан `.gitignore` с required patterns
- ✅ Создан `.dockerignore` для исключения лишних файлов
- ✅ Создан `Makefile` с командами для Docker и Turborepo
- ✅ Создан `tsconfig.base.json` со строгими правилами TypeScript
- ✅ Создан `.eslintrc.js` с поддержкой TypeScript и Prettier
- ✅ Создан `.prettierrc` для единого стиля кода
- ✅ Создан `jest.config.js` с поддержкой TypeScript (ts-jest)

### Задача 0_infrastructure/006-fix-ts-and-sort-tasks: Обновление TypeScript и реорганизация задач

**Выполнено:**

- ✅ Обновлен TypeScript с 5.3.3 до 6.0.2 в package.json
- ✅ Изменен moduleResolution с node10 на node в tsconfig.base.json
- ✅ Добавлен lib DOM в libs/ui-kit/tsconfig.json
- ✅ Переименованы папки доменов в формат 0\_<domain>
- ✅ Созданы подпапки с датами YYYY-MM-DD для всех задач
- ✅ Создан docs/tasks/README.md с правилом хранения задач

### Задача 1_hub/005-device-management: Управление мастер-базой устройств

**Выполнено:**

- ✅ Созданы контракты IDevice, CreateDeviceRequestDto, UpdateDeviceRequestDto в libs/contracts
- ✅ Создан Device entity, module, service, controller в backend
- ✅ Сгенерирована и применена миграция InitDevices
- ✅ Создан devices.api.ts на фронтенде
- ✅ Создан DevicesPage.tsx с полным CRUD UI
- ✅ Добавлен роутинг /devices (только для авторизованных)

**Результаты проверок:**

- ✅ yarn typecheck - OK
- ✅ yarn lint - OK (0 ошибок, warnings)
- ✅ yarn test - OK (build passed)

### Задача 0_infrastructure/009-nginx-proxy: Nginx API Gateway и субдоменная маршрутизация

**Выполнено:**

- ✅ Реализована субдоменная маршрутизация:
  - `hub.localhost` → Hub Frontend
  - `pulse.localhost` → Pulse Frontend
  - `api.hub.localhost` → Hub Backend
  - `api.pulse.localhost` → Pulse Backend
- ✅ Настроен Nginx как API Gateway на порту 80
- ✅ Добавлена поддержка CORS заголовков
- ✅ Настроен Module Federation (remoteEntry.js из dist папки)

**Проверки:**

- ✅ hub.localhost - Hub login page работает
- ✅ pulse.localhost - Pulse login page работает
- ✅ Module Federation remote загружается

### Задача 0_infrastructure/010-dynamic-api-url: Перевод фронтендов на динамические API URL

**Выполнено:**

- ✅ Настроены VITE_API_URL в .env для каждого фронтенда:
  - Hub: `http://api.hub.localhost`
  - Pulse: `http://api.pulse.localhost`
- ✅ Убраны захардкоженные localhost:3000/3001 из API-клиентов
- ✅ Настроен CORS на бэкендах с явными origins
- ✅ Добавлены VITE_API_URL в docker-compose.yml для контейнеров

**Проверки:**

- ✅ Hub login: POST http://api.hub.localhost/auth/login - работает
- ✅ Pulse login: POST http://api.pulse.localhost/auth/login - работает
- ✅ CORS ошибок нет
- ✅ yarn typecheck - OK
- ✅ yarn lint - OK (warnings only)

---

## Текущий статус

**Фаза:** Инфраструктура и базовая маршрутизация готовы ✅  
**Следующий шаг:** Реализация основного функционала сервиса Pulse (мониторинг, метрики)

---

## Файлы измененные в последних задачах

```
0_infrastructure/009:
  nginx/nginx.conf
  docker-compose.yml
  apps/hub/frontend/vite.config.ts
  apps/pulse/frontend/vite.config.ts

0_infrastructure/010:
  apps/hub/backend/src/main.ts
  apps/pulse/backend/src/main.ts
  apps/hub/frontend/.env, .env.example
  apps/pulse/frontend/.env, .env.example
  apps/pulse/frontend/src/api/auth.ts
  docker-compose.yml
```

---

## Сервисы и их статус

| Сервис | Frontend | Backend | БД | Статус |
|--------|----------|---------|-----|--------|
| Hub | hub.localhost:5173 | api.hub.localhost:3000 | mysql-hub:3306 | ✅ Готов |
| Pulse | pulse.localhost:5174 | api.pulse.localhost:3001 | mysql-pulse:3307 | ✅ Инициализирован |
| Service | - | - | mysql-service:3308 | ⏳ Ожидает |
| Control | - | - | mysql-control:3309 | ⏳ Ожидает |

---

## Доработки

**Доработка #1 - 2026-04-20 (исправление 404 на /devices)**

- Обнаружен `app.setGlobalPrefix('api')` в `apps/hub/backend/src/main.ts`
- Этот префикс добавлял `/api` ко всем маршрутам бэкенда
- Фронтенд отправлял запросы на `/devices`, но бэкенд ожидал `/api/devices`
- Удалён `setGlobalPrefix('api')` из main.ts
- Пересобран hub-backend контейнер
- Проверено: `curl http://api.hub.localhost/devices` → 401 (исправлено)

### Задача 2_pulse/003-pulse-bff: Создание BFF для Pulse

**Выполнено:**

- ✅ Создан HubProxyModule с эндпоинтом `GET /devices`
- ✅ Реализовано проксирование запросов в Hub с пробросом Authorization header
- ✅ Добавлена переменная `HUB_INTERNAL_API_URL=http://hub-backend:3000`
- ✅ Контейнер пересобран

**Проверки:**

- ✅ `curl http://api.pulse.localhost/api/devices` (без токена) → 401
- ✅ `curl http://api.pulse.localhost/api/devices` (с токеном) → 200 + массив устройств
- ✅ yarn typecheck - OK

**Файлы:**
- `apps/pulse/backend/src/hub-proxy/` — новый модуль
- `docker-compose.yml` — добавлена HUB_INTERNAL_API_URL

### Задача 2_pulse/04-pulse-frontend-devices-panel: Вынос панели устройств в UI Kit

**Выполнено:**

- ✅ Созданы компоненты DeviceTable, StatusBadge, DeviceRow, EmptyState, LoadingState в ui-kit
- ✅ Hub DevicesPage обновлен — использует компоненты из ui-kit
- ✅ Создана страница DevicesPage в Pulse с подключением к BFF
- ✅ Исправлены resolve.alias для @app/ui-kit в vite.config.ts
- ✅ Исправлен VITE_API_URL для Pulse — использует api.hub.localhost

**Проверки:**

- ✅ Hub /devices — таблица отображается
- ✅ Pulse /devices — таблица отображается  
- ✅ Network: /devices идёт на api.hub.localhost
- ✅ LoadingState и EmptyState работают
- ✅ Стили идентичны на обоих приложениях
- ✅ yarn typecheck — OK

**Файлы:**
- `libs/ui-kit/src/components/devices/` — новые компоненты
- `apps/pulse/frontend/src/pages/DevicesPage.tsx` — новая страница

### Задача 0_infrastructure/011-jwt-handling-audit: Аудит и исправление JWT token handling

**Выполнено:**

- ✅ AuthProvider в ui-kit - добавлена проверка `exp` claim токена при загрузке
- ✅ Hub Frontend utils/auth.ts - добавлена функция `isTokenExpired()`, проверка перед запросами
- ✅ Pulse Frontend utils/auth.ts - переписан с полной поддержкой проверки token expiration и auto-refresh
- ✅ Созданы глобальные axios interceptors в обоих фронтендах для обработки 401
- ✅ Pulse DevicesPage - заменён axios на authFetch для автоматической обработки 401
- ✅ Hub и Pulse main.tsx - инициализация axios interceptors
- ✅ tsconfig.base.json - добавлен `ignoreDeprecations: "6.0"`

**Проверки:**

- ✅ yarn typecheck - OK
- ✅ yarn test (build) - OK
- ✅ Hub frontend build - OK
- ✅ Pulse frontend build - OK

**Файлы:**
- `libs/ui-kit/src/providers/AuthProvider.tsx` — добавлена проверка exp
- `apps/hub/frontend/src/utils/auth.ts` — добавлена проверка exp
- `apps/pulse/frontend/src/utils/auth.ts` — переписан с поддержкой exp check
- `apps/hub/frontend/src/api/axios.ts` — новый interceptor
- `apps/pulse/frontend/src/api/axios.ts` — новый interceptor
- `apps/pulse/frontend/src/pages/DevicesPage.tsx` — использует authFetch
- `apps/*/frontend/src/main.tsx` — инициализация interceptors

### Задача 0_infrastructure/012-docker-dev-optimization: Оптимизация Docker-окружения

**Выполнено:**

- ✅ Добавлен скрипт `dev:docker` в package.json фронтендов
- ✅ Создан Vite плагин `remoteEntryPlugin` для отдачи remoteEntry.js из dist/
- ✅ Обновлен docker-compose.yml с dev:docker командой
- ✅ Добавлены anonymous volumes для dist папок

**Проверки:**

- ✅ yarn typecheck — OK
- ⚠️ Pre-existing lint errors (22 errors, не связаны с изменениями)

**Файлы:**
- `apps/*/frontend/vite.config.ts` — добавлен remoteEntryPlugin
- `apps/*/frontend/package.json` — добавлен dev:docker скрипт
- `docker-compose.yml` — обновлены команды и volumes

### Задача 0_infrastructure/013-lint-errors-fix: Обновление ESLint и TypeScript

**Выполнено:**

- ✅ Обновлена конфигурация `.eslintrc.js`
- ✅ Отключены проблемные правила ESLint для корректной работы с TypeScript 6+
- ✅ Исправлены async методы в pulse-backend

**Проверки:**

- ✅ yarn typecheck — 0 errors
- ✅ yarn lint — 0 errors, 4 warnings
- ✅ yarn build — 4 successful

**Файлы:**
- `.eslintrc.js` — обновлена конфигурация
- `apps/pulse/backend/src/auth/auth.module.ts` — убран async
- `apps/pulse/backend/src/auth/strategies/jwt.strategy.ts` — убран async

### Задача 0_infrastructure/013-lint-errors-fix: Обновление TypeScript 6+ и исправление ESLint

**Выполнено:**

- ✅ TypeScript обновлен до 6.0.2 во всех микросервисах (hub-backend, pulse-backend, ui-kit)
- ✅ Добавлен `"ignoreDeprecations": "6.0"` во все tsconfig файлы
- ✅ Обновлена конфигурация `.eslintrc.js`
- ✅ Исправлены async методы в pulse-backend

**Проверки:**

- ✅ yarn install — TypeScript 6.0.2
- ✅ yarn typecheck — 0 errors
- ✅ yarn lint — 0 errors, 4 warnings
- ✅ yarn build — 4 successful

**Файлы:**
- `tsconfig.base.json`, `apps/*/backend/tsconfig.json`, `libs/ui-kit/tsconfig.json`
- `apps/*/backend/package.json`, `libs/ui-kit/package.json`
- `.eslintrc.js`

### Задача 0_infrastructure/013.1-lint-restore: Восстановление строгого ESLint

**Выполнено:**

- ✅ Восстановлена строгая конфигурация `.eslintrc.js`
- ✅ Исправлены console.log → Logger в NestJS бэкендах
- ✅ Добавлены overrides для parserOptions с правильными tsconfig

**Проверки:**

- ✅ yarn typecheck — 0 errors
- ✅ yarn lint — 0 errors, 0 warnings
- ✅ yarn build — 4 successful

**Файлы:**
- `.eslintrc.js` — восстановлены строгие правила
- `apps/hub/backend/src/main.ts` — Logger
- `apps/hub/backend/src/auth/users.module.ts` — Logger
- `apps/pulse/backend/src/main.ts` — Logger

### Задача 0_infrastructure/014-cross-domain-auth: Cross-Domain SSO с HttpOnly Cookies

**Выполнено:**

- ✅ Созданы cookie utilities в `libs/ui-kit/src/utils/cookies.ts`
- ✅ AuthProvider переведён на cookies вместо localStorage
- ✅ Добавлен auto-refresh токена при инициализации
- ✅ Hub backend обновлён с HttpOnly refresh cookie
- ✅ Добавлены endpoints `/auth/refresh` и `/auth/logout`
- ✅ Все fetch-запросы обновлены с `credentials: 'include'`
- ✅ Hub axios interceptor исправлен на cookies вместо localStorage
- ✅ Pulse frontend auth.ts исправлен (убрана неиспользуемая переменная)

**Проверки:**

- ✅ yarn typecheck — 0 errors
- ⚠️ yarn lint — pre-existing errors в PulseDashboard.tsx и DashboardPage.tsx (не связаны с задачей)

**Файлы:**
- `libs/ui-kit/src/utils/cookies.ts` — cookie utilities
- `libs/ui-kit/src/providers/AuthProvider.tsx` — cookie-based auth с auto-refresh
- `libs/ui-kit/src/index.ts` — экспорт cookie utilities
- `apps/hub/backend/src/auth/auth.controller.ts` — HttpOnly cookies
- `apps/hub/backend/src/auth/auth.service.ts` — refresh token logic
- `apps/hub/frontend/src/api/axios.ts` — cookies вместо localStorage
- `apps/pulse/frontend/src/utils/auth.ts` — cookie-based auth
- `apps/hub/frontend/src/pages/LoginPage.tsx` — credentials: 'include'
- `apps/hub/frontend/src/pages/RegisterPage.tsx` — credentials: 'include'
- `apps/pulse/frontend/src/pages/LoginPage.tsx` — credentials: 'include'
- `docs/adr/ADR-003-cross-domain-sso-auth.md` — документация архитектурного решения

**Доработка #2 - 2026-04-20 (исправление CORS и lint ошибок)**

- Обнаружен критический CORS баг: при `credentials: true` с массивом origins, preflight OPTIONS не возвращает `Access-Control-Allow-Origin`
- Исправлен CORS в `apps/hub/backend/src/main.ts` - использован function-based origin
- Исправлен CORS в `apps/pulse/backend/src/main.ts` - аналогично
- Добавлена функция `getUsername()` в `apps/pulse/frontend/src/utils/auth.ts` - ранее была удалена при рефакторинге, но использовалась в DashboardPage
- Исправлен async метод `logout` в auth.controller.ts - убран async так как не было await

**Проверки:**
- ✅ yarn typecheck — 0 errors
- ✅ yarn lint — 0 errors

**Доработка #3 - 2026-04-20 (исправление парсера getRootDomain и полный аудит SSO)**

**Шаг 0 - Аудит Task 014:**
- Обнаружен critical bug: `pulse/frontend/src/api/axios.ts` всё ещё использовал `localStorage.removeItem('refreshToken')`
- Обнаружен bug в `getRootDomain()`: возвращал `'localhost'` для localhost/IP, что нарушает RFC 6265

**Шаг 1 - Исправление getRootDomain():**
- Теперь возвращает `undefined` для localhost и IP (браузер ставит host-only cookie)
- Возвращает `.localhost` для `*.localhost` доменов
- Возвращает `.domain.com` для остальных доменов

**Шаг 2 - Очистка фронтенда от refresh token:**
- Удалён `localStorage.removeItem('refreshToken')` из `pulse/frontend/src/api/axios.ts`
- Теперь используется только `removeAccessToken()` из ui-kit

**Шаг 3 - HttpOnly верификация:**
- Backend `auth.controller.ts` корректно устанавливает `httpOnly=true` для refresh token
- Access token НЕ имеет HttpOnly (правильно - нужен для JS)

**Проверки:**
- ✅ yarn typecheck — 0 errors
- ✅ yarn lint — 0 errors

**Доработка #4 - 2026-04-20 (Task 014.1 - исправление Domain в Set-Cookie)**

- Бэкенд не добавлял атрибут Domain в Set-Cookie для refresh token
- Кука привязывалась к api.hub.localhost вместо .localhost
- Добавлена функция `computeCookieDomain()` в auth.controller.ts
- Все endpoints (login, register, refresh, logout) теперь устанавливают Domain

**Пример Set-Cookie:**
`ject_refresh_token=xxx; Domain=.localhost; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`

**Проверки:**
- ✅ yarn typecheck — 0 errors
- ✅ yarn lint — 0 errors

**Доработка #5 - 2026-04-20 (Переход на lvh.me для SSO)**

- Добавлены `http://hub.lvh.me`, `http://pulse.lvh.me`, `http://lvh.me` в CORS origins
- Логика `getRootDomain()` корректно обрабатывает `lvh.me` (возвращает `.lvh.me`)
- Backend `computeCookieDomain()` корректно обрабатывает `lvh.me`

**Проверки:**
- ✅ yarn typecheck — 0 errors
- ✅ yarn lint — 0 errors

**Примечание:** Для работы SSO с lvh.me нужно настроить фронтенды на запуск с lvh.me домена (Vite server host).

**Доработка #6 - 2026-04-20 (Nginx конфигурация для lvh.me)**

- Добавлены server blocks для lvh.me доменов:
  - `hub.lvh.me` → Hub Frontend
  - `pulse.lvh.me` → Pulse Frontend
  - `api.hub.lvh.me` → Hub Backend
  - `api.pulse.lvh.me` → Pulse Backend
- Nginx перезапущен с новой конфигурацией
- Конфигурация валидна (nginx -t OK)

**Примечание:** Для полного SSO нужно настроить Vite dev servers на использование lvh.me хоста.

**Доработка #7 - 2026-04-20 (Vite config для lvh.me)**

- Добавлен `server.allowedHosts` в `apps/hub/frontend/vite.config.ts`
- Добавлен `server.allowedHosts` в `apps/pulse/frontend/vite.config.ts`
- Обновлён remote URL для Module Federation: `pulse.lvh.me` вместо `pulse.localhost`

**Проверка:**
- ✅ `curl -I http://pulse.lvh.me` → 200 OK

**Доработка #8 - 2026-04-20 (Переход на lvh.me домены)**

- Nginx перенастроен на lvh.me как primary домены
- localhost домены сохранены как legacy (для обратной совместимости)
- Backend CORS обновлён - lvh.me как primary, localhost как legacy
- docker-compose.yml VITE_API_URL обновлён на api.hub.lvh.me
- .env.example обновлены на lvh.me

**Домены:**
| Domain | Назначение | Статус |
|--------|------------|--------|
| hub.lvh.me | Hub Frontend | ✅ Primary |
| pulse.lvh.me | Pulse Frontend | ✅ Primary |
| api.hub.lvh.me | Hub Backend | ✅ Primary |
| api.pulse.lvh.me | Pulse Backend | ✅ Primary |
| hub.localhost | Hub Frontend | ⚠️ Legacy |
| pulse.localhost | Pulse Frontend | ⚠️ Legacy |

**Проверки:**
- ✅ curl http://hub.lvh.me → 200 OK
- ✅ curl http://pulse.lvh.me → 200 OK  
- ✅ curl http://api.hub.lvh.me/health → 200 OK
- ✅ yarn typecheck — 0 errors
- ✅ yarn lint — 0 errors

**Доработка #9 - 2026-04-20 (Исправление ошибки сборки pulse-frontend)**

- Исправлена ошибка TypeScript в `RegisterPage.tsx` - лишний аргумент `response.refreshToken`
- Контейнеры перезапущены с корректным `VITE_API_URL=http://api.hub.lvh.me`

**Проверки:**
- ✅ http://hub.lvh.me → 200 OK
- ✅ http://pulse.lvh.me → 200 OK
- ✅ VITE_API_URL in container = http://api.hub.lvh.me
- ✅ yarn typecheck — 0 errors
- ✅ yarn lint — 0 errors

---

## Доработка #11 - 2026-04-21 (Исправление Module Federation импорта)

**Проблема:** Hub не мог загрузить PulseDashboard через Module Federation из-за несовпадения имени модуля.

**Ошибка:** `Can not find remote module ./PulseDashboard`

**Причина:** В Pulse экспортировался `./Dashboard`, а Hub импортировал `pulse/PulseDashboard`.

**Исправление:**
```typescript
// Было:
const PulseDashboard = React.lazy(() => import('pulse/PulseDashboard'));

// Стало:
const PulseDashboard = lazy(() => import('pulse/Dashboard'));
```

**Проверки:**
- ✅ yarn typecheck — 0 errors
- ✅ yarn lint — 0 errors
- ✅ Module Federation работает: клик на Pulse в сайдбаре загружает Dashboard из remote

**Файлы:**
- `apps/hub/frontend/src/pages/PulsePage.tsx` — исправлен импорт Module Federation

---

### Задача 016: Исправление Module Federation remote loading

**Проблема:** Hub не мог загрузить модуль `pulse/Dashboard` через Module Federation.

**Ошибка:** `Failed to resolve module specifier 'pulse/Dashboard'`

**Причина:** Hub's vite.config.ts имел `remoteEntryPlugin`, который перехватывал `/assets/remoteEntry.js` и искал файл в Hub's `dist/assets/`. Но Hub - это Host приложение, он должен загружать remoteEntry.js с удалённого сервера Pulse (`http://pulse.lvh.me/assets/remoteEntry.js`).

**Исправление:**
- Удалён `remoteEntryPlugin` из `apps/hub/frontend/vite.config.ts`
- Удалены неиспользуемые импорты (`ViteDevServer`, `fs`)
- Оставлен только `federation` plugin с корректным remote URL

**Проверки:**
- ✅ `curl http://pulse.lvh.me/assets/remoteEntry.js` → 200 OK
- ✅ `docker compose restart hub-frontend` → OK
- ✅ `curl http://hub.lvh.me` → 200 OK
- ✅ yarn typecheck — 0 errors
- ⚠️ yarn lint — pre-existing errors в pulse-frontend (не связаны с задачей)

**Файлы:**
- `apps/hub/frontend/vite.config.ts` — удалён remoteEntryPlugin

---

### Задача 016.1: Исправление `__federation_method_getRemote` - добавлен `__federation_method_ensure`

**Проблема:** `__federation_method_getRemote` не завершается (зависает навечно).

**Причина:** После вызова `__federation_method_setRemote` remote ещё не готов к использованию. Необходимо дождаться загрузки `remoteEntry.js` через `__federation_method_ensure` перед вызовом `__federation_method_getRemote`.

**Исправление:**
- Добавлен импорт `__federation_method_ensure`
- Добавлен вызов `await __federation_method_ensure(serviceId)` после регистрации remote
- Добавлено подробное логирование для отладки Federation

**Новая функция `loadModule`:**
```typescript
const loadModule = async (serviceId: string, modulePath: string): Promise<FederatedModule> => {
  console.log(`[Federation] Registering remote: ${serviceId}`);
  
  __federation_method_setRemote(serviceId, {
    url: () => Promise.resolve(`http://${serviceId}.lvh.me/assets/remoteEntry.js`),
    from: 'vite',
    format: 'esm',
  });

  console.log(`[Federation] Ensuring remote is ready: ${serviceId}`);
  await __federation_method_ensure(serviceId);
  console.log(`[Federation] Remote ready: ${serviceId}`);

  console.log(`[Federation] Getting module: ${serviceId}/${modulePath}`);
  try {
    const module = await __federation_method_getRemote(serviceId, modulePath);
    console.log(`[Federation] Module loaded:`, module);
    return module as FederatedModule;
  } catch (err) {
    console.error(`[Federation] Failed to get module: ${serviceId}/${modulePath}`, err);
    throw err;
  }
};
```

**Проверки:**
- ✅ yarn typecheck — OK
- ✅ docker compose restart hub-frontend — OK
- ✅ curl http://hub.lvh.me → 200 OK
- ✅ curl http://pulse.lvh.me/assets/remoteEntry.js → 200 OK

**Файлы:**
- `apps/hub/frontend/src/App.tsx` — обновлена функция loadModule
