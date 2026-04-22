# План: SERVICE_001 — Инициализация Service микросервиса

## Цель

Создать третий микросервис **Service** (Обслуживание) по аналогии с Pulse. Все микросервисы получают устройства из Hub через HubProxyModule.

---

## Функционал (Заглушка)

- **Страницы:** Dashboard, Devices, Settings (заглушки)
- **Backend:** HubProxyModule для устройств, остальное заглушки
- **Не делаем:** Tasks, PhotoReports, Entities

---

## Тикет SERVICE_001.1: Backend — Структура и копирование

**Копировать из Pulse:**

- `apps/pulse/backend/` → `apps/service/backend/`

**Изменить:**

1. `package.json` → name: `@ject-hub/service-backend`
2. `src/main.ts` → порт: `3002`, БД: `mysql-service`
3. `src/app.module.ts` → ОСТАВИТЬ HubProxyModule

**Проверки:**

- [ ] Директория `apps/service/backend/` создана
- [ ] `package.json` содержит `@ject-hub/service-backend`
- [ ] `src/main.ts` слушает порт 3002
- [ ] HubProxyModule импортирован в app.module

**Проверки на отсутствие хвостов Pulse:**

- [ ] `grep -r "pulse" apps/service/backend/` — нет упоминаний pulse
- [ ] `grep -r "pulse" apps/service/backend/package.json` — нет упоминаний
- [ ] `grep -r "pulse" apps/service/backend/src/` — нет упоминаний
- [ ] `grep -r "3001" apps/service/backend/` — нет захардкоженных портов pulse
- [ ] `grep -r "mysql-pulse" apps/service/backend/` — нет упоминаний БД pulse

---

## Тикет SERVICE_001.2: Frontend — Структура и копирование

**Копировать из Pulse:**

- `apps/pulse/frontend/` → `apps/service/frontend/`

**Изменить:**

1. `package.json` → name: `@ject-hub/service-frontend`, порт: `5175`
2. `vite.config.ts` → name: `'service'`, exposes: Dashboard, Devices, Settings
3. `.env` → VITE_API_URL=http://api.service.lvh.me
4. manifestPlugin → иконки для Service (bi bi-wrench, bi bi-grid, bi bi-gear)
5. serveDistAssetsPlugin → оставить как у Pulse

**Проверки:**

- [ ] Директория `apps/service/frontend/` создана
- [ ] `package.json` содержит `@ject-hub/service-frontend`
- [ ] `vite.config.ts` exposes: Dashboard, Devices, Settings
- [ ] `serveDistAssetsPlugin` скопирован и работает

**Проверки на отсутствие хвостов Pulse:**

- [ ] `grep -r "pulse" apps/service/frontend/` — нет упоминаний pulse
- [ ] `grep -r "pulse" apps/service/frontend/package.json` — нет упоминаний
- [ ] `grep -r "3001\|5174" apps/service/frontend/` — нет захардкоженных портов pulse
- [ ] `grep -r "pulse.lvh.me" apps/service/frontend/` — нет ссылок на pulse.lvh.me
- [ ] `grep -r "Pulse" apps/service/frontend/src/` — нет упоминаний названия Pulse
- [ ] manifest.json возвращает serviceId: "service"
- [ ] manifest.json содержит navigation для Service (Dashboard, Devices, Settings)

---

## Тикет SERVICE_001.3: Docker Compose — Добавить Service

**Добавить в docker-compose.yml:**

```yaml
service-backend:
  build: apps/service/backend
  container_name: ${COMPOSE_PROJECT_NAME}_service_backend
  restart: unless-stopped
  environment:
    - NODE_ENV=development
    - PORT=3002
    - JWT_SECRET=${JWT_SECRET:-hub-jwt-secret-key-change-in-production}
    - HUB_INTERNAL_API_URL=http://hub-backend:3000
  ports:
    - '3002:3002'
  volumes:
    - .:/app
    - /app/node_modules
    - /app/apps/service/backend/node_modules
  command: yarn workspace @ject-hub/service-backend start:dev
  depends_on:
    - mysql-service
    - hub-backend
  networks:
    - ject-network

service-frontend:
  build: apps/service/frontend
  container_name: ${COMPOSE_PROJECT_NAME}_service_frontend
  restart: unless-stopped
  environment:
    - NODE_ENV=development
    - VITE_API_URL=http://api.service.lvh.me
    - WATCHPACK_POLLING=true
  ports:
    - '5175:5175'
  volumes:
    - .:/app
    - /app/node_modules
    - /app/apps/service/frontend/node_modules
  command: yarn workspace @ject-hub/service-frontend dev:docker
  depends_on:
    - service-backend
  networks:
    - ject-network
```

**Проверки:**

- [ ] `docker compose config` проходит без ошибок
- [ ] `docker compose up -d service-backend service-frontend` запускает контейнеры
- [ ] service-backend слушает порт 3002
- [ ] service-frontend слушает порт 5175

**Проверки на отсутствие хвостов Pulse:**

- [ ] `grep -r "pulse" docker-compose.yml` — нет упоминаний pulse в service секциях
- [ ] `grep "pulse-frontend:\|pulse-backend:" docker-compose.yml` — нет ссылок на pulse контейнеры
- [ ] service-backend не зависит от pulse-frontend или pulse-backend
- [ ] service-frontend не зависит от pulse-frontend или pulse-backend

---

## Тикет SERVICE_001.4: Nginx — Добавить Service server blocks

**Добавить в nginx.conf:**

```nginx
# SERVICE FRONTEND (service.lvh.me)
server {
    listen 80;
    server_name service.lvh.me;

    location / {
        proxy_pass http://service-frontend:5175;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# SERVICE API (api.service.lvh.me)
server {
    listen 80;
    server_name api.service.lvh.me;
    location / {
        proxy_pass http://service-backend:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Проверки:**

- [ ] `nginx -t` проходит
- [ ] `curl http://service.lvh.me` проксируется к Vite
- [ ] `curl http://api.service.lvh.me/devices` проксируется к backend

**Проверки на отсутствие хвостов Pulse:**

- [ ] `grep -i "pulse" nginx/nginx.conf` — нет упоминаний pulse.lvh.me или pulse-frontend
- [ ] Нет server блоков для pulse.lvh.me или api.pulse.lvh.me
- [ ] service.lvh.me и api.service.lvh.me корректно настроены

---

## Тикет SERVICE_001.5: Hub Integration — Добавить Service в меню

**Изменить:**

1. `libs/ui-kit/src/hooks/useMicroserviceManifests.ts` → добавить service в REGISTERED_SERVICES
2. Иконки для Service: Dashboard (bi bi-wrench), Devices (bi bi-grid), Settings (bi bi-gear)

**REGISTERED_SERVICES:**

```typescript
export const REGISTERED_SERVICES = [
  { serviceId: 'pulse', manifestUrl: 'http://pulse.lvh.me/assets/manifest.json' },
  { serviceId: 'service', manifestUrl: 'http://service.lvh.me/assets/manifest.json' },
] as const;
```

**Проверки:**

- [ ] Hub sidebar показывает Service в меню
- [ ] Клик на Service → раскрывает Dashboard, Devices, Settings
- [ ] Навигация работает: /service/dashboard, /service/devices, /service/settings

**Проверки на отсутствие хвостов:**

- [ ] `grep "service" libs/ui-kit/src/hooks/useMicroserviceManifests.ts` — service добавлен
- [ ] manifest для service содержит правильные иконки (bi bi-wrench, bi bi-grid, bi bi-gear)
- [ ] Нет дублирования serviceId в REGISTERED_SERVICES

---

## Тикет SERVICE_001.6: Devices — Загрузить устройства из Hub

**Изменить:**

1. `apps/service/frontend/src/Devices.tsx` → использовать API для загрузки устройств
2. API: `GET /devices` → проксируется через HubProxyModule

**Проверки:**

- [ ] Devices страница показывает устройства из Hub
- [ ] Устройства отображают имя, тип
- [ ] Ошибка если Hub недоступен

**Проверки на отсутствие хвостов Pulse:**

- [ ] `grep -r "Pulse\|pulse" apps/service/frontend/src/Devices.tsx` — нет упоминаний Pulse
- [ ] API URL указывает на `api.service.lvh.me` (не pulse)
- [ ] Нет захардкоженных ссылок на pulse.lvh.me

---

## Финальный чеклист

**Запуск:**

- [ ] Service backend запускается на порту 3002
- [ ] Service frontend запускается на порту 5175
- [ ] HubProxyModule работает

**Module Federation:**

- [ ] `service.lvh.me/assets/remoteEntry.js` доступен
- [ ] `service.lvh.me/assets/manifest.json` доступен
- [ ] manifest.json содержит serviceId: "service"
- [ ] manifest.json содержит navigation: Dashboard, Devices, Settings

**Hub Integration:**

- [ ] Hub видит Service в меню
- [ ] Devices показывает устройства из Hub

**Проверки на хвосты Pulse:**

- [ ] `grep -r "pulse" apps/service/` — 0 результатов
- [ ] `grep -r "3001\|5174" apps/service/` — 0 результатов
- [ ] `grep -r "pulse.lvh.me" apps/service/` — 0 результатов
- [ ] `grep "api.pulse" nginx/nginx.conf` — 0 результатов

**Линт и сборка:**

- [ ] yarn typecheck — 0 ошибок
- [ ] yarn lint — 0 ошибок
- [ ] docker compose up проходит без ошибок

---

## Файлы для изменения

| Файл                                                | Тикет         |
| --------------------------------------------------- | ------------- |
| `apps/service/backend/` (копия)                     | SERVICE_001.1 |
| `apps/service/frontend/` (копия)                    | SERVICE_001.2 |
| `docker-compose.yml`                                | SERVICE_001.3 |
| `nginx/nginx.conf`                                  | SERVICE_001.4 |
| `libs/ui-kit/src/hooks/useMicroserviceManifests.ts` | SERVICE_001.5 |
| `apps/service/frontend/src/Devices.tsx`             | SERVICE_001.6 |
