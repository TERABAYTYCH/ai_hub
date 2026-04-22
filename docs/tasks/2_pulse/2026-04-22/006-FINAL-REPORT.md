# Отчёт: Тикет 006 - Pulse добавить Service и Hub в навигацию ✅

**Дата:** 2026-04-22  
**Исполнитель:** AI + пользователь  
**Статус:** ✅ Завершён и работает

---

## Цель

Добавить Service и Hub в навигацию Pulse через динамическую загрузку меню из manifest.json.

---

## Выполненные подзадачи

| Подзадача | Статус | Описание |
|-----------|--------|---------|
| 006.1 | ✅ | Hub → Federation host + manifest |
| 006.2 | ✅ | ui-kit → REGISTERED_SERVICES добавить hub |
| 006.3 | ✅ | ui-kit → Layout excludeServices |
| 006.4 | ✅ | ui-kit → Layout hubSettingsItem |
| 006.5 | ✅ | Hub → Layout с excludeServices |
| 006.6 | ✅ | Pulse → Layout с Hub Settings |
| 006.7 | ✅ | Pulse/Service → App.tsx с динамическими routes |

---

## Реализованная функциональность

### Hub (Federation Host)
- Hub отдаёт `remoteEntry.js` с `./Settings`
- Hub отдаёт `manifest.json` с навигацией

### ui-kit/Layout
- `excludeServices?: string[]` — фильтрует сервисы из меню
- `hubSettingsItem?: MenuItem` — добавляет Hub Settings в конец меню
- При передаче `hubSettingsItem`, Hub авто-исключается из serviceMenuItems

### REGISTERED_SERVICES
```typescript
export const REGISTERED_SERVICES = [
  { serviceId: 'hub', manifestUrl: 'http://hub.lvh.me/assets/manifest.json' },
  { serviceId: 'pulse', manifestUrl: 'http://pulse.lvh.me/assets/manifest.json' },
  { serviceId: 'service', manifestUrl: 'http://service.lvh.me/assets/manifest.json' },
] as const;
```

### Hub Layout
- `excludeServices={['hub']}` — Hub не показывает себя
- Hub Settings → `/settings` (native route)

### Pulse Layout
- `excludeServices={['pulse']}` — Pulse не показывает себя
- Hub Settings в конце меню

### Service Layout
- `excludeServices={['service']}` — Service не показывает себя
- Hub Settings в конце меню

### App.tsx (Pulse & Service)
- Динамическая загрузка routes из manifests
- `loadModule`, `LazyModule`, `useDynamicRoutesConfig` — скопированы из Hub
- `/hub/settings` загружает Hub Settings
- `/service/*` загружает Service модули

---

## Суммарные проверки

| Проверка | Результат |
|----------|-----------|
| Hub отдаёт remoteEntry.js с ./Settings | ✅ |
| Hub отдаёт manifest.json | ✅ |
| REGISTERED_SERVICES содержит hub, pulse, service | ✅ |
| Hub показывает: Pulse, Service (excludeServices: ['hub']) | ✅ |
| Pulse показывает: Hub Settings, Service (excludeServices: ['pulse']) | ✅ |
| Service показывает: Hub Settings, Pulse (excludeServices: ['service']) | ✅ |
| `/hub/settings` загружает hub/Settings | ✅ |
| `yarn typecheck` — OK | ✅ |
| `yarn test` — OK (24 passed) | ✅ |

---

## Файлы изменены

### Hub
- `apps/hub/frontend/vite.config.ts` — Federation host + manifest
- `apps/hub/frontend/src/App.tsx` — динамические routes
- `apps/hub/frontend/src/components/layout/Layout.tsx` — excludeServices

### ui-kit
- `libs/ui-kit/src/hooks/useMicroserviceManifests.ts` — REGISTERED_SERVICES
- `libs/ui-kit/src/components/layout/Layout.tsx` — excludeServices, hubSettingsItem
- `libs/ui-kit/src/components/layout/Layout.spec.tsx` — тесты
- `libs/ui-kit/jest.config.js` — moduleNameMapper

### Pulse
- `apps/pulse/frontend/src/App.tsx` — динамические routes
- `apps/pulse/frontend/src/main.tsx`
- `apps/pulse/frontend/src/components/layout/Layout.tsx`
- `apps/pulse/frontend/src/vite-env.d.ts`
- `apps/pulse/frontend/src/federation.d.ts`

### Service
- `apps/service/frontend/src/App.tsx` — динамические routes
- `apps/service/frontend/src/main.tsx`
- `apps/service/frontend/src/components/layout/Layout.tsx`
- `apps/service/frontend/src/vite-env.d.ts`
- `apps/service/frontend/src/federation.d.ts`

---

## Затраченное время

~2 часа (включая итерации и исправления)

---

## Примечание

Lint errors в Hub App.tsx (console statements, any types) — pre-existing, не исправлены.
