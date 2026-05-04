# Task: Исправление dev workflow для Module Federation

**Дата:** 2026-04-30  
**Время:** 18:45

---

## Что было сделано

### 1. Обновлены remote apps (pulse, service, control) vite.config.ts

Добавлена опция `dev` в federation() для каждого remote приложения:

```typescript
federation({
  name: 'pulse',
  filename: 'remoteEntry.js',
  exposes: { ... },
  shared: ['react', 'react-dom', 'react-router-dom'],
  server: {
    origin: 'http://pulse.lvh.me:5174',
  },
  dev: {
    remoteHmr: true,
    disableDynamicRemoteTypeHints: true,
  },
  dts: false,
}),
```

**Файлы:**
- `apps/pulse/frontend/vite.config.ts` - добавлен `dev.remoteHmr: true` и `dev.disableDynamicRemoteTypeHints: true`
- `apps/service/frontend/vite.config.ts` - добавлен `dev.remoteHmr: true` и `dev.disableDynamicRemoteTypeHints: true`
- `apps/control/frontend/vite.config.ts` - добавлен `dev.remoteHmr: true` и `dev.disableDynamicRemoteTypeHints: true`

### 2. Обновлён Hub vite.config.ts

Изменены remotes для указания на dev порты remote apps:

```typescript
remotes: {
  pulse: {
    type: 'module',
    name: 'pulse',
    entry: 'http://pulse.lvh.me:5174/remoteEntry.js',  // dev port!
    entryGlobalName: 'pulse',
    shareScope: 'default',
  },
  service: {
    type: 'module',
    name: 'service',
    entry: 'http://service.lvh.me:5175/remoteEntry.js',  // dev port!
    entryGlobalName: 'service',
    shareScope: 'default',
  },
  control: {
    type: 'module',
    name: 'control',
    entry: 'http://control.lvh.me:5176/remoteEntry.js',  // dev port!
    entryGlobalName: 'control',
    shareScope: 'default',
  },
},
```

Добавлена dev опция:
```typescript
dev: {
  remoteHmr: true,
  disableDynamicRemoteTypeHints: true,
},
```

**Файл:**
- `apps/hub/frontend/vite.config.ts` - обновлены remotes entry URLs и добавлена dev опция

---

## Измененные файлы

1. `apps/pulse/frontend/vite.config.ts` - добавлен `dev: { remoteHmr: true, disableDynamicRemoteTypeHints: true }`
2. `apps/service/frontend/vite.config.ts` - добавлен `dev: { remoteHmr: true, disableDynamicRemoteTypeHints: true }`
3. `apps/control/frontend/vite.config.ts` - добавлен `dev: { remoteHmr: true, disableDynamicRemoteTypeHints: true }`
4. `apps/hub/frontend/vite.config.ts` - обновлены remotes entry URLs (с port) и добавлена dev опция

---

## Проверки

- ✅ `yarn typecheck` — 0 errors
- ✅ `yarn build` — 9 successful builds

---

## Архитектурное решение

### Проблема
`remoteEntry.js` не был доступен в dev режиме. Module Federation требовал специальной настройки для работы с HMR (Hot Module Replacement).

### Решение
Согласно официальной документации `@module-federation/vite`:

1. **`dev.remoteHmr: true`** - включает поддержку HMR для remote модулей в dev режиме
2. **`dev.disableDynamicRemoteTypeHints: true`** - отключает динамические type hints для remote модулей
3. **Remote apps запускаются на dev портах** (5174, 5175, 5176) вместо использования production URL
4. **Host (Hub) указывает на `remoteEntry.js` с dev портами** - `http://pulse.lvh.me:5174/remoteEntry.js`

### Порты dev серверов
| App | Dev Port | URL |
|-----|----------|-----|
| Hub | 5173 | http://hub.lvh.me:5173 |
| Pulse | 5174 | http://pulse.lvh.me:5174 |
| Service | 5175 | http://service.lvh.me:5175 |
| Control | 5176 | http://control.lvh.me:5176 |

---

## Следующий шаг

Протестировать Module Federation в dev режиме - remote apps должны загружаться через HMR при изменении кода.
