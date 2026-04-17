# Task 1_hub/005: Управление мастер-базой устройств (Device CRUD)

## 🎯 Цель

Создать сущность `Device` в сервисе Hub, реализовать CRUD-операции на бэкенде (с защитой через JWT) и сделать страницу управления устройствами на фронтенде с использованием React Bootstrap.

## 🧭 Контекст

Сервис Hub является центральным узлом (Source of Truth) для всей платформы. Микросервисы Pulse (мониторинг), Service (обслуживание) и Control (управление) будут работать с одними и теми же устройствами. Поэтому именно в Hub мы создаем мастер-базу устройств. В будущем при создании нового устройства Hub будет отправлять событие в Kafka, чтобы другие сервисы узнали о нем, но пока нам нужен базовый REST API и UI.

## 📋 Задачи для выполнения

### 1. Общие контракты (`libs/contracts/src/hub/devices`)

- Создать директорию `devices` в контрактах Hub.
- Описать интерфейс `IDevice`:
  - `id` (string/uuid)
  - `name` (string)
  - `type` (string)
  - `status` ('ACTIVE' | 'INACTIVE' | 'MAINTENANCE')
  - `description` (string, optional)
  - `createdAt` (Date | string)
  - `updatedAt` (Date | string)
- Описать DTO:
  - `CreateDeviceRequestDto` (поля: `name`, `type`, `description`).
  - `UpdateDeviceRequestDto` (частичное обновление).
- Экспортировать их через `index.ts`.

### 2. Backend (NestJS - `apps/hub/backend`)

- Создать сущность TypeORM `Device`.
  - **ВАЖНО:** Класс `Device` должен строго реализовывать интерфейс: `export class Device implements IDevice { ... }`.
  - Поля: `id` (UUID, primary), `name` (varchar), `type` (varchar), `status` (enum/varchar - по умолчанию 'ACTIVE'), `description` (text, nullable), `createdAt`, `updatedAt`.
- Сгенерировать и применить миграцию для создания таблицы `devices` (не использовать `synchronize: true`).
- Создать `DeviceModule`, `DeviceService`, `DeviceController`.
- Реализовать эндпоинты (все защищены `JwtAuthGuard`):
  - `GET /api/devices` — список всех устройств.
  - `GET /api/devices/:id` — устройство по ID.
  - `POST /api/devices` — создание нового устройства.
  - `PATCH /api/devices/:id` — обновление устройства.
  - `DELETE /api/devices/:id` — удаление устройства.

### 3. Frontend (React - `apps/hub/frontend`)

- Создать сервис `devices.api.ts` для взаимодействия с API (передавать JWT токен в заголовке `Authorization: Bearer ...`). Использовать типы из `@app/contracts`.
- Создать страницу `DevicesPage.tsx`.
- Использовать компоненты `react-bootstrap` (Table, Card, Badge, Button).
- Реализовать отображение списка устройств.
- Добавить кнопку "Добавить устройство" (открывает Modal с формой).
- Добавить страницу в роутинг (`/devices`) и ссылку в Navbar (только для авторизованных).

## 🛠 Требования и ограничения

- **Strict Mode:** TypeScript в строгом режиме, без `any`.
- **Авторизация:** Ни один эндпоинт устройств не должен быть доступен без валидного JWT токена.

## 🏁 Критерии приемки (DoD)

1. Миграция для таблицы `devices` успешно создана и применена.
2. CRUD API для устройств работает и требует авторизации.
3. Сущность `Device` строго имплементирует `IDevice`.
4. На фронтенде авторизованный пользователь может зайти на `/devices` и управлять устройствами.
5. Написан отчет в формате `005-device-management.report.[HHMM].md` (в правильной папке по дате) на русском языке.
