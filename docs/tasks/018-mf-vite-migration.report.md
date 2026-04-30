# Миграция на @module-federation/vite с поддержкой HMR

## Дата: 2026-04-30

## Цель
Получить полноценный HMR на обеих сторонах (Host + Remote) для всех микрофронтендов.

## Что сделано

### 1. Установка @module-federation/vite
- Заменён `@originjs/vite-plugin-federation` на `@module-federation/vite@^1.0.0` во всех package.json
- Установлена версия 1.15.1

### 2. Обновление vite.config.ts для Remote apps (pulse, service, control)
- Изменён импорт на `import { federation } from '@module-federation/vite'`
- Удалены `manifestPlugin` и `serveDistAssetsPlugin`
- Добавлен `server.origin` для dev режима

### 3. Обновление vite.config.ts для Host (hub)
- Изменён импорт на `import { federation } from '@module-federation/vite'`
- Изменён remotes на объектный формат с type: 'module'
- Удалены `manifestPlugin` и `serveDistAssetsPlugin`

### 4. Переписа App.tsx на статические маршруты
- Hub: заменена динамическая загрузка через `__federation_method_*` на `lazy()` из react
- Pulse, Service, Control: удалена динамическая загрузка, оставлены статические маршруты
- Удалены `useMicroserviceManifests`, `loadModule`, `LazyModule`

### 5. Переписа Layout.tsx - статическое меню
- ui-kit Layout: удалён `useMicroserviceManifests`, меню теперь принимается через пропсы
- Hub Layout: статическое меню со всеми сервисами (Hub, Pulse, Service, Control)
- Pulse, Service, Control Layout: упрощены до статических меню

### 6. Удаление неиспользуемых плагинов
- Удалён `libs/plugins/src/serveDistAssetsPlugin.ts`
- Удалён `libs/plugins/src/manifestPlugin.ts`
- Удалены `libs/ui-kit/src/hooks/useMicroserviceManifests.ts` и spec файл
- Обновлены индексы экспортов

### 7. Проверка ограничений @module-federation/vite
- Нет запрещённых настроек (codeSplitting, manualChunks)
- build.target: esnext во всех приложениях

## Файлы изменены

### package.json (5 файлов)
- package.json (root)
- apps/hub/frontend/package.json
- apps/pulse/frontend/package.json
- apps/service/frontend/package.json
- apps/control/frontend/package.json

### vite.config.ts (4 файла)
- apps/hub/frontend/vite.config.ts
- apps/pulse/frontend/vite.config.ts
- apps/service/frontend/vite.config.ts
- apps/control/frontend/vite.config.ts

### App.tsx (4 файла)
- apps/hub/frontend/src/App.tsx
- apps/pulse/frontend/src/App.tsx
- apps/service/frontend/src/App.tsx
- apps/control/frontend/src/App.tsx

### Layout.tsx (5 файлов)
- libs/ui-kit/src/components/layout/Layout.tsx
- apps/hub/frontend/src/components/layout/Layout.tsx
- apps/pulse/frontend/src/components/layout/Layout.tsx
- apps/service/frontend/src/components/layout/Layout.tsx
- apps/control/frontend/src/components/layout/Layout.tsx

### Удалены
- libs/plugins/src/serveDistAssetsPlugin.ts
- libs/plugins/src/manifestPlugin.ts
- libs/plugins/dist/ (вся директория)
- libs/ui-kit/src/hooks/useMicroserviceManifests.ts
- libs/ui-kit/src/hooks/useMicroserviceManifests.spec.ts

## Проверки

- `yarn typecheck` ✅ 5 successful
- `yarn build` ✅ 9 successful
- `yarn lint` ⚠️ 1 pre-existing error (hub-backend console.log, не связано с миграцией)

## Примечание
Lint error в hub-backend/src/auth/auth.service.ts:73 (`console.log`) существовала до миграции и не связана с изменениями.
