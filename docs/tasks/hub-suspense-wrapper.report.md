# Отчёт: Добавить Suspense wrapper в Hub App.tsx

**Дата:** 2026-04-30  
**Статус:** ✅ Завершено

---

## Описание задачи

React Router встречает lazy() компонент, который ещё не загружен. Требовалось обернуть routeElements в Suspense для корректной обработки асинхронной загрузки модулей (Module Federation).

---

## Изменённые файлы

### `apps/hub/frontend/src/App.tsx`

**Изменение 1 — Импорт:**
```tsx
// Было:
import { lazy } from 'react';

// Стало:
import { lazy, Suspense } from 'react';
```

**Изменение 2 — Return statement:**
```tsx
// Было:
const routeElements = useRoutes(staticRoutes);
return routeElements;

// Стало:
const routeElements = useRoutes(staticRoutes);

return (
  <Suspense fallback={
    <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  }>
    {routeElements}
  </Suspense>
);
```

---

## Верификация

| Команда | Результат |
|---------|-----------|
| `yarn typecheck` | ✅ Успешно (cache hit) |
| `yarn build` | ✅ Успешно (hub-frontend built in 3.11s) |

---

## Техническое обоснование

Suspense необходим для корректной работы `lazy()` с динамическими импортами remote-модулей (Module Federation). Без него React Router получает unresolved Promise вместо компонента, что приводит к ошибке.

Fallback использует Bootstrap-классы (`d-flex`, `spinner-border`) для визуально согласованного с приложением loading-состояния.

---

## Доработки

*Нет*
