# Задача: Инициализация монорепозитория и базовой инфраструктуры

## Контекст

Мы начинаем разработку проекта с нуля. Нам необходимо настроить корневую структуру монорепозитория с использованием Yarn Workspaces и Turborepo, а также подготовить базовый `docker-compose.yml` для локальной разработки.

## Требования к реализации

### 1. Настройка Yarn Workspaces и Turborepo

- Создай корневой `package.json`.
- Настрой `workspaces`, включив туда папки `apps/*/*` (чтобы фронтенды и бэкенды были отдельными пакетами) и `libs/*`.
- Добавь базовый `turbo.json` с тасками `build`, `lint`, `dev` и `typecheck`.

### 2. Создание структуры директорий

Создай пустые папки (или папки с файлом `.gitkeep`), чтобы зафиксировать структуру:

- `apps/hub/frontend`, `apps/hub/backend`
- `apps/pulse/frontend`, `apps/pulse/backend`
- `apps/service/frontend`, `apps/service/backend`
- `apps/control/frontend`, `apps/control/backend`
- `libs/contracts`, `libs/ui-kit`, `libs/core-backend`
- `nginx`

### 3. Базовая инфраструктура Docker

Создай корневой `docker-compose.yml`. На данном этапе в нем должны быть:

- **MySQL**: Один контейнер MySQL 8, но с инициализацией 4-х разных баз данных (hub_db, pulse_db, service_db, control_db) через скрипт в `docker-entrypoint-initdb.d/` или отдельные контейнеры (выбери оптимальный вариант для локальной разработки с точки зрения потребления ресурсов и опиши свой выбор).
- **Kafka**: Контейнеры для Kafka и Zookeeper (или KRaft).
- **Nginx**: Заглушка для API Gateway (проброс порта 80).

## Ожидаемый результат

Выполни шаги согласно нашему пайплайну (`docs/04-execution-pipeline.md`). Сгенерируй необходимые конфигурационные файлы, проверь их валидность и подготовь сообщение для первого коммита.
