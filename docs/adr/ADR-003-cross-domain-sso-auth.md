# ADR-003: Cross-Domain SSO Authentication с HttpOnly Cookies

## Статус: Принято

## Контекст

Проект Ject Hub состоит из нескольких frontend-приложений (Hub, Pulse, Service, Control), каждое на своём субдомене. Необходимо обеспечить единый вход (SSO) - пользователь залогинился один раз и имеет доступ ко всем приложениям.

**Требования:**
- Cross-domain authentication между субдоменами
- Безопасное хранение refresh token (HttpOnly cookie)
- Access token должен быть доступен JavaScript для API запросов
- Автоматическое обновление токенов при истечении

## Решение

### 1. Архитектура токенов

**Access Token:**
- Формат: JWT
- Хранение: Обычная cookie (`ject_access_token`)
- Доступ: JavaScript (для формирования Authorization заголовка)
- Срок жизни: 1 час
- Cookie parameters: `path=/; SameSite=Lax; domain=.example.com` (для cross-domain)

**Refresh Token:**
- Формат: JWT  
- Хранение: HttpOnly cookie (`ject_refresh_token`)
- Доступ: Только сервер (не доступен JavaScript)
- Срок жизни: 7 дней
- Cookie parameters: `path=/; httpOnly; SameSite=Lax; max-age=604800`

### 2. Backend API Endpoints

```
POST /auth/login
  - Аутентификация пользователя
  - Response: { accessToken, refreshToken, user, expiresIn }
  - Set-Cookie: ject_refresh_token=<token>; httpOnly; ...

POST /auth/register
  - Регистрация нового пользователя
  - Response: { accessToken, refreshToken, user, expiresIn }
  - Set-Cookie: ject_refresh_token=<token>; httpOnly; ...

POST /auth/refresh
  - Обновление токенов
  - Request: Cookie ject_refresh_token отправляется автоматически
  - Response: { accessToken, refreshToken, expiresIn }
  - Set-Cookie: ject_refresh_token=<new_token>; httpOnly; ...

POST /auth/logout
  - Выход из системы
  - Clear-Cookie: обе cookies с expired date
  - Response: { message }

GET /auth/me
  - Получение текущего пользователя
  - Требует валидный access token
```

### 3. Frontend Cookie Utilities

Создан `libs/ui-kit/src/utils/cookies.ts`:

```typescript
getRootDomain()     // Определяет корневой домен для cookies
setAccessToken()    // Устанавливает access token cookie
getAccessToken()    // Читает access token из cookie
removeAccessToken() // Удаляет access token cookie
```

### 4. AuthProvider Implementation

`libs/ui-kit/src/providers/AuthProvider.tsx`:

**При загрузке (mount):**
1. Читает access token из cookie
2. Проверяет срок действия (exp claim)
3. Если истёк - пытается refresh через `/auth/refresh`
4. Если refresh успешен - сохраняет новый token в cookie
5. Если refresh неуспешен - очищает cookies, показывает неавторизованное состояние

**При логине:**
1. Сохраняет access token в cookie
2. Обновляет state

**При логауте:**
1. Вызывает `/auth/logout` для очистки cookies на сервере
2. Очищает cookies локально
3. Редиректит на /login

### 5. CORS и Cookie политика

**Nginx proxy настроен для:**
- Проксирования `/api` запросов на соответствующий backend
- Отправки cookies между субдоменами

**Vite dev server настроен для:**
- `credentials: 'include'` во всех fetch запросах
- CORS allow credentials

## Последствия

### Положительные
- Единая точка входа для всех сервисов
- Refresh token защищён от XSS (httpOnly)
- Access token доступен для API запросов
- Автоматическое обновление токенов

### Отрицательные
- Зависимость от Third-party cookies (может быть ограничена браузерами в будущем)
- Сложнее тестировать (требуется реальная cookie передача)
- Необходимость синхронизации cookies между доменами

### Риски
- Браузерные ограничения third-party cookies могут нарушить SSO
- При падении Hub Backend - все сервисы теряют аутентификацию

## Альтернативы

### 1. OAuth2/OIDC Provider
- Преимущества: Стандартный протокол, много библиотек
- Недостатки: Сложность инфраструктуры, дополнительный сервис

### 2. Shared localStorage через postMessage
- Преимущества: Проще реализация
- Недостатки: Небезопасно (XSS), не работает между доменами напрямую

### 3. Session-based auth с shared session store
- Преимущества: Простота
- Недостатки: Требует shared session store (Redis), сложнее горизонтальное масштабирование

## Реализация

### Файлы

**Созданные:**
- `libs/ui-kit/src/utils/cookies.ts` - Cookie utilities
- `libs/ui-kit/src/utils/index.ts` - Exports

**Модифицированные:**
- `libs/ui-kit/src/providers/AuthProvider.tsx` - Cookie-based auth
- `libs/ui-kit/src/index.ts` - Export cookies utilities
- `apps/hub/backend/src/auth/auth.controller.ts` - HttpOnly cookies
- `apps/hub/backend/src/auth/auth.service.ts` - Refresh token logic
- `apps/hub/frontend/src/api/axios.ts` - Cookie-based logout
- `apps/pulse/frontend/src/utils/auth.ts` - Cookie utilities
- `apps/hub/frontend/src/pages/LoginPage.tsx` - credentials: 'include'
- `apps/hub/frontend/src/pages/RegisterPage.tsx` - credentials: 'include'
- `apps/pulse/frontend/src/pages/LoginPage.tsx` - credentials: 'include'
