# 016: Vite плагины в libs/plugins — Отчёт

**Дата:** 2026-04-22  
**Статус:** Выполнено

---

## Что сделано

Создана библиотека `libs/plugins` с универсальными Vite плагинами.

### Структура libs/plugins

```
libs/plugins/
├── package.json      # name: "@app/plugins", main: "./dist/index.js"
├── tsconfig.json     # Компиляция в CommonJS
├── dist/             # Скомпилированные .js файлы
└── src/
    ├── index.ts
    ├── serveDistAssetsPlugin.ts
    └── manifestPlugin.ts
```

### Решение проблемы с импортом

**Проблема:** Node.js не может загружать `.ts` файлы напрямую.

**Решение:** 
1. Компиляция плагинов в JavaScript (`yarn build` в libs/plugins)
2. Использование `@app/plugins` как workspace package

### Конфигурация

**libs/plugins/package.json:**
```json
{
  "name": "@app/plugins",
  "main": "./dist/index.js"
}
```

**vite.config.ts:**
```typescript
import { manifestPlugin, serveDistAssetsPlugin } from '@app/plugins';
```

---

## Проверки

- [x] libs/plugins скомпилирован в dist/
- [x] pulse-frontend работает (Vite ready на порту 5174)
- [x] service-frontend работает (Vite ready на порту 5175)
- [x] manifest.json отдаётся корректно
- [x] remoteEntry.js отдаётся корректно

---

## Файлы

| Действие | Файл |
|---------|------|
| Создано | `libs/plugins/` (структура + dist/) |
| Изменено | `apps/pulse/frontend/vite.config.ts` |
| Изменено | `apps/service/frontend/vite.config.ts` |

---

## Тикет

016
