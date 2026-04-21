# Task 016 - Исправление динамического импорта

**Дата:** 2026-04-21  
**Домен:** Hub (1_hub)  
**Статус:** ✅ Завершено

---

## Проблема

Динамический `import('pulse/Dashboard')` не работает - Vite не может статически анализировать строки.

---

## Решение

Использован Federation Runtime API (`@originjs/vite-plugin-federation/runtime`).

### Изменения в `apps/hub/frontend/src/App.tsx`:

**1. Добавлен импорт:**
```typescript
import { loadRemoteModule } from '@originjs/vite-plugin-federation/runtime';
```

**2. Переписана функция загрузки модулей:**
```typescript
const loadModule = (serviceId: string, modulePath: string): Promise<FederatedModule> => {
  const moduleName = modulePath.replace('./', '');
  return loadRemoteModule(serviceId, `./${moduleName}`) as Promise<FederatedModule>;
};

const moduleCache = new Map<string, Promise<FederatedModule>>();

const getModule = (serviceId: string, modulePath: string): Promise<FederatedModule> => {
  const key = `${serviceId}:${modulePath}`;
  if (!moduleCache.has(key)) {
    moduleCache.set(key, loadModule(serviceId, modulePath));
  }
  return moduleCache.get(key)!;
};
```

**3. Переписан LazyModule компонент:**
```typescript
const LazyModule: React.FC<LazyModuleProps> = ({ serviceId, modulePath }) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getModule(serviceId, modulePath)
      .then((mod) => {
        setComponent(() => mod.default);
      })
      .catch((err: Error) => {
        console.error('Failed to load module:', serviceId, modulePath, err);
        setError(err);
      });
  }, [serviceId, modulePath]);

  if (error) return <div className="text-danger p-4">Error loading module</div>;
  if (!Component) return <div className="text-center p-4">Loading module...</div>;
  return <Component />;
};
```

**4. Удалён старый `createModuleLoader` и `React.lazy`**

---

## Верификация

```bash
yarn lint --filter=@ject-hub/hub-frontend  # ✅ Passed
docker compose restart hub-frontend        # ✅ Restarted
```

---

## Изменённые файлы

- `apps/hub/frontend/src/App.tsx` — полностью переписан механизм загрузки federated modules

---

## Доработки

**Доработка #1 - 2026-04-21, Использование Federation Runtime API**

- Реализована загрузка модулей через `loadRemoteModule` вместо `/* @vite-ignore */`
- Добавлено кеширование загруженных модулей в `moduleCache`
- Компонент `LazyModule` теперь использует `useEffect` + `useState` вместо `React.lazy`
