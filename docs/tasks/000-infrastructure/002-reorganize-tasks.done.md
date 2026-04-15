# Task 002: Реорганизация структуры управления задачами - DONE

## Выполненные действия

### Шаг 1: Создание структуры директорий ✅

Созданы папки:

- `docs/tasks/000-infrastructure/` - для задач по Docker, CI/CD, корневым конфигам
- `docs/tasks/100-hub/` - для задач ядра (frontend + backend)
- `docs/tasks/200-pulse/` - для задач сервиса мониторинга
- `docs/tasks/300-service/` - для задач сервиса обслуживания
- `docs/tasks/400-control/` - для задач сервиса управления

Добавлены `.gitkeep` файлы в `100-hub`, `200-pulse`, `300-service`, `400-control`.

### Шаг 2: Перемещение существующих задач и отчетов ✅

Перемещены файлы из корня `docs/tasks/`:

- `002-reorganize-tasks.md` → `docs/tasks/000-infrastructure/002-reorganize-tasks.md`
- `001-init.md` → `docs/tasks/000-infrastructure/001_init.md` (уже была)
- `001-fixup.md` → `docs/tasks/000-infrastructure/001_fixup.md` (уже была)
- `001-fixup-configs.md` → `docs/tasks/000-infrastructure/001_fixup_configs.md` (уже была)

Перемещены отчеты из `docs/tasks/reports/`:

- `001-init.done.md` → `docs/tasks/000-infrastructure/001-init.done.md`
- `001-fixup.done.md` → `docs/tasks/000-infrastructure/001-fixup.done.md`
- `001-fixup-configs.done.md` → `docs/tasks/000-infrastructure/001-fixup-configs.done.md`

Удалена пустая директория `docs/tasks/reports/`.

### Шаг 3: Обновление документации состояния ✅

Обновлен файл `docs/04-current-state.md` с записью о реорганизации структуры задач.

## Результаты проверок

- ✅ Директории созданы корректно
- ✅ Все задачи находятся в доменных папках
- ✅ Все отчеты лежат рядом со своими задачами (колокация)
- ✅ Директория `reports/` удалена

## Получившееся дерево директории

```
docs/tasks/
├── 000-infrastructure/
│   ├── 001-init.md
│   ├── 001-init.done.md
│   ├── 001-fixup.md
│   ├── 001-fixup.done.md
│   ├── 001-fixup-configs.md
│   ├── 001-fixup-configs.done.md
│   └── 002-reorganize-tasks.md
├── 100-hub/
│   └── .gitkeep
├── 200-pulse/
│   └── .gitkeep
├── 300-service/
│   └── .gitkeep
└── 400-control/
    └── .gitkeep
```

## Сложности

Особых сложностей не возникло. Структура была частично уже создана ранее (файлы задач в `000-infrastructure/`), потребовалось только переместить основной файл задачи и отчеты.

## Commit message

```
chore(docs): reorganize tasks structure and apply colocation for reports
```
