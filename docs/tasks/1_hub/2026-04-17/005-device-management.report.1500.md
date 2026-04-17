# Задача 1_hub/005: Управление мастер-базой устройств (Device CRUD)

**Дата:** 2026-04-17
**Завершено:** 2026-04-17T15:00

## Резюме

Реализован полный CRUD для устройств в сервисе Hub: контракты, сущность TypeORM, API эндпоинты и UI на фронтенде.

## Внесенные изменения

### 1. Контракты (`libs/contracts/src/hub/devices`)

- Создан `index.ts` с интерфейсом `IDevice`, типами `DeviceStatus`, `CreateDeviceRequestDto`, `UpdateDeviceRequestDto`
- Обновлен `libs/contracts/src/hub/index.ts` (добавлен export для devices)

### 2. Backend (NestJS)

- Создан `Device` entity с implements `IDevice`
- Создан `DevicesModule`, `DevicesService`, `DevicesController`
- Все эндпоинты защищены `JwtAuthGuard`
- CRUD маршруты:
  - `GET /api/devices` — список устройств
  - `GET /api/devices/:id` — устройство по ID
  - `POST /api/devices` — создание
  - `PATCH /api/devices/:id` — обновление
  - `DELETE /api/devices/:id` — удаление
- Обновлен `tsconfig.json` (добавлен path для `@app/contracts/hub/devices`)

### 3. Миграция

- Сгенерирована и применена миграция `InitDevices` для таблицы `devices`
- Таблица создана со структурой: `id` (UUID), `name`, `type`, `status`, `description`, `createdAt`, `updatedAt`

### 4. Frontend

- Создан `devices.api.ts` с функциями `getDevices`, `getDevice`, `createDevice`, `updateDevice`, `deleteDevice`
- Создан `DevicesPage.tsx` с полным CRUD UI (Table, Modal, Badge, Alert)
- Добавлен роутинг `/devices` (только для авторизованных)
- Обновлен `tsconfig.json` (добавлен path для `@app/contracts/hub/devices`, `ignoreDeprecations: "6.0"`)

## Проверка

```bash
yarn typecheck  # УСПЕХ
yarn lint       # УСПЕХ (0 ошибок, 4 предупреждения)
yarn test       # УСПЕХ (build passed)
```

## Измененные файлы

**Созданные:**

- `libs/contracts/src/hub/devices/index.ts`
- `apps/hub/backend/src/devices/entities/device.entity.ts`
- `apps/hub/backend/src/devices/dto/index.ts`
- `apps/hub/backend/src/devices/devices.service.ts`
- `apps/hub/backend/src/devices/devices.controller.ts`
- `apps/hub/backend/src/devices/devices.module.ts`
- `apps/hub/backend/src/devices/index.ts`
- `apps/hub/backend/src/migrations/*InitDevices*.ts`
- `apps/hub/frontend/src/api/devices.api.ts`
- `apps/hub/frontend/src/pages/DevicesPage.tsx`

**Измененные:**

- `libs/contracts/src/hub/index.ts`
- `apps/hub/backend/src/app.module.ts`
- `apps/hub/backend/src/data-source.ts`
- `apps/hub/backend/tsconfig.json`
- `apps/hub/frontend/src/App.tsx`
- `apps/hub/frontend/tsconfig.json`

## Дополнительные работы

**Дополнительный запрос - Добавить .turbo/ в .gitignore**
Выполнено - Добавлена директория `.turbo/` в корневой `.gitignore`, выполнен `git rm -r --cached .turbo` для удаления из индекса Git

**Дополнительный запрос - Исправить запуск backend в Docker (tsconfig-paths)**
Выполнено - Добавлен флаг `-r tsconfig-paths/register` в скрипт `start:dev` в `apps/hub/backend/package.json`

**Дополнительный запрос - Исправить маршруты devices (убрать дублирование /api/api)**
Выполнено - Изменен `@Controller('api/devices')` на `@Controller('devices')` в `devices.controller.ts`, т.к. глобальный префикс `/api` уже установлен в `main.ts`
