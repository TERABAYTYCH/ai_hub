# Отчет о выполнении задачи 009: Nginx API Gateway и субдоменная маршрутизация

## Статус: ✅ ЗАВЕРШЕНО

## Резюме

Реализована субдоменная маршрутизация для микросервисов с поддержкой Module Federation в dev режиме.

---

## Архитектура

### Субдомены:
| Сервис | URL | Описание |
|--------|-----|---------|
| Hub Frontend | `http://hub.localhost/` | UI приложения Hub |
| Pulse Frontend | `http://pulse.localhost/` | UI приложения Pulse |
| Hub API | `http://api.hub.localhost/` | API Hub Backend |
| Pulse API | `http://api.pulse.localhost/` | API Pulse Backend |

### Module Federation:
- **remoteEntry.js**: `http://pulse.localhost/assets/remoteEntry.js`
- Статика подаётся из `dist/assets/` (production build)

---

## Конфигурация

### Nginx:
- CORS заголовки для cross-origin запросов
- Проксирование на Vite dev servers для UI
- Раздача статики (remoteEntry.js) из dist папки

### Docker Compose:
```yaml
nginx:
  volumes:
    - ./apps/pulse/frontend/dist:/usr/share/nginx/html/pulse:ro
```

### Hub vite.config.ts:
```typescript
remotes: {
  pulse: 'http://pulse.localhost/assets/remoteEntry.js',
}
```

---

## Проверки

| Проверка | Результат |
|----------|-----------|
| `hub.localhost/` - Hub login page | ✅ Работает |
| `pulse.localhost/` - Pulse login page | ✅ Работает |
| `http://pulse.localhost/assets/remoteEntry.js` | ✅ JavaScript (200) |
| Hub login form | ✅ Рендерится |
| Pulse login form | ✅ Рендерится |
| CORS заголовки | ✅ Настроены |

---

## Module Federation Notes

- `remoteEntry.js` генерируется только при production build (`yarn build`)
- В dev режиме статика подаётся из `dist/assets/`
- Module Federation remote загружается когда используется remote компонент

---

## Файлы

**Измененные:**
```
nginx/nginx.conf
docker-compose.yml
apps/hub/frontend/vite.config.ts
apps/pulse/frontend/vite.config.ts
apps/hub/frontend/src/main.tsx
apps/pulse/frontend/src/main.tsx
```

---

*Отчет сформирован: 2026-04-20T16:55+03:00*
