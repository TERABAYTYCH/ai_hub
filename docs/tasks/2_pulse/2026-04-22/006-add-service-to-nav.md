# 006: Pulse — Добавить Service в навигацию

## Цель

Добавить Service микросервис в навигацию Pulse, используя Module Federation (как в Hub).

## Как работает Hub

**App.tsx:**
1. `useMicroserviceManifests()` — загружает manifests из всех сервисов
2. `useDynamicRoutesConfig()` — создаёт маршруты динамически на основе manifests
3. `LazyModule` — загружает модули через Federation v2 API

**Layout (ui-kit):**
1. Получает `manifests` через `useMicroserviceManifests()`
2. Строит serviceMenuItems из manifests
3. Комбинирует с hubMenuItems

## Задачи

### 1. Создать общую логику Federation

Создать `libs/federation/src/` (НЕ в ui-kit) с:
- `loadModule.ts` — функция для загрузки через Federation API
- `LazyModule.tsx` — компонент для lazy-загрузки модулей
- `useDynamicRoutesConfig.ts` — хук для создания динамических маршрутов
- `index.ts` — экспорты

### 2. Обновить Hub

Заменить локальную реализацию на импорт из `@app/federation`.

### 3. Обновить Pulse

Добавить аналогичную логику Federation для Service.

### 4. Проверки

- [ ] Hub работает как прежде (Module Federation с Pulse)
- [ ] Pulse загружает Service через Module Federation
- [ ] Pulse Sidebar показывает Service подменю (Dashboard, Devices, Settings)
- [ ] Клик на Service Dashboard → /service/dashboard (внутренний роут)
- [ ] yarn typecheck — OK
- [ ] yarn lint — OK

## Структура после изменений

```
libs/federation/
├── src/
│   ├── index.ts
│   ├── loadModule.ts
│   ├── LazyModule.tsx
│   └── useDynamicRoutesConfig.ts
└── package.json

apps/hub/frontend/src/App.tsx    # Импортирует из @app/federation
apps/pulse/frontend/src/App.tsx   # Импортирует из @app/federation
```

## Меню в Pulse после изменений

```
- Dashboard
- Devices
- Metrics
- Alerts
- Settings
- Service (submenu) ← из manifest
  - Dashboard
  - Devices
  - Settings
- Hub Settings ← hubMenuItems
```

## Файлы

| Действие | Файл |
|---------|------|
| Создать | `libs/federation/src/loadModule.ts` |
| Создать | `libs/federation/src/LazyModule.tsx` |
| Создать | `libs/federation/src/useDynamicRoutesConfig.ts` |
| Создать | `libs/federation/src/index.ts` |
| Создать | `libs/federation/package.json` |
| Изменить | `apps/hub/frontend/src/App.tsx` |
| Изменить | `apps/pulse/frontend/src/App.tsx` |

## Тикет

006

## Environment

<environment_details>
Current time: 2026-04-22T18:50:12+03:00
</environment_details>
