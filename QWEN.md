# Global AI Rules

## 1. LANGUAGE FOR DOCUMENTATION:

You MUST write all Architecture Decision Records (ADR), State files (like `04-current-state.md`), and JSDoc comments in RUSSIAN.
Never use English for project documentation and architecture logs.

## 2. LANGUAGE FOR CODE:

All code, variables, function names, and Git commit messages MUST be in ENGLISH.

## 3. BEFORE ANY TASK:

Always read `docs/01-tech-stack.md`, `docs/02-architecture-map.md`, `docs/03-execution-pipeline.md` and `docs/04-current-state.md` before executing any new task to understand the context.

## 4. Твоя роль

Ты — Senior Fullstack Architect & Developer. Твоя задача — писать чистый, модульный, production-ready код. Ты не задаешь лишних вопросов, если контекст понятен, но ОБЯЗАН остановиться и спросить, если требования противоречат архитектуре.

## 5. Права доступа к директориям (Изоляция)

Ты работаешь строго в рамках того контекста, который тебе передан.

- **Если задача касается `apps/pulse`:** Тебе ЗАПРЕЩЕНО изменять файлы в `apps/hub`, `apps/service` или `apps/control`.
- **Папка `libs/` (Общий код):** Считай эту папку Read-Only, если в текущем промпте явно не сказано "добавь новый DTO в контракты" или "обнови ui-kit".
- **Изменение БД:** Если ты меняешь или создаешь сущности TypeORM (`*.entity.ts`) в любом из сервисов, ты обязан подготовить или сгенерировать миграцию, но не применять её к чужим базам.

## 6. Правила работы с Docker и БД

- При добавлении нового сервиса или базы данных ты ОБЯЗАН обновить корневой `docker-compose.yml`.
- Убедись, что порты не конфликтуют (например, у каждого сервиса свой контейнер MySQL или своя БД внутри одного контейнера).
- Базы данных не должны "торчать" наружу без необходимости (используй проброс портов только для локальной отладки).
- Dockerfile для разработки должен использовать `yarn run start:dev` (или `dev` для Vite) и монтировать исходный код через volumes для hot-reload.

## 7. Принципы генерации кода

- **Не ломай существующее:** Если ты видишь импорты или функции, которые не понимаешь, не удаляй их.
- **Без заглушек:** Пиши полные реализации функций. Не используй комментарии вида `// here is your logic`, пиши саму логику.
- **Самодокументируемость:** Все публичные методы в сервисах и сложные DTO должны сопровождаться кратким JSDoc комментарием на русском языке.

## 8. Язык документации и общения

- Все архитектурные решения (ADR), файлы состояния (State) и комментарии к сложной бизнес-логике (JSDoc) должны писаться СТРОГО на русском языке.
- Твои ответы в чате и объяснения кода также должны быть на русском языке.
- Сообщения для коммитов (Conventional Commits), названия переменных, функций и таблиц в БД всегда остаются на английском.

# Ject Hub - Microservices Platform

## Project Overview

This is a **microservices-based platform** built as a monorepo using Yarn Workspaces and Turborepo. The project implements a modular architecture with multiple independent services, each consisting of a frontend and backend component.

**Current State:** Project initialization phase - documentation and architecture defined, code structure not yet created.

### Architecture

The platform follows a microservices pattern with:

- **4 Core Services:**
    - **Hub** (Port 3000): Authentication, licenses, master device database
    - **Pulse** (Port 3001): Monitoring, metrics collection, charts
    - **Service** (Port 3002): Maintenance tasks, photo reports
    - **Control** (Port 3003): Device command management

- **Shared Libraries:**
    - `libs/contracts`: DTO and type definitions (single source of truth)
    - `libs/ui-kit`: Shared React components
    - `libs/core-backend`: Common NestJS utilities (Auth Guards, Kafka Client)

- **Infrastructure:**
    - MySQL databases (one per service)
    - Kafka message broker (KRaft mode, no ZooKeeper)
    - Nginx API Gateway

### Technology Stack

- **Language:** TypeScript (strict mode enabled everywhere)
- **Backend:** NestJS (Express-based)
- **Frontend:** React + Vite with Module Federation
- **Database:** MySQL with TypeORM
- **Message Broker:** Kafka
- **Package Manager:** Yarn (Workspaces + Turborepo) - **npm/pnpm are NOT allowed**
- **Infrastructure:** Docker & Docker Compose

## Directory Structure

```
ject_hub/
├── docs/                          # System documentation
│   ├── 01-tech-stack.md          # Technology stack and coding rules
│   ├── 02-architecture-map.md    # Architecture and service communication
│   ├── 03-execution-pipeline.md  # Task execution workflow
│   └── tasks/                    # Task definitions and reports
│       └── 001-init.md           # Initialization task
├── Makefile.example              # Docker and development commands template
├── QWEN.md                       # This file
└── README.md                     # Project overview
```

**Expected structure after initialization (per task 001-init.md):**

```
├── docker-compose.yml            # Main orchestration (DBs, Kafka, Nginx, services)
├── nginx/                        # API Gateway configuration
├── apps/
│   ├── hub/{frontend,backend}/   # Core service
│   ├── pulse/{frontend,backend}/ # Monitoring service
│   ├── service/{frontend,backend}/ # Maintenance service
│   └── control/{frontend,backend}/ # Control service
├── libs/
│   ├── contracts/                # Shared DTOs and types
│   ├── ui-kit/                   # Shared React components
│   └── core-backend/             # Shared NestJS utilities
├── package.json                  # Root workspace configuration
└── turbo.json                    # Turborepo configuration
```

## Building and Running

**Status:** Not yet implemented - currently in planning stage.

Based on `Makefile.example`, the expected workflow will be:

### Initial Setup

```bash
make setup              # Copy .env.example and build images
make setup-run          # Build and initialize databases
```

### Development

```bash
make dev-up             # Start dev environment with hot-reload
make dev-down           # Stop dev environment
make dev-logs           # View logs
make dev-shell          # Open shell in dev container
make dev-rebuild        # Rebuild and restart
```

### Production

```bash
make prod-up            # Start production environment
make prod-rebuild       # Rebuild and restart production
```

### Testing & Linting (will be run via Turborepo)

```bash
yarn lint               # Run ESLint
yarn typecheck          # Run TypeScript type checking
yarn test               # Run unit tests
yarn build              # Build all services
```

### Database Management

```bash
make db-shell           # Open MySQL shell
make db-dump            # Create database dump
make db-restore         # Restore from dump
```

## Development Conventions

### Strict Rules (from documentation)

1. **No `any` type allowed** - Use `unknown` or define interfaces
2. **No `@ts-ignore`** - Only allowed with `// FIXME:` comment in extreme cases
3. **Shared interfaces only from `libs/contracts`** - No duplication across services
4. **Database isolation** - Services cannot access other services' databases directly
5. **Thin controllers** - All business logic in `*.service.ts` files
6. **No direct cross-service API calls** - Frontend must go through Nginx API Gateway
7. **Async communication via Kafka only** - Backend services communicate asynchronously
8. **JWT validation** - Services validate tokens locally via `core-backend` library

### Workflow Pipeline

All tasks follow a strict 5-step process:

1. **Analysis & Planning** - Review requirements, propose architectural changes if needed
2. **Code & Tests** - Implement features with mandatory unit tests (`*.spec.ts`)
3. **Automatic Verification** - Run lint, typecheck, tests, and Docker checks
4. **Documentation Update** - Update ADRs and state files
5. **Report Generation** - Create `.done.md` report and prepare git commit message

### Git & Commits

- User handles all Git operations manually
- Agent provides commit messages but does NOT execute git commands
- Commit messages follow Conventional Commits format
- Language: English for code/commits, Russian for documentation/JSDoc

## Key Files

- **`docs/01-tech-stack.md`**: Technology stack and coding rules (read before any task)
- **`docs/02-architecture-map.md`**: Service structure and communication patterns
- **`docs/03-execution-pipeline.md`**: Mandatory workflow for all tasks
- **`docs/tasks/001-init.md`**: Current active task - repository initialization
- **`Makefile.example`**: Template for Docker management commands

## Current State

**Phase:** Documentation complete, awaiting code implementation

**Next Steps:** Execute task `001-init.md` to:

1. Set up Yarn Workspaces and Turborepo
2. Create directory structure for all services and libraries
3. Configure `docker-compose.yml` with MySQL databases, Kafka, and Nginx
4. Establish base infrastructure for local development

**Important:** No code exists yet - this is a greenfield project with comprehensive architecture documentation ready for implementation.
