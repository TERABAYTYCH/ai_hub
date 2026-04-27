# 015: Удаление мёртвого кода — Auth модули в Pulse/Service Backend — Отчёт

**Дата:** 2026-04-22  
**Статус:** Выполнено

---

## Что сделано

Удалены неиспользуемые Auth модули из Pulse и Service бэкендов.

### Причина

Auth модуль был артефактом копирования из Hub. `/me` endpoint не вызывался фронтендом.

### Удалённые файлы

| Файл | Описание |
|------|----------|
| `apps/pulse/backend/src/auth/auth.module.ts` | AuthModule |
| `apps/pulse/backend/src/auth/guards/jwt-auth.guard.ts` | JwtAuthGuard |
| `apps/pulse/backend/src/auth/strategies/jwt.strategy.ts` | JwtStrategy |
| `apps/service/backend/src/auth/auth.module.ts` | AuthModule |
| `apps/service/backend/src/auth/guards/jwt-auth.guard.ts` | JwtAuthGuard |
| `apps/service/backend/src/auth/strategies/jwt.strategy.ts` | JwtStrategy |

### Изменённые файлы

| Файл | Изменение |
|------|-----------|
| `apps/pulse/backend/src/app.controller.ts` | Убран `/me` endpoint, импорт JwtAuthGuard |
| `apps/pulse/backend/src/app.module.ts` | Убран AuthModule import |
| `apps/service/backend/src/app.controller.ts` | Убран `/me` endpoint, импорт JwtAuthGuard |
| `apps/service/backend/src/app.module.ts` | Убран AuthModule import |

---

## Проверки

- [x] `yarn typecheck` — 4 successful
- [x] `yarn workspace @ject-hub/pulse-backend lint` — OK
- [x] `yarn workspace @ject-hub/service-backend lint` — OK

---

## Файлы

| Действие | Файл |
|---------|------|
| Удалено | `apps/pulse/backend/src/auth/` |
| Удалено | `apps/service/backend/src/auth/` |
| Изменено | `apps/pulse/backend/src/app.controller.ts` |
| Изменено | `apps/pulse/backend/src/app.module.ts` |
| Изменено | `apps/service/backend/src/app.controller.ts` |
| Изменено | `apps/service/backend/src/app.module.ts` |

---

## Тикет

015
