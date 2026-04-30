# Task 050: Module Federation Shared Dependencies Fix

## Дата: 2026-04-30

## Проблема

Приложение Hub показывало белую страницу после миграции на `@module-federation/vite`. 

**Причина:** Legacy формат `shared: ['react', 'react-dom', 'react-router-dom']` не предотвращал загрузку нескольких копий React, что нарушало React контекст.

## Решение

Изменён формат `shared` во всех vite.config.ts на объектный с `singleton: true`:

```typescript
shared: {
  react: { singleton: true },
  'react-dom': { singleton: true },
  'react-router-dom': { singleton: true },
}
```

### Изменённые файлы

1. `apps/hub/frontend/vite.config.ts`
2. `apps/pulse/frontend/vite.config.ts`
3. `apps/service/frontend/vite.config.ts`
4. `apps/control/frontend/vite.config.ts`

### Также изменено

- `apps/hub/frontend/src/main.tsx` - добавлен console.log для отладки rootElement

## Проверки

- ✅ `yarn typecheck` — OK
- ✅ Hub login page отображается
- ✅ remoteEntry.js доступен со всех remote приложений (pulse, service, control)
- ✅ ProtectedRoute редиректит на /login при отсутствии авторизации

## Оставшиеся предупреждения

- ⚠️ DTS type archive warnings (не критично, только для IDE)
- ⚠️ WebSocket errors от dynamic-remote-type-hints-plugin (DevTools, не влияет на работу)

## Limitations

- Cross-container HMR между Host и Remote не работает в Docker (lvh.me резолвится в 127.0.0.1 внутри контейнера)
- Module Federation загружает remote модули корректно

## Коммит

`Task 050: Fix Module Federation shared deps with singleton: true - resolve white page`
