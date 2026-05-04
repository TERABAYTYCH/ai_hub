# Отчёт: Исправление HMR WebSocket конфигурации для Module Federation в Docker

## Статус
✅ Завершено

## Задача
Исправить HMR WebSocket конфигурацию для Module Federation в Docker environment.

## Проблемы
1. WebSocket соединение для HMR не работало между Host и Remote
2. `dev` опция отсутствовала в Hub
3. Hub указывал на remoteEntry.js без порта (`http://pulse.lvh.me/remoteEntry.js`)

## Изменённые файлы

### 1. `apps/hub/frontend/vite.config.ts`
**Изменения:**
- Добавлена `dev` опция с `remoteHmr: true` и `disableDynamicRemoteTypeHints: true`
- Исправлены remote URLs на внутренние Docker имена с портами:
  - `pulse`: `http://pulse-frontend:5174/remoteEntry.js`
  - `service`: `http://service-frontend:5175/remoteEntry.js`
  - `control`: `http://control-frontend:5176/remoteEntry.js`

### 2. `apps/pulse/frontend/vite.config.ts`
**Изменения:**
- Добавлена `dev` опция с `remoteHmr: true` и `disableDynamicRemoteTypeHints: true`

### 3. `apps/service/frontend/vite.config.ts`
**Изменения:**
- Добавлена `dev` опция с `remoteHmr: true` и `disableDynamicRemoteTypeHints: true`

### 4. `apps/control/frontend/vite.config.ts`
**Изменения:**
- Добавлена `dev` опция с `remoteHmr: true` и `disableDynamicRemoteTypeHints: true`

## Конфигурация Docker сети
- **Hub** использует ВНУТРЕННИЕ Docker DNS имена для remote URLs (`pulse-frontend`, `service-frontend`, `control-frontend`)
- **Remote apps** используют ВНЕШНИЕ домены с портами для `server.origin`
- Docker сеть позволяет hub-frontend обращаться к другим frontend-сервисам по внутреннему DNS

## Проверки
| Проверка | Результат |
|----------|-----------|
| `yarn typecheck` | ✅ Успешно |
| `yarn build` | ✅ Успешно (9 tasks) |

## Архитектурное обоснование
Опция `dev.remoteHmr: true` включает горячую замену модулей для удалённых (remote) микрофронтендов. Это позволяет Module Federation корректно устанавливать WebSocket соединение для live-reload между Host (Hub) и Remote (pulse, service, control) приложениями во время разработки в Docker environment.
