# Отчет: Переписать Layout.tsx на статическое меню

**Дата:** 2026-04-30  
**Статус:** ✅ Выполнено

---

## Что сделано

Миграция Layout компонентов с динамической загрузки меню из `useMicroserviceManifests` на полностью статическое меню. Это часть перехода с `@originjs/vite-plugin-federation` на `@module-federation/vite`.

---

## Измененные файлы

### 1. libs/ui-kit/src/components/layout/Layout.tsx

**Было:** Использовался `useMicroserviceManifests()` для построения динамического меню из manifest.json  
**Стало:** Полностью статическое меню - все items передаются через `staticMenuItems` пропс

**Удалено:**
- Импорт `useMicroserviceManifests`
- Пропсы `excludeServices`, `hubSettingsItem`, `microservicesAccess`
- Логика фильтрации и построения динамического меню

**Оставлено:**
- `useAuth` для получения username
- Пропсы `children`, `serviceName`, `staticMenuItems`

### 2. apps/hub/frontend/src/components/layout/Layout.tsx

**Было:** Частично статическое меню (Hub devices, settings) + динамическое для микросервисов  
**Стало:** Полностью статическое меню со всеми пунктами:

```typescript
const hubMenuItems: MenuItem[] = [
  { id: 'hub-devices', label: 'Devices', icon: 'bi bi-grid', path: '/devices' },
  { id: 'hub-settings', label: 'Settings', icon: 'bi bi-gear', path: '/settings' },
  { id: 'hub-microservices', label: 'Microservices', icon: 'bi bi-sliders', path: '/microservices-settings' },
  { id: 'pulse-parent', label: 'Pulse', icon: 'bi bi-heartbeat', children: [...] },
  { id: 'service-parent', label: 'Service', icon: 'bi bi-wrench', children: [...] },
  { id: 'control-parent', label: 'Control', icon: 'bi bi-gear-wide-connected', children: [...] },
];
```

**Удалено:**
- `useAuth` импорт (не используется)
- `microservicesAccess` пропсы
- `excludeServices` пропсы

### 3. apps/pulse/frontend/src/components/layout/Layout.tsx

**Было:** Динамическое меню с проверкой `isPulseLocked`, `hubSettingsItem`, `excludeServices`  
**Стало:** Простое статическое меню:

```typescript
const pulseMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi bi-house', path: '/dashboard' },
  { id: 'devices', label: 'Devices', icon: 'bi bi-grid', path: '/devices' },
  { id: 'metrics', label: 'Metrics', icon: 'bi bi-graph-up', path: '/metrics' },
  { id: 'alerts', label: 'Alerts', icon: 'bi bi-bell', path: '/alerts' },
  { id: 'hub-settings', label: 'Hub Settings', icon: 'bi bi-gear', path: '/hub/settings' },
];
```

**Удалено:**
- `useAuth` импорт
- `lockedMenuItem` и логика блокировки
- `microservicesAccess`, `isPulseLocked`, `excludeServices`, `hubSettingsItem`

### 4. apps/service/frontend/src/components/layout/Layout.tsx

**Было:** Динамическое меню с проверкой `isServiceLocked`  
**Стало:** Простое статическое меню:

```typescript
const serviceMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi bi-house', path: '/dashboard' },
  { id: 'devices', label: 'Devices', icon: 'bi bi-grid', path: '/devices' },
  { id: 'settings', label: 'Settings', icon: 'bi bi-gear', path: '/settings' },
  { id: 'hub-settings', label: 'Hub Settings', icon: 'bi bi-gear', path: '/hub/settings' },
];
```

### 5. apps/control/frontend/src/components/layout/Layout.tsx

**Было:** Динамическое меню с проверкой `isControlLocked`  
**Стало:** Простое статическое меню:

```typescript
const controlMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi bi-house', path: '/dashboard' },
  { id: 'devices', label: 'Devices', icon: 'bi bi-grid', path: '/devices' },
  { id: 'settings', label: 'Settings', icon: 'bi bi-gear', path: '/settings' },
  { id: 'hub-settings', label: 'Hub Settings', icon: 'bi bi-gear', path: '/hub/settings' },
];
```

---

## Проверки

### Самопроверка (все прошли ✅)

| Проверка | Результат |
|----------|-----------|
| `grep "useMicroserviceManifests" libs/ui-kit/src/components/layout/Layout.tsx` | Не найден ✅ |
| `grep "microservicesAccess" apps/*/frontend/src/components/layout/Layout.tsx` | Не найден ✅ |
| `grep "excludeServices" apps/*/frontend/src/components/layout/Layout.tsx` | Не найден ✅ |
| `grep "hubSettingsItem" apps/*/frontend/src/components/layout/Layout.tsx` | Не найден ✅ |

### Автоматические проверки

| Команда | Результат |
|---------|-----------|
| `yarn typecheck` | ✅ 5 successful |
| `yarn lint` (frontends) | ✅ 0 errors |

**Примечание:** Pre-existing ошибка в `hub-backend/src/auth/auth.service.ts:73` (console.log) не связана с данными изменениями.

---

## Технические детали

### Архитектурное решение

Раньше меню строилось динамически на основе `manifest.json` от каждого микросервиса. Это требовало:
- Загрузки manifest.json при старте приложения
- Хуков `useMicroserviceManifests` для управления состоянием загрузки
- Логики обработки блокировок микросервисов

Теперь меню полностью статическое:
- Все пункты меню определены в коде
- Hub передает статическое меню с дочерними элементами для Pulse, Service, Control
- Каждый микросервис знает только свои маршруты

### Структура меню Hub

```
├── Devices (/devices)
├── Settings (/settings)
├── Microservices (/microservices-settings)
├── Pulse (parent)
│   ├── Dashboard (/pulse/dashboard)
│   ├── Devices (/pulse/devices)
│   ├── Metrics (/pulse/metrics)
│   ├── Alerts (/pulse/alerts)
│   └── Settings (/pulse/settings)
├── Service (parent)
│   ├── Dashboard (/service/dashboard)
│   ├── Devices (/service/devices)
│   └── Settings (/service/settings)
└── Control (parent)
    ├── Dashboard (/control/dashboard)
    ├── Devices (/control/devices)
    └── Settings (/control/settings)
```

---

## Файлы

- `libs/ui-kit/src/components/layout/Layout.tsx`
- `apps/hub/frontend/src/components/layout/Layout.tsx`
- `apps/pulse/frontend/src/components/layout/Layout.tsx`
- `apps/service/frontend/src/components/layout/Layout.tsx`
- `apps/control/frontend/src/components/layout/Layout.tsx`

---

## Следующий шаг

Обновить тест `Layout.spec.tsx` в ui-kit, так как он все еще мокает `useMicroserviceManifests`. Тесты нужно адаптировать для статического меню или удалить как устаревшие.
