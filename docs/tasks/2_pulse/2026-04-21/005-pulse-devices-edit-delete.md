# Задача 005: Edit и Delete логика на странице Devices в Pulse

## Цель

Добавить функциональность редактирования и удаления устройств на странице Devices в сервисе Pulse.

## Реализация

### 1. Создан файл `apps/pulse/frontend/src/api/devices.api.ts`

Добавлены функции для работы с API:
- `getDevices()` - получение списка устройств
- `updateDevice(id, data)` - обновление устройства (PATCH)
- `deleteDevice(id)` - удаление устройства (DELETE)

### 2. Обновлён `apps/pulse/frontend/src/pages/DevicesPage.tsx`

- Добавлено модальное окно для редактирования устройства
- Функция `handleOpenEditModal(device)` - открывает modal с данными устройства
- Функция `handleSubmitEdit()` - отправляет PATCH запрос
- Функция `handleDelete(id)` - удаляет устройство с подтверждением
- `DeviceTable` теперь получает реальные обработчики вместо пустых функций

### API Endpoints (Hub Backend)

- `PATCH /devices/:id` - обновление устройства
- `DELETE /devices/:id` - удаление устройства

## Файлы

- `apps/pulse/frontend/src/api/devices.api.ts` - новый файл
- `apps/pulse/frontend/src/pages/DevicesPage.tsx` - обновлён

## Проверки

- ✅ yarn typecheck - OK
- ✅ yarn lint (pulse-frontend) - OK (pre-existing errors в vite-plugin-manifest.ts не связаны с задачей)
