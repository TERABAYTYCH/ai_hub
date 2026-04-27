# Ject Hub - Development Guide

Платформа микросервисов с аутентификацией, мониторингом и управлением задачами.

## Архитектура

### Сервисы

| Сервис | URL | Описание |
|--------|-----|----------|
| Hub | http://hub.lvh.me | Аутентификация, лицензии, управление доступом |
| Pulse | http://pulse.lvh.me | Мониторинг, метрики, графики |
| Service | http://service.lvh.me | Задачи на обслуживание, фотоотчёты |
| API | http://api.hub.lvh.me | Central API Gateway (Hub Backend) |

### Базы данных (MySQL)

- **Hub DB** - порт 33061 (хост: mysql-hub)
- **Pulse DB** - порт 3307 (хост: mysql-pulse)
- **Service DB** - порт 3308 (хост: mysql-service)
- **Control DB** - порт 3309 (хост: mysql-control)

### Брокер сообщений

- **Kafka** - порт 9092 (KRaft mode, без ZooKeeper)

### Frontends (Vite Dev Servers)

- Hub Frontend: http://localhost:5173
- Pulse Frontend: http://localhost:5174
- Service Frontend: http://localhost:5175

### Backends (NestJS)

- Hub Backend: http://localhost:3000
- Pulse Backend: http://localhost:3001
- Service Backend: http://localhost:3002

## Быстрый старт

### 1. Предварительные требования

- Docker и Docker Compose v2+
- Node.js v20+ (для локальной разработки)
- Yarn v1.x
- hosts записи для доменов .lvh.me

### 2. Установка зависимостей

```bash
yarn install
```

### 3. Настройка окружения

```bash
cp .env.example .env
```

### 4. Запуск баз данных

```bash
docker compose up -d mysql-hub mysql-pulse mysql-service mysql-control kafka
```

### 5. Запуск всех сервисов

```bash
docker compose up -d
```

### 6. Проверка

Откройте в браузере:
- http://hub.lvh.me - Hub (войдите как admin@ject.hub / admin)
- http://pulse.lvh.me - Pulse
- http://service.lvh.me - Service

## Команды Makefile

```bash
make docker-up          Запуск всех контейнеров
make docker-down        Остановка всех контейнеров
make docker-logs        Просмотр логов
make db-shell-hub      MySQL shell для Hub
make build-all         Сборка всех сервисов
make lint-all          Линтинг
make dev-all           Dev режим
make test-all          Тесты
make typecheck-all     Проверка типов
```

## Структура проекта

```
ject_hub/
├── apps/
│   ├── hub/
│   │   ├── backend/          NestJS (port 3000)
│   │   └── frontend/         React/Vite (port 5173)
│   ├── pulse/
│   │   ├── backend/          NestJS (port 3001)
│   │   └── frontend/         React/Vite (port 5174)
│   └── service/
│       ├── backend/          NestJS (port 3002)
│       └── frontend/         React/Vite (port 5175)
├── libs/
│   ├── contracts/            DTO и типы
│   ├── ui-kit/              Общие React компоненты
│   └── core-backend/         Общие утилиты NestJS
├── nginx/                   Конфигурация Nginx
├── docker-compose.yml       Docker Compose конфигурация
├── turbo.json              Turborepo конфигурация
└── Makefile                Команды Make
```

## Полезные команды

### Миграции базы данных

```bash
yarn workspace @ject-hub/hub-backend typeorm:migration:run
```

### Проверки кода

```bash
yarn typecheck
yarn lint
yarn test
```

## Технический стек

- **Backend:** NestJS + TypeORM + MySQL
- **Frontend:** React 18 + Vite + React Router v7
- **UI Kit:** Bootstrap 5 + React Bootstrap
- **Message Broker:** Apache Kafka (KRaft)
- **Gateway:** Nginx
- **Containerization:** Docker + Docker Compose
- **Build:** Turborepo + Yarn Workspaces
