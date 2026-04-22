# 016: Vite плагины в libs/plugins

## Цель

Вынести одинаковые Vite плагины из микросервисов в общую библиотеку `libs/plugins`.

## Задачи

### 1. Изучить текущие плагины

Прочитать и сравнить:
- `apps/pulse/frontend/vite.config.ts` — плагины
- `apps/service/frontend/vite.config.ts` — плагины

Найти идентичные или почти идентичные плагины:
- `serveDistAssetsPlugin`
- `manifestPlugin`

### 2. Создать libs/plugins

Создать структуру:
```
libs/plugins/
├── package.json
├── src/
│   ├── index.ts
│   ├── serveDistAssetsPlugin.ts
│   └── manifestPlugin.ts
└── tsconfig.json
```

### 3. Создать serveDistAssetsPlugin

Универсальный плагин - идентичен во всех микросервисах.

### 4. Создать manifestPlugin

Параметры:
- `serviceId`
- `serviceName`
- `baseUrl`
- `moduleMapping: Record<string, { label, icon, path }>`

### 5. Изменить vite.config.ts

**apps/pulse/frontend/vite.config.ts:**
```typescript
import { manifestPlugin, serveDistAssetsPlugin } from '@ject-hub/plugins';
```

**apps/service/frontend/vite.config.ts:**
```typescript
import { manifestPlugin, serveDistAssetsPlugin } from '@ject-hub/plugins';
```

### 6. Проверки

- [ ] Плагины экспортируются из `@ject-hub/plugins`
- [ ] Pulse работает с плагинами из libs/plugins
- [ ] Service работает с плагинами из libs/plugins
- [ ] remoteEntry.js и manifest.json отдаются корректно

### 7. Проверки на отсутствие хвостов

- [ ] `serveDistAssetsPlugin` не дублируется в apps/
- [ ] `manifestPlugin` не дублируется в apps/

## План

1. Изучить текущие vite.config.ts
2. Создать libs/plugins/src/ с плагинами
3. Настроить package.json и tsconfig.json
4. Изменить apps/pulse/frontend/vite.config.ts
5. Изменить apps/service/frontend/vite.config.ts
6. Проверить работу
7. Запушить

## Файлы

| Действие | Файл |
|---------|------|
| Создать | `libs/plugins/` (структура) |
| Создать | `libs/plugins/src/serveDistAssetsPlugin.ts` |
| Создать | `libs/plugins/src/manifestPlugin.ts` |
| Создать | `libs/plugins/src/index.ts` |
| Изменить | `apps/pulse/frontend/vite.config.ts` |
| Изменить | `apps/service/frontend/vite.config.ts` |

## Тикет

016
