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

Создать `libs/ui-kit/src/federation/` с:
- `useDynamicRoutesConfig.ts` — хук для создания динамических маршрутов
- `LazyModule.tsx` — компонент для lazy-загрузки модулей
- `loadModule.ts` — функция для загрузки через Federation API

### 2. Обновить Hub

Заменить локальную реализацию на импорт из `@app/ui-kit/federation`.

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
libs/ui-kit/src/federation/
├── index.ts                    # Экспорты
├── loadModule.ts               # loadModule()
├── LazyModule.tsx             # LazyModule component
└── useDynamicRoutesConfig.ts   # useDynamicRoutesConfig hook

apps/hub/frontend/src/App.tsx  # Импортирует из @app/ui-kit/federation
apps/pulse/frontend/src/App.tsx # Импортирует из @app/ui-kit/federation
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
| Создать | `libs/ui-kit/src/federation/loadModule.ts` |
| Создать | `libs/ui-kit/src/federation/LazyModule.tsx` |
| Создать | `libs/ui-kit/src/federation/useDynamicRoutesConfig.ts` |
| Создать | `libs/ui-kit/src/federation/index.ts` |
| Изменить | `libs/ui-kit/src/index.ts` (экспорт federation) |
| Изменить | `apps/hub/frontend/src/App.tsx` |
| Изменить | `apps/pulse/frontend/src/App.tsx` |

## Тикет

006
