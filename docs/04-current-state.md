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
