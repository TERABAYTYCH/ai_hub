# Задача: Аудит и исправление JWT token handling

**Проблема:** При истекшем токене пользователя не выкидывает на страницу login. Система должна автоматически деавторизовывать при 401 от сервера или при истечении срока токена.

## Анализ

### Бэкенды

| Сервис | ignoreExpiration | Global Guards | Статус |
|--------|-----------------|---------------|--------|
| Hub Backend | `false` ✅ | Нет (нужно добавить) | JwtStrategy настроен правильно |
| Pulse Backend | `false` ✅ | Есть свой guard | JwtStrategy настроен правильно |
| Service Backend | - | - | Не реализован |
| Control Backend | - | - | Не реализован |

### Фронтенды

| Сервис | AuthProvider проверяет exp | authFetch обрабатывает 401 | Axios interceptor |
|--------|---------------------------|---------------------------|-------------------|
| Hub Frontend | ❌ Нет | ✅ Да | ❌ Нет |
| Pulse Frontend | ❌ Нет | ❌ Нет ( DevicesPage использует axios напрямую) | ❌ Нет |

### Core-backend

`libs/core-backend/` - пустая папка (только .gitkeep)

## Исправления

### 1. AuthProvider (libs/ui-kit)

Добавлена проверка срока действия токена при загрузке:
- Функция `decodeTokenPayload()` - парсит JWT без внешних библиотек
- Функция `isTokenExpired()` - проверяет claim `exp`
- При монтировании компонента - если токен истёк, очищаем storage и устанавливаем `isAuthenticated: false`

### 2. Hub Frontend utils/auth.ts

- Добавлена функция `isTokenExpired()`
- `authFetch()` теперь проверяет expiration перед запросом
- При 401 вызывается `handleUnauthorized()`

### 3. Pulse Frontend utils/auth.ts

Создан новый файл с:
- `decodeTokenPayload()` - парсинг JWT
- `isTokenExpired()` - проверка exp claim
- `logout()` - очистка и редирект
- `authFetch()` - с auto-refresh логикой

### 4. Axios Interceptors

Созданы файлы `api/axios.ts` в обоих фронтендах:
- Глобальный interceptor для 401
- Очищает storage и редиректит на /login

### 5. Pulse DevicesPage

Обновлён для использования `authFetch` вместо raw axios

## Файлы измененные

```
libs/ui-kit/src/providers/AuthProvider.tsx
apps/hub/frontend/src/utils/auth.ts
apps/hub/frontend/src/api/axios.ts (новый)
apps/hub/frontend/src/main.tsx
apps/pulse/frontend/src/utils/auth.ts
apps/pulse/frontend/src/api/axios.ts (новый)
apps/pulse/frontend/src/pages/DevicesPage.tsx
apps/pulse/frontend/src/main.tsx
tsconfig.base.json (добавлен ignoreDeprecations)
```
