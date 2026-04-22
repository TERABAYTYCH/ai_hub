# План: Task 006 — Инициализация Service микросервиса

## Цель

Создать третий микросервис **Service** (Обслуживание) по аналогии с Pulse. Все микросервисы получают устройства из Hub через HubProxyModule.

---

## Функционал Service (Заглушка для тестирования)

**Цель:** Создать базовый Service микросервис-заглушку для тестирования архитектуры:
- Module Federation
- HubProxyModule (загрузка устройств из Hub)
- Docker/Nginx интеграция

**Страницы (заглушки):**
- Dashboard — простая заглушка "Service Dashboard"
- Devices — список устройств из Hub (через HubProxyModule)
- Settings — заглушка "Service Settings"

**Entities, PhotoReports, Tasks — НЕ делаем пока.**

---

## API Endpoints (Frontend ↔ Backend)

Service Backend предоставляет только HubProxy для получения устройств из Hub. Остальные endpoints — заглушки.

### Devices API (через HubProxy)

| Method | Endpoint       | Description                            |
| ------ | -------------- | -------------------------------------- |
| GET    | `/devices`     | Список устройств (проксируется из Hub) |
| GET    | `/devices/:id` | Устройство по ID                       |

### Dashboard API (заглушка)

| Method | Endpoint     | Description                                  |
| ------ | ------------ | -------------------------------------------- |
| GET    | `/dashboard` | Заглушка: `{ message: "Service Dashboard" }` |

### Settings API (заглушка)

| Method | Endpoint    | Description                       |
| ------ | ----------- | --------------------------------- |
| GET    | `/settings` | Заглушка: `{ module: "service" }` |

---

## Логика страниц Frontend (Заглушки)

### Dashboard (/)

**Компоненты:**
- Заглулка: просто текст "Service Dashboard - Work in Progress"
- Ссылка на Devices

### Devices (/devices)

**Компоненты:**
- GET /devices → список устройств из Hub
- Показывать: имя, тип, описание
- Клик по устройству → показать детали в консоли (заглушка)

### Settings (/settings)

**Компоненты:**
- Заглулка: просто текст "Service Settings - Work in Progress"

---

## Этапы реализации

### Шаг 1: Backend — Структура

**Копировать из Pulse:**
- `apps/pulse/backend/` → `apps/service/backend/`

**Изменить:**
1. `package.json`:
   - name: `@ject-hub/service-backend`
   - порт: `3002`
2. `src/main.ts`:
   - порт: `3002`
   - БД: `mysql-service` (3308)
3. `src/app.module.ts`:
   - ОСТАВИТЬ HubProxyModule (все микросервисы получают устройства из Hub)
4. `src/auth/` — оставить базовую структуру JWT

**DTO в contracts:**
```typescript
// libs/contracts/src/service/index.ts (заглушка)
export interface ServiceConfig {
  module: string;
  version: string;
}
```

---

### Шаг 2: Frontend — Структура и Module Federation

**Копировать из Pulse:**
- `apps/pulse/frontend/` → `apps/service/frontend/`

**Изменить:**
1. `package.json`:
   - name: `@ject-hub/service-frontend`
   - порт: `5175`
2. `vite.config.ts`:
   - name: `'service'`
   - exposes: Dashboard, Devices, Settings (только 3 заглушки)
   - dev:docker: добавить `yarn build`
3. `.env`:
   - VITE_API_URL=http://api.service.lvh.me
4. manifestPlugin — синхронизировать иконки с main.tsx

**Страницы (заглулки):**
- Dashboard — просто компонент с текстом
- Devices — DeviceTable с реальными данными из Hub
- Settings — просто компонент с текстом

---

### Шаг 3: Docker Compose

**Добавить в docker-compose.yml:**
```yaml
service-backend:
  build: apps/service/backend
  ports:
    - '3002:3002'
  environment:
    - PORT=3002
    - DB_HOST=mysql-service
    - DB_PORT=3306
    - DB_NAME=service
    - JWT_SECRET=${JWT_SECRET}
    - HUB_INTERNAL_API_URL=http://hub-backend:3000
  depends_on:
    - mysql-service
    - hub-backend

service-frontend:
  build: apps/service/frontend
  ports:
    - '5175:5175'
  environment:
    - VITE_API_URL=http://api.service.lvh.me
  volumes:
    - .:/app
    - /app/node_modules
    - /app/apps/service/frontend/node_modules
    - ./apps/service/frontend/dist:/app/apps/service/frontend/dist
  command: yarn workspace @ject-hub/service-frontend dev:docker
  depends_on:
    - service-backend
```

**Важно:** Добавить volume для service dist в nginx секцию:
```yaml
nginx:
  volumes:
    - ./apps/service/frontend/dist:/usr/share/nginx/html/service:ro
```

---

### Шаг 4: Nginx конфигурация

**Добавить в nginx.conf (аналогично Pulse):**
```nginx
# SERVICE FRONTEND (service.lvh.me)
server {
    listen 80;
    server_name service.lvh.me;
    root /usr/share/nginx/html/service;

    # Proxy manifest.json to Vite dev server (for HMR in dev)
    location = /assets/manifest.json {
        proxy_pass http://service-frontend:5175/assets/manifest.json;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Serve static assets from dist folder (has remoteEntry.js for Module Federation)
    location /assets/ {
        alias /usr/share/nginx/html/service/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Accept,Authorization' always;
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
    }

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

---

### Шаг 5: Hub Integration

**Добавить Service в Hub:**
1. `useMicroserviceManifests.ts` — добавить `http://service.lvh.me/assets/manifest.json` в REGISTERED_SERVICES
2. Volume для service-frontend dist в nginx конфиг (аналогично pulse)

---

## Файлы для создания/изменения

| Файл                                     | Действие                                               |
| ---------------------------------------- | ------------------------------------------------------ |
| `apps/service/backend/`                  | Создать (копия Pulse)                                  |
| `apps/service/backend/package.json`        | name → @ject-hub/service-backend                       |
| `apps/service/backend/src/main.ts`        | порт 3002, mysql-service                               |
| `apps/service/backend/src/app.module.ts`  | ОСТАВИТЬ HubProxyModule                               |
| `libs/contracts/src/service/`           | Создать DTO (заглушка)                                |
| `apps/service/frontend/`                 | Создать (копия Pulse)                                 |
| `apps/service/frontend/package.json`      | name → @ject-hub/service-frontend, порт 5175           |
| `apps/service/frontend/vite.config.ts`     | name: 'service', exposes: Dashboard, Devices, Settings |
| `docker-compose.yml`                     | Добавить service-backend, service-frontend             |
| `nginx/nginx.conf`                       | Добавить service.lvh.me, api.service.lvh.me           |

---

## Чеклист

- [ ] Service backend запускается на порту 3002
- [ ] Service frontend запускается на порту 5175
- [ ] HubProxyModule работает (устройства синхронизируются из Hub)
- [ ] Docker контейнеры создаются без ошибок
- [ ] Module Federation работает (service.lvh.me/assets/remoteEntry.js)
- [ ] Hub видит Service в меню через manifest.json
- [ ] Devices страница показывает реальные устройства из Hub
- [ ] yarn typecheck — 0 ошибок
- [ ] yarn lint — 0 ошибок