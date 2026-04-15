# ADR-002: Корневые конфигурации и инструменты разработки

## Статус: Принято

## Контекст

После базовой инициализации монорепозитория (ADR-001) необходимо настроить инструменты разработки для обеспечения качества кода, единого стиля и удобного управления проектом через Makefile.

## Решение

### 1. Makefile

Создан корневой `Makefile` для удобного управления проектом. Включает команды:

**Docker:**
- `make docker-up` - запуск всех контейнеров
- `make docker-down` - остановка и удаление контейнеров
- `make docker-logs` - просмотр логов
- `make docker-ps` - статус контейнеров
- `make docker-clean` - полная очистка

**Turborepo:**
- `make build-all`, `make lint-all`, `make test-all`, `make typecheck-all`, `make dev-all`

**Database:**
- `make db-shell-{hub,pulse,service,control}` - быстрый доступ к каждой БД

**Важно:** Все отступы выполнены через табуляцию (Tab) для корректной работы Make.

### 2. TypeScript (tsconfig.base.json)

Создан базовый конфигурационный файл TypeScript со строгими правилами:
- `strict: true` - включение всех строгих проверок
- `noImplicitAny: true` - запрет неявных any типов
- `esModuleInterop: true` - совместимость с CommonJS
- `skipLibCheck: true` - пропуск проверки declaration файлов
- Настроены path aliases для общих библиотек (@app/contracts, @app/ui-kit, @app/core-backend)

### 3. ESLint (.eslintrc.js)

Настроен ESLint с поддержкой TypeScript и Prettier:
- Parser: @typescript-eslint/parser
- Плагины: @typescript-eslint, prettier
- Rules:
  - Запрет `any` типа (no-explicit-any)
  - Предупреждение о console.log
  - Игнорирование переменных с префиксом `_`
- Отдельные правила для тестовых файлов (*.spec.ts, *.test.ts)

### 4. Prettier (.prettierrc)

Единый стиль кодирования:
- Semi-colons: включены
- Trailing commas: все
- Single quotes: включены
- Print width: 100 символов
- Tab width: 2 пробора (но используются пробелы, не табы)

### 5. Jest (jest.config.js)

Настроен Jest с поддержкой TypeScript через ts-jest:
- Preset: ts-jest
- Test environment: node
- Pattern: **/*.spec.ts, **/*.test.ts
- Coverage directory: ./coverage
- Module name mapper для path aliases из tsconfig

### 6. Зависимости

Добавлены в корневой package.json (devDependencies):
- jest, ts-jest, @types/jest - тестирование
- typescript - компилятор TypeScript
- eslint, @typescript-eslint/* - линтинг
- prettier, eslint-plugin-prettier, eslint-config-prettier - форматирование

### 7. Игнорирование файлов

Созданы .gitignore и .eslintignore для исключения:
- node_modules, dist, coverage
- .env файлов
- OS-specific файлов (.DS_Store)
- IDE конфиигаов

## Последствия

### Положительные
- Единый стиль кода across всех сервисов
- Строгая типизация предотвращает ошибки
- Удобное управление через Makefile
- Автоматическая проверка качества кода
- Поддержка тестирования из коробки

### Отрицательные
- Дополнительные devDependencies в корне
- Необходимость синхронизации конфигов между сервисами

## Альтернативы

Рассматривался вариант с отдельными конфигами для каждого сервиса, но отклонен в пользу централизованного управления для обеспечения консистентности.
