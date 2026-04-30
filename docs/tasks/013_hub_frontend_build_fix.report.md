# Отчёт о выполнении задачи: Исправление ошибок сборки hub-frontend

## Проблема

При сборке `hub-frontend` возникали ошибки TypeScript:

```
src/App.tsx(2,8): error TS6133: 'React' is declared but its value is never read.
src/App.tsx(2,17): error TS2305: Module '"react"' has no exported member 'defineAsyncComponent'.
```

## Анализ

1. `defineAsyncComponent` — это **метод объекта `React`** (`React.defineAsyncComponent`), а **не именованный экспорт** из 'react'. Код ошибочно пытался импортировать его как named export.
2. Импорт `React` был не нужен — JSX не требует явного импорта React в современных версиях React 17+.

## Решение

Заменён `defineAsyncComponent` на стандартный React API `lazy` для ленивой загрузки компонентов:

**Было:**
```tsx
import React, { defineAsyncComponent } from 'react';
const PulseDashboard = defineAsyncComponent(() => import('pulse/Dashboard'));
```

**Стало:**
```tsx
import { lazy } from 'react';
const PulseDashboard = lazy(() => import('pulse/Dashboard'));
```

## Изменённые файлы

- `apps/hub/frontend/src/App.tsx`

## Проверка

- ✅ `yarn workspace @ject-hub/hub-frontend lint` — успешно
- ✅ `yarn workspace @ject-hub/hub-frontend build` — успешно (627 modules, build time 2.40s)

## Дополнительно

- Удалены неиспользуемые `eslint-disable` директивы, которые были нужны для `defineAsyncComponent` но не требуются для `lazy`.
