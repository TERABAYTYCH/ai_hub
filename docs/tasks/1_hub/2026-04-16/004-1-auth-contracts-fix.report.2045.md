# Task 100-hub/004-1 Report: Рефакторинг регистрации (вынос DTO в libs/contracts)

**Date:** 2026-04-16  
**Timestamp:** 20260416-2045

## Выполненные задачи

### 1. Проверка контрактов

- Подтверждено наличие `RegisterRequestDto` и `LoginRequestDto` в `libs/contracts/src/hub/auth/index.ts`

### 2. Frontend - Использование контрактов

**Измененные файлы:**

- `apps/hub/frontend/src/pages/RegisterPage.tsx`
  - Удален локальный интерфейс `RegisterDto`
  - Добавлен импорт `RegisterRequestDto` и `LoginResponseDto` из `@app/contracts/hub/auth`
  - Типизация body запроса теперь использует `RegisterRequestDto`

- `apps/hub/frontend/src/pages/LoginPage.tsx`
  - Удален локальный интерфейс `LoginResponse`
  - Добавлен импорт `LoginRequestDto` и `LoginResponseDto` из `@app/contracts/hub/auth`
  - Типизация body запроса теперь использует `LoginRequestDto`

- `apps/hub/frontend/tsconfig.json`
  - Добавлены `baseUrl` и `paths` для поддержки `@app/contracts` импортов

## TypeScript Checks

Оба проекта прошли проверку типов:

- Backend: `npx tsc --noEmit` - OK
- Frontend: `npx tsc --noEmit` - OK

## Критерии приемки

- [x] `RegisterRequestDto` находится в `libs/contracts/src/hub/auth`
- [x] Бэкенд контроллер использует этот DTO для валидации входящего запроса
- [x] Фронтенд использует этот же DTO (или его тип) для типизации отправляемых данных
- [x] Команды `yarn typecheck` проходят успешно в обоих проектах

## Заметки

- Lint не запускался из-за ошибки конфигурации eslint (неверный путь к tsconfig.base.json). Это известная проблема конфигурации проекта, не связанная с выполненной задачей.
