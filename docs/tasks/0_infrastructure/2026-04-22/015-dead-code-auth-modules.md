# 015: Удаление мёртвого кода — Auth модули в Pulse/Service Backend

## Цель

Удалить неиспользуемые Auth модули из Pulse и Service бэкендов, так как `/me` эндпоинт не вызывается фронтендом.

## Задачи

### 1. Анализ

**Найдено:**
- `AuthModule`, `JwtStrategy`, `JwtAuthGuard` в обоих бэкендах
- `/me` endpoint защищён JWT, но **не используется** фронтендом
- `HubProxyModule` (`/devices`) не использует JWT валидацию на уровне BFF — полагается на Hub

**Вывод:**
Auth модуль — артефакт копирования из Hub. Не нужен для текущей BFF архитектуры.

### 2. Удаление

**Pulse Backend:**
- [ ] Удалён `src/auth/` (auth.module.ts, guards/, strategies/)
- [ ] Обновлён `app.controller.ts` — убран `/me` endpoint
- [ ] Обновлён `app.module.ts` — убран AuthModule import

**Service Backend:**
- [ ] Удалён `src/auth/` (auth.module.ts, guards/, strategies/)
- [ ] Обновлён `app.controller.ts` — убран `/me` endpoint
- [ ] Обновлён `app.module.ts` — убран AuthModule import

### 3. Проверки

- [ ] `yarn typecheck` — OK
- [ ] `yarn lint` — OK
- [ ] `curl http://api.pulse.lvh.me/api/pulse/health` → 200 OK
- [ ] `curl http://api.service.lvh.me/api/service/health` → 200 OK

## Файлы

| Действие | Файл |
|---------|------|
| Удалено | `apps/pulse/backend/src/auth/` |
| Удалено | `apps/service/backend/src/auth/` |
| Изменено | `apps/pulse/backend/src/app.controller.ts` |
| Изменено | `apps/pulse/backend/src/app.module.ts` |
| Изменено | `apps/service/backend/src/app.controller.ts` |
| Изменено | `apps/service/backend/src/app.module.ts` |

## Примечание

HubProxyModule остаётся — он проксирует `/devices` запросы в Hub. Hub валидирует JWT на своей стороне.
