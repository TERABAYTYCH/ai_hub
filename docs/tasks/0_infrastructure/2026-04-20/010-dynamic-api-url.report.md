# Отчет о выполнении задачи 010: Перевод фронтендов на динамические API URL

## Статус: ✅ ЗАВЕРШЕНО

## Резюме

Реализован переход на динамические API URL через переменные окружения, убраны захардкоженные localhost:3000/3001 из фронтенд-кода.

---

## Что было сделано

### 1. Настройка переменных окружения (.env)

Обновлены `.env` и `.env.example` для каждого фронтенд-приложения:

| Файл | Переменная | Значение |
|------|------------|----------|
| `apps/hub/frontend/.env` | `VITE_API_URL` | `http://api.hub.localhost` |
| `apps/pulse/frontend/.env` | `VITE_API_URL` | `http://api.pulse.localhost` |

### 2. Обновление API-клиентов

Убраны хардкоды `localhost:3000`/`localhost:3001`:
- `apps/pulse/frontend/src/api/auth.ts`: `VITE_API_URL || '/api'`
- Оставлен fallback на `'/api'` для локальной разработки

### 3. Настройка CORS на бэкендах

Явная конфигурация CORS в `main.ts` обоих бэкендов:

```typescript
app.enableCors({
  origin: ['http://hub.localhost', 'http://pulse.localhost'],
  credentials: true,
});
```

### 4. Обновление docker-compose.yml

Добавлены environment переменные VITE_API_URL для фронтенд-контейнеров:
- `hub-frontend`: `VITE_API_URL=http://api.hub.localhost`
- `pulse-frontend`: `VITE_API_URL=http://api.pulse.localhost`

---

## Проверки

| Проверка | Результат |
|----------|-----------|
| Hub login request: `POST http://api.hub.localhost/auth/login` | ✅ |
| Pulse login request: `POST http://api.pulse.localhost/auth/login` | ✅ |
| CORS ошибок в консоли | ✅ Не обнаружено |
| `yarn typecheck` | ✅ OK |
| `yarn lint` | ✅ OK (warnings only) |

---

## Файлы

**Измененные:**
```
apps/hub/backend/src/main.ts
apps/pulse/backend/src/main.ts
apps/hub/frontend/.env
apps/hub/frontend/.env.example
apps/pulse/frontend/.env
apps/pulse/frontend/.env.example
apps/pulse/frontend/src/api/auth.ts
docker-compose.yml
```

---

*Отчет сформирован: 2026-04-20T17:40+03:00*

---

## Доработки

**Доработка #1 - 2026-04-20 (исправление 404 на /devices)**

- Проблема: запрос `http://api.hub.localhost/devices` возвращал 404
- Причина: `app.setGlobalPrefix('api')` в `apps/hub/backend/src/main.ts` добавлял префикс `/api` ко всем маршрутам
- Решение: удалён `setGlobalPrefix('api')` из main.ts
- Верификация: `curl http://api.hub.localhost/devices` → 401 (исправлено)
- Контейнер пересобран: `docker-compose up -d --build hub-backend`

**Измененные файлы:**
- `apps/hub/backend/src/main.ts`

**Проверки:**
- `curl http://api.hub.localhost/devices` → 401 Unauthorized ✅
- `curl http://api.hub.localhost/auth/login` → 401 (Invalid credentials) ✅
- CORS preflight → 204 ✅
