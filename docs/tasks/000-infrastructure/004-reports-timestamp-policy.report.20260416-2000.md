# Task 000-infrastructure/004: Reports Timestamp Policy - Report

## Date: 2026-04-16

## Completed Tasks

### 1. Updated documentation (03-execution-pipeline.md)

**Modified:** `docs/03-execution-pipeline.md`

Added strict naming rule for report files:

- Format: `[имя-задачи].report.[YYYYMMDD-HHMM].md`
- Example: `001-init.report.20260415-1200.md`
- Usage without date is FORBIDDEN

Also fixed duplicate "Шаг 5" section.

### 2. Renamed existing reports

All reports in `docs/tasks/` have been renamed with timestamps:

**Infrastructure (000-infrastructure/):**

- `001-init.report.md` → `001-init.report.20260415-1200.md`
- `001-fixup.report.md` → `001-fixup.report.20260415-1500.md`
- `001-fixup-configs.report.md` → `001-fixup-configs.report.20260415-1600.md`
- `002-reorganize-tasks.report.md` → `002-reorganize-tasks.report.20260415-1800.md`
- `003-shared-ui-bootstrap.report.md` → `003-shared-ui-bootstrap.report.20260416-1930.md`

**Hub (100-hub/):**

- `001-init.report.md` → `001-init.report.20260415-1400.md`
- `002-run-and-migrations.report.md` → `002-run-and-migrations.report.20260416-1600.md`
- `003-auth-implementation.report.md` → `003-auth-implementation.report.20260416-1900.md`

### 3. Verification

```bash
# No files ending with .report.md (without date) found
$ find docs/tasks -name "*.report.md"
# No results
```

All reports now follow the format `[task-name].report.[YYYYMMDD-HHMM].md`.

## Acceptance Criteria

- [x] `03-execution-pipeline.md` updated with new naming rule
- [x] No files ending with `.report.md` (without date) in `docs/tasks/`
- [x] All old reports successfully renamed with timestamps
- [x] This report created with new format: `004-reports-timestamp-policy.report.20260416-2000.md`

### 4. Fixed duplicate contracts structure and TypeScript rootDir issues

**Issue discovered:** There were two copies of contracts in `libs/contracts/`:

- `libs/contracts/hub/` (old duplicate structure)
- `libs/contracts/src/hub/` (correct structure)

Also, TypeScript error `TS6059` appeared because `@app/contracts/hub/auth` imports were not under the backend's `rootDir`.

**Fixes applied:**

1. **Removed duplicate contracts:** Deleted `libs/contracts/hub/`, `libs/contracts/index.ts`, `libs/contracts/package.json` - kept only `libs/contracts/src/` structure

2. **Fixed tsconfig:** Added `"rootDir": "."` to `tsconfig.base.json` to resolve path aliases correctly across workspace packages

3. **Fixed backend exports:** Updated `apps/hub/backend/src/auth/index.ts` to export correct DTOs

4. **Fixed React types:** Added `@types/react` overrides to fix react-bootstrap compatibility

**Verification:**

```bash
cd apps/hub/backend && yarn typecheck  # ✅ Pass
cd apps/hub/frontend && npx tsc --noEmit  # ✅ Pass
```
