# Task 100-hub/004-3 Report: Строгая привязка сущностей к контрактам (implements)

**Date:** 2026-04-16  
**Timestamp:** 20260416-2130

## Выполненные задачи

### 1. Обновление интерфейса IUser

**Измененный файл:** `libs/contracts/src/hub/auth/index.ts`

- Сделан `email` опциональным: `email?: string`
- Обновлены типы дат: `createdAt: Date | string` и `updatedAt: Date | string`

### 2. TypeORM User entity с implements

**Измененный файл:** `apps/hub/backend/src/auth/entities/user.entity.ts`

- Добавлен импорт: `import { IUser } from '@app/contracts/hub/auth';`
- Добавлено `implements IUser` к классу `User`

### 3. DTO с implements

**Измененные файлы:**

- `apps/hub/backend/src/auth/dto/login.dto.ts`
  - Добавлен `implements LoginRequestDto`
- `apps/hub/backend/src/auth/dto/register.dto.ts`
  - Добавлен `implements RegisterRequestDto`

## TypeScript Checks

Все проверки прошли успешно:

- Backend `npx tsc --noEmit`: OK
- Backend `yarn lint`: OK (только warnings)

## Критерии приемки

- [x] TypeORM сущность `User` содержит `implements IUser`
- [x] DTO содержат `implements` соответствующих интерфейсов
- [x] Компилятор TypeScript выдаст ошибку при несовпадении полей
- [x] `npx tsc --noEmit` в backend завершается без ошибок
