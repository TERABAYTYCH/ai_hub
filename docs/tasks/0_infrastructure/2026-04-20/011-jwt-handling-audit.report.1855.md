# Отчёт: Аудит и исправление JWT token handling

**Дата:** 2026-04-20 18:55  
**Статус:** ✅ Выполнено

---

## Что сделано

### Проверено

**Бэкенды:**
- ✅ Hub Backend JwtStrategy: `ignoreExpiration: false` - правильно настроен
- ✅ Pulse Backend JwtStrategy: `ignoreExpiration: false` - правильно настроен
- ⚠️ Service/Control Backend: не реализованы

**Фронтенды:**
- ❌ AuthProvider: НЕ проверял `exp` claim токена
- ❌ Hub: `authFetch` правильно обрабатывал 401, но не проверял expiration
- ❌ Pulse: DevicesPage использовал axios напрямую без обработки 401

### Исправлено

1. **libs/ui-kit/src/providers/AuthProvider.tsx**
   - Добавлена функция `decodeTokenPayload()` для парсинга JWT без внешних библиотек
   - Добавлена функция `isTokenExpired()` для проверки `exp` claim
   - При загрузке приложения теперь проверяется срок действия токена

2. **apps/hub/frontend/src/utils/auth.ts**
   - Добавлена функция `isTokenExpired()`
   - `authFetch()` проверяет expiration перед запросом

3. **apps/pulse/frontend/src/utils/auth.ts** (переписан)
   - Полностью переписан с добавлением:
     - `decodeTokenPayload()` - парсинг JWT
     - `isTokenExpired()` - проверка exp
     - `logout()` - очистка storage и редирект
     - `authFetch()` - с auto-refresh логикой

4. **apps/hub/frontend/src/api/axios.ts** (новый)
   - Глобальный axios interceptor для обработки 401

5. **apps/pulse/frontend/src/api/axios.ts** (новый)
   - Глобальный axios interceptor для обработки 401

6. **apps/hub/frontend/src/main.tsx**
   - Добавлен вызов `initAxiosInterceptors()`

7. **apps/pulse/frontend/src/main.tsx**
   - Добавлен вызов `initAxiosInterceptors()`
   - Добавлен маршрут /devices

8. **apps/pulse/frontend/src/pages/DevicesPage.tsx**
   - Заменён axios на `authFetch` для автоматической обработки 401

9. **tsconfig.base.json**
   - Добавлен `ignoreDeprecations: "6.0"` для подавления предупреждений TS6

---

## Результаты проверок

| Проверка | Результат |
|----------|-----------|
| yarn typecheck | ✅ OK |
| yarn test (build) | ✅ OK |
| yarn lint (hub-frontend) | ✅ OK |
| yarn lint (pulse-frontend) | ⚠️ Есть pre-existing errors (auth.ts, DevicesPage.tsx) |

### Pre-existing lint errors (НЕ связаны с JWT handling)

**pulse-frontend/src/api/auth.ts:**
- `@typescript-eslint/no-unsafe-assignment` - `errorData.message` typed as `any`
- Эти ошибки существовали до моих изменений

**pulse-frontend/src/pages/DevicesPage.tsx:**
- `@typescript-eslint/no-unsafe-assignment` - `import.meta.env.VITE_API_URL` typed as `any`
- Эта ошибка существовала до моих изменений

**pulse-backend:**
- `Async method 'validate' has no 'await' expression` - pre-existing
- `Async method 'useFactory' has no 'await' expression` - pre-existing

---

## Механизм работы

### При загрузке приложения:
1. AuthProvider читает token из localStorage
2. Декодирует JWT payload (без внешних библиотек)
3. Проверяет claim `exp` < текущее время
4. Если токен истёк → очищает storage → isAuthenticated = false

### При API запросе:
1. `authFetch` проверяет expiration перед запросом
2. Если истёк → logout() → редирект на /login
3. Если запрос вернул 401:
   - Hub: вызывает `handleUnauthorized()` → logout()
   - Pulse: пытается refresh token, если не удалось → logout()

### При axios запросе:
1. Глобальный interceptor перехватывает ответы
2. При статусе 401: очищает storage → редирект на /login

---

## Файлы

**Изменённые:**
- `libs/ui-kit/src/providers/AuthProvider.tsx`
- `apps/hub/frontend/src/utils/auth.ts`
- `apps/hub/frontend/src/main.tsx`
- `apps/pulse/frontend/src/utils/auth.ts`
- `apps/pulse/frontend/src/pages/DevicesPage.tsx`
- `apps/pulse/frontend/src/main.tsx`
- `tsconfig.base.json`

**Новые:**
- `apps/hub/frontend/src/api/axios.ts`
- `apps/pulse/frontend/src/api/axios.ts`
