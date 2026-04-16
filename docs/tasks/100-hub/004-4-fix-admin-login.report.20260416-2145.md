# Task 100-hub/004-4 Report: Debug & Fix Admin Login

**Date:** 2026-04-16  
**Timestamp:** 20260416-2145

## Выполненные задачи

### 1. Анализ проблемы

**Причина ошибки:** Переменные окружения `ADMIN_EMAIL` и `ADMIN_PASSWORD` не передавались в Docker контейнер hub-backend. Код сидера работал корректно, но переменные не были доступны внутри контейнера.

**Проверка кода:**

- ✅ Сидер (`UsersModule`) использует `bcrypt.hash` для хеширования пароля - OK
- ✅ Сидер создает пользователя с username = `adminEmail.split('@')[0]` = `admin` - OK
- ✅ `UsersService.validateUser` ищет по username и использует `bcrypt.compare` - OK
- ✅ Frontend отправляет `username` и `password` - OK

### 2. Исправление

**Измененный файл:** `docker-compose.yml`

- Добавлены переменные окружения для hub-backend:
  ```yaml
  - ADMIN_EMAIL=${ADMIN_EMAIL:-admin@ject.hub}
  - ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin}
  ```

### 3. Дополнительное исправление (TypeScript)

**Измененный файл:** `tsconfig.base.json`

- Удален некорректный параметр `ignoreDeprecations: "6.0"` (не поддерживается в TS 5.9.3)

### 4. Исправление поиска пользователя

**Измененный файл:** `apps/hub/backend/src/auth/users.service.ts`

- Добавлен метод `findByUsernameOrEmail` для поиска по username или email
- Обновлен `validateUser` для использования нового метода
- Теперь можно логиниться как по `username`, так и по `email`

### 5. Исправление Dockerfile

**Измененный файл:** `apps/hub/backend/Dockerfile`

- Добавлен `libs/ui-kit` в COPY и RUN yarn install для корректной сборки

## TypeScript Checks

- Backend `npx tsc --noEmit`: OK
- Backend `yarn lint`: OK (4 warnings)
- Frontend `npx tsc --noEmit`: OK
- Frontend `yarn lint`: OK

## Критерии приемки

- [x] Найдена и описана точная причина ошибки логина
- [x] Внесены исправления в docker-compose.yml
- [x] Добавлен findByUsernameOrEmail в UsersService
- [x] Исправлен Dockerfile для сборки ui-kit
- [x] TypeScript typecheck проходит
- [x] Lint проходит

## Инструкция для запуска

Контейнер был пересобран с исправлениями. Попробуйте войти с:

- username: `admin@ject.hub`
- password: `admin`
