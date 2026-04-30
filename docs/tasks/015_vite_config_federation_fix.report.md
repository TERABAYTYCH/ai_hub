# Отчёт: Исправление vite.config.ts - убрать неправильный server из federation

## Статус
✅ Завершено

## Дата
2026-04-30

## Задача
Исправить TypeScript-ошибки в конфигурации Module Federation, убрав некорректную опцию `server` из `federation()`.

## Изменённые файлы

### apps/hub/frontend/vite.config.ts
**Изменения:**
- Обновлены remotes с docker-имен (`pulse-frontend`, `service-frontend`, `control-frontend`) на `lvh.me` хосты (`pulse.lvh.me`, `service.lvh.me`, `control.lvh.me`)
- `dev: { remoteHmr: true, disableDynamicRemoteTypeHints: true }` уже присутствовал

### apps/pulse/frontend/vite.config.ts
**Изменения:**
- УБРАН `server: { origin: 'http://pulse.lvh.me:5174' }` из `federation()`
- `dev: { remoteHmr: true, disableDynamicRemoteTypeHints: true }` уже присутствовал

### apps/service/frontend/vite.config.ts
**Изменения:**
- УБРАН `server: { origin: 'http://service.lvh.me:5175' }` из `federation()`

### apps/control/frontend/vite.config.ts
**Изменения:**
- УБРАН `server: { origin: 'http://control.lvh.me:5176' }` из `federation()`

## Ключевые изменения

1. **УДАЛЕНО** `server` из `federation()` — эта опция не поддерживается TypeScript и не является частью API Module Federation
2. **Сохранено** `dev: { remoteHmr: true, disableDynamicRemoteTypeHints: true }` внутри `federation()` для корректной работы HMR в разработке
3. **Сохранено** `server` на верхнем уровне `defineConfig` — это валидная опция Vite

## Проверки

| Проверка | Результат |
|----------|-----------|
| `yarn typecheck` | ✅ Успешно (5 tasks, 5 cached) |
| `yarn build` | ✅ Успешно (9 tasks, 9 total) |

## Архитектурное пояснение

`server` внутри `federation()` — это ошибка конфигурации. Module Federation плагин для Vite не принимает `server` в качестве опции. `server` — это опция самого Vite, а не Module Federation. Правильная конфигурация:

```typescript
// ✅ Внутри federation() — только dev для HMR
federation({
  dev: { remoteHmr: true, disableDynamicRemoteTypeHints: true },
  // ...
})

// ✅ На верхнем уровне defineConfig — server для Vite
defineConfig({
  server: { host: '0.0.0.0', port: 5173 },
  // ...
})
```
