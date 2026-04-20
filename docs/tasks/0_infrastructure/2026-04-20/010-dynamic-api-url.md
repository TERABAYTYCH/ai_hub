# 🚀 ЗАДАЧА: Удаление префикса /api и настройка чистой маршрутизации через Nginx

Мы переходим на чистую субдоменную архитектуру. Так как у нас теперь есть выделенные домены для API (`api.hub.localhost` и `api.pulse.localhost`), префикс `/api` в путях больше не нужен. Фронтенд уже отправляет запросы в корень (например, `/devices`).

## 🛠 Что нужно сделать Разработчику (`code-terych-sub`):

1. **Убрать префикс на Бэкендах (Hub и Pulse):**
   Откройте точки входа бэкенд-приложений (обычно это `main.ts` в NestJS или конфигурация Express/Fastify).
   - Найдите и **удалите** строку вида `app.setGlobalPrefix('api');`.
   - Если префикс был задан в контроллерах (например, `@Controller('api/devices')`), уберите `api/` оттуда.
   - Теперь бэкенд должен слушать маршруты от корня: `GET /devices`, `POST /auth/login` и т.д.

2. **Настроить Nginx API Gateway:**
   Убедитесь, что в `nginx.conf` блоки для API-поддоменов просто проксируют все запросы в корень контейнеров бэкенда. Никаких `rewrite` не требуется.

   ```nginx
   # Пример для Hub API
   server {
       listen 80;
       server_name api.hub.localhost;

       location / {
           proxy_pass http://hub-backend:3000; # Укажите правильное имя контейнера и порт
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;

           # CORS заголовки (если бэкенд не обрабатывает их сам)
           add_header 'Access-Control-Allow-Origin' '$http_origin' always;
           add_header 'Access-Control-Allow-Credentials' 'true' always;
           add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
           add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;

           if ($request_method = 'OPTIONS') {
               return 204;
           }
       }
   }
   ```

   _Сделайте аналогичный блок для `api.pulse.localhost`, ведущий на `pulse-backend`._

3. **Проверить Swagger / OpenAPI (если есть):**
   Если на бэкенде настроен Swagger, убедитесь, что он тоже доступен по новому пути (например, `http://api.hub.localhost/docs` или `http://api.hub.localhost/swagger`), так как базовый путь изменился.

## 🕵️‍♂️ Задача для Тестировщика (`test-engineer`):

1. Перезапустите бэкенды и Nginx.
2. Выполните прямой запрос к API через curl или браузер:
   `curl -i http://api.hub.localhost/devices`
3. Убедитесь, что бэкенд возвращает данные (200 OK), а не 404.
4. Откройте фронтенд (`http://hub.localhost`), убедитесь, что приложение успешно загружает данные с API.
