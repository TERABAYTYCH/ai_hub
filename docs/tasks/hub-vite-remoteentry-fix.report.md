# Отчёт: Исправление пути к remoteEntry.js в Hub vite.config.ts

## Задача
Исправить путь к remoteEntry.js в Hub vite.config.ts - убрать `/assets/` из всех entry URL.

## Изменённые файлы

**`apps/hub/frontend/vite.config.ts`**
- Убран `/assets/` из путей remote entry для всех микрофронтендов

### Было (строки 19, 26, 33):
```typescript
entry: 'http://pulse.lvh.me/assets/remoteEntry.js',
entry: 'http://service.lvh.me/assets/remoteEntry.js',
entry: 'http://control.lvh.me/assets/remoteEntry.js',
```

### Стало:
```typescript
entry: 'http://pulse.lvh.me/remoteEntry.js',
entry: 'http://service.lvh.me/remoteEntry.js',
entry: 'http://control.lvh.me/remoteEntry.js',
```

## Верификация

| Проверка | Результат |
|----------|-----------|
| `yarn typecheck` | ✅ Успешно (5 tasks, 5 cached) |
| `yarn build` | ✅ Успешно (9 tasks, 8 cached, 1 hub-frontend cache miss) |

## Доработки

**Доработка #1 - 2026-04-30**
- Исправлен hub vite.config.ts - убраны `/assets/` из всех remote entry URL
