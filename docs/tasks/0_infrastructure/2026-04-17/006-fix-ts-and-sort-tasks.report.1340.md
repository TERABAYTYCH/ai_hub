# Задача infrastructure/006: Обновление TypeScript и реорганизация задач

**Дата:** 2026-04-17
**Завершено:** 2026-04-17T13:40
**Финализировано:** 2026-04-17T13:50

## Резюме

Обновлен TypeScript до v6.0.2 и реорганизована вся документация задач в папки с датами.

## Внесенные изменения

### 1. Обновление TypeScript

- **Обновлен** `package.json`: TypeScript с `^5.3.3` до `^6.0.2`
- **Изменен** `tsconfig.base.json`: `moduleResolution` с `node10` на `node`
- **Добавлен** `lib: ["ES2021", "DOM", "DOM.Iterable"]` в `libs/ui-kit/tsconfig.json` для DOM типов
- **Примечание:** Опция `ignoreDeprecations` не распознается TS 6.0.2 в данном контексте проекта

### 2. Реорганизация папок

Переименованы папки доменов с использованием префиксного формата:

- `000-infrastructure` → `0_infrastructure`
- `100-hub` → `1_hub`
- `200-pulse` → `2_pulse`
- `300-service` → `3_service`
- `400-control` → `4_control`

### 3. Хранение задач по датам

Созданы папки с датами и перемещены все файлы задач:

**0_infrastructure/**

- `2026-04-15/`: 001-init, 001-fixup, 001-fixup-configs, 002-reorganize-tasks
- `2026-04-16/`: 003-shared-ui-bootstrap, 004-reports-timestamp-policy, 005-docker-dev-environment
- `2026-04-17/`: 006-fix-ts-and-sort-tasks

**1_hub/**

- `2026-04-15/`: 001-init
- `2026-04-16/`: 002-run-and-migrations, 003-auth-implementation, 004-auth-completion, 004-1 through 004-4

### 4. Добавлено глобальное правило

Создан `docs/tasks/README.md` с правилом хранения задач.

## Проверка

```bash
yarn typecheck  # УСПЕХ
yarn lint       # УСПЕХ (0 ошибок, 4 предупреждения)
```

## Измененные файлы

- `package.json`
- `tsconfig.base.json`
- `libs/ui-kit/tsconfig.json`
- `docs/tasks/README.md` (создан)
- Несколько файлов задач перемещены в папки с датами
- `docs/tasks/0_infrastructure/2026-04-17/006-fix-ts-and-sort-tasks.md` (воссоздан)

## Дополнительные работы

**Дополнительный запрос - Переименование папок в формат 0\_<domain>**
Выполнено - Переименованы папки доменов: `infrastructure` → `0_infrastructure`, `hub` → `1_hub`, `pulse` → `2_pulse`, `service` → `3_service`, `control` → `4_control`

**Дополнительный запрос - Восстановление отсутствующего файла задачи и перезапуск Docker**
Выполнено - Воссоздан файл задачи `006-fix-ts-and-sort-tasks.md`, перезапущены Docker контейнеры после проблемы с Vite cache (504 Outdated Optimize Dep), проверены все сервисы

**Дополнительный запрос - Обновить AGENT.md с новыми правилами**
Выполнено - Обновлен `AGENT.md`: добавлено правило о русском языке для task.md и task.report.md, добавлен пункт 10 о формате дополнительных работ

**Дополнительный запрос - Перевести report на русский язык**
Выполнено - Весь отчет переведен на русский язык

**Дополнительный запрос - Убрать даты из названий всех task.report.md**
Выполнено - Переименованы все 16 report файлов в формат `*.report.[HHMM].md`

**Дополнительный запрос - Перевести docs/tasks/README.md на русский**
Выполнено - README.md переведен на русский язык

**Дополнительный запрос - Обновить docs/03-execution-pipeline.md**
Выполнено - Обновлены форматы путей, папки приведены к формату 0\_<domain>
