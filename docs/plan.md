# План: Вынесение Layout в ui-kit и универсальная навигация

## Цель

Вынести Layout из Hub в ui-kit, чтобы Pulse и Service могли отображать Hub Settings и другие сервисы в сайдбаре.

## Задачи

### Тикет 017.1: Hub → ui-kit — Layout

**Изменить:**

1. Скопировать `apps/hub/frontend/src/components/layout/Layout.tsx` в `libs/ui-kit/src/components/layout/`
2. Адаптировать Layout для универсального использования

**Проверки:**

- [ ] Layout экспортируется из ui-kit
- [ ] Hub продолжает работать как прежде

---

### Тикет 017.2: Hub — Hub использует Layout из ui-kit

**Изменить:**

1. `apps/hub/frontend/src/components/layout/Layout.tsx` → импортировать из ui-kit
2. Удалить дублирующий код

**Проверки:**

- [ ] Hub Sidebar работает как прежде
- [ ] Hub Settings отображается

---

### Тикет 006: Pulse — Добавить Service в навигацию

**Изменить:**

1. `apps/pulse/frontend/src/components/layout/Layout.tsx` → создать на основе ui-kit Layout
2. Меню:
   - Hub Settings (в конце списка)
   - Service (Dashboard, Devices, Settings) — из manifest

**REGISTERED_SERVICES в Pulse:**

```typescript
export const REGISTERED_SERVICES = [
  { serviceId: 'service', manifestUrl: 'http://service.lvh.me/assets/manifest.json' },
] as const;
```

**Проверки:**

- [ ] Pulse Sidebar показывает Hub Settings
- [ ] Pulse Sidebar показывает Service (Dashboard, Devices, Settings)
- [ ] Клик на Hub Settings → /settings (в Hub)

---

### Тикет 002: Service — Добавить Pulse в навигацию

**Изменить:**

1. `apps/service/frontend/src/components/layout/Layout.tsx` → создать на основе ui-kit Layout
2. Меню:
   - Hub Settings (в конце списка)
   - Pulse (Dashboard, Devices, Settings) — из manifest

**REGISTERED_SERVICES в Service:**

```typescript
export const REGISTERED_SERVICES = [
  { serviceId: 'pulse', manifestUrl: 'http://pulse.lvh.me/assets/manifest.json' },
] as const;
```

**Проверки:**

- [ ] Service Sidebar показывает Hub Settings
- [ ] Service Sidebar показывает Pulse (Dashboard, Devices, Settings)
- [ ] Клик на Hub Settings → /settings (в Hub)

---

## Финальный чеклист

**UI Kit:**

- [ ] Layout экспортируется из `@ject-hub/ui-kit`
- [ ] Типы MenuItem экспортируются

**Hub:**

- [ ] Layout → ui-kit
- [ ] Hub использует Layout из ui-kit

**Pulse:**

- [ ] Sidebar: Hub Settings + Service
- [ ] Module Federation работает

**Service:**

- [ ] Sidebar: Hub Settings + Pulse
- [ ] Module Federation работает

**Хвосты:**

- [ ] Нет дублирования Layout кода
- [ ] Все сервисы используют Layout из ui-kit

---

## Файлы

| Действие | Файл                                                     | Тикет |
| -------- | -------------------------------------------------------- | ----- |
| Создать  | `libs/ui-kit/src/components/layout/Layout.tsx`           | 017.1 |
| Изменить | `apps/hub/frontend/src/components/layout/Layout.tsx`     | 017.2 |
| Создать  | `apps/pulse/frontend/src/components/layout/Layout.tsx`   | 006   |
| Создать  | `apps/service/frontend/src/components/layout/Layout.tsx` | 002   |

---

## Путь к задачам

- `docs/tasks/1_hub/2026-04-22/017.1-layout-to-uikit.md`
- `docs/tasks/1_hub/2026-04-22/017.2-hub-use-uikit-layout.md`
- `docs/tasks/2_pulse/2026-04-22/006-add-service-to-nav.md`
- `docs/tasks/3_service/2026-04-22/002-add-pulse-to-nav.md`

---

## Примечание

В будущем добавить Control в REGISTERED_SERVICES всех сервисов и подпункты.
