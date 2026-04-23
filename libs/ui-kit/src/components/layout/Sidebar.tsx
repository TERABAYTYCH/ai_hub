import { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

/**
 * Элемент меню навигации с поддержкой вложенности и блокировки.
 */
export interface MenuItem {
  /** Уникальный идентификатор элемента */
  id: string;
  /** Текстовая метка пункта меню */
  label: string;
  /** Иконка (опционально, например bi bi-grid) */
  icon?: string;
  /** Путь для навигации (опционально для родительских элементов) */
  path?: string;
  /** Дочерние элементы (для создания вложенного меню) */
  children?: MenuItem[];
  /** Заблокирован ли элемент */
  locked?: boolean;
  /** Отключен ли элемент */
  disabled?: boolean;
}

interface SidebarProps {
  /** Массив элементов меню */
  items: MenuItem[];
  /** Путь по умолчанию для активной ссылки */
  defaultPath?: string;
}

/**
 * Проверяет, является ли путь активным.
 */
function isActivePath(locationPathname: string, itemPath: string, defaultPath: string): boolean {
  if (itemPath === defaultPath) {
    return locationPathname === itemPath;
  }
  return locationPathname.startsWith(itemPath);
}

/**
 * Проверяет, активен ли какой-либо дочерний элемент.
 */
function hasActiveChild(locationPathname: string, children: MenuItem[], defaultPath: string): boolean {
  return children.some((child) => {
    if (child.path && isActivePath(locationPathname, child.path, defaultPath)) {
      return true;
    }
    if (child.children) {
      return hasActiveChild(locationPathname, child.children, defaultPath);
    }
    return false;
  });
}

/**
 * Находит id родительских элементов для текущего пути.
 */
function findExpandedParentIds(items: MenuItem[], currentPath: string, defaultPath: string): string[] {
  const expandedIds: string[] = [];

  for (const item of items) {
    if (item.children && item.children.length > 0) {
      const parentPath = item.path || '/' + item.id;
      if (currentPath.startsWith(parentPath + '/') || currentPath === parentPath) {
        expandedIds.push(item.id);
      }
      const childExpanded = findExpandedParentIds(item.children, currentPath, defaultPath);
      expandedIds.push(...childExpanded);
    }
  }

  return expandedIds;
}

/**
 * Компонент боковой панели (Sidebar) с навигацией и accordion-меню.
 * Поддерживает вложенные элементы с визуальной иерархией.
 * Подсвечивает только активный элемент.
 * Поддерживает светлую и темную тему.
 * Заблокированные элементы выглядят как disabled (opacity: 0.5), но кликабельны.
 */
export function Sidebar({ items, defaultPath = '/' }: SidebarProps) {
  const location = useLocation();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Auto-expand parent items when navigating to a child path
  useEffect(() => {
    const idsToExpand = findExpandedParentIds(items, location.pathname, defaultPath);
    if (idsToExpand.length > 0) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        idsToExpand.forEach((id) => next.add(id));
        return next;
      });
    }
  }, [location.pathname, items, defaultPath]);

  /**
   * Переключает состояние раскрытия для элемента с детьми.
   */
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  /**
   * Определяет, нужно ли показывать элемент как активный.
   */
  const getActiveState = (item: MenuItem): boolean => {
    if (item.path) {
      return isActivePath(location.pathname, item.path, defaultPath);
    }
    if (item.children) {
      return hasActiveChild(location.pathname, item.children, defaultPath);
    }
    return false;
  };

  /**
   * Рекурсивно рендерит элемент меню и его детей.
   */
  const renderMenuItem = (item: MenuItem, depth: number = 0): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedIds.has(item.id);
    const isItemActive = getActiveState(item);
    const isLocked = item.locked === true;
    const isDisabled = item.disabled === true && !isLocked; // disabled без locked - настоящий disabled

    // Отступ для вложенных элементов
    const paddingLeft = depth > 0 ? `${12 + depth * 16}px` : '12px';

    // Стиль для заблокированных элементов - выглядит как disabled, но кликабелен
    const lockedStyle = isLocked
      ? { opacity: 0.5 }
      : {};

    // Для заблокированных элементов с детьми - показываем как простой кликабельный Nav.Link
    if (isLocked && hasChildren) {
      return (
        <Nav.Link
          key={item.id}
          as={Link}
          to={item.path || '/'}
          className={`d-flex align-items-center rounded mb-1 ${isItemActive ? 'bg-primary text-white' : 'text-body'}`}
          style={{
            padding: '10px 12px 10px ' + paddingLeft,
            cursor: 'pointer',
            textDecoration: 'none',
            ...lockedStyle,
          }}
        >
          <i className="bi bi-lock me-2 flex-shrink-0"></i>
          <span className="flex-grow-1">{item.label}</span>
        </Nav.Link>
      );
    }

    if (hasChildren) {
      return (
        <div key={item.id}>
          {/* Родительский элемент с детьми */}
          <div
            onClick={() => !isDisabled && toggleExpand(item.id)}
            className={`d-flex align-items-center rounded mb-1 ${isItemActive ? 'bg-primary text-white' : 'text-body'}`}
            style={{
              padding: '10px 12px 10px ' + paddingLeft,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              userSelect: 'none',
              opacity: isDisabled ? 0.5 : 1,
            }}
          >
            <i className={`${item.icon || 'bi bi-circle'} me-2 flex-shrink-0`}></i>
            <span className="flex-grow-1">{item.label}</span>
            {/* Шеврон для индикации раскрытия - только если НЕ disabled */}
            {!isDisabled && (
              <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'} ms-2`} style={{ fontSize: '0.75rem' }}></i>
            )}
          </div>

          {/* Дочерние элементы с анимацией */}
          <div
            style={{
              overflow: 'hidden',
              maxHeight: isExpanded ? '500px' : '0',
              opacity: isExpanded ? 1 : 0,
              transition: 'max-height 0.2s ease-out, opacity 0.2s ease-out',
            }}
          >
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        </div>
      );
    }

    // Дочерний элемент без детей - всегда с link если есть path
    if (item.path) {
      return (
        <Nav.Link
          key={item.id}
          as={Link}
          to={item.path}
          className={`d-flex align-items-center rounded mb-1 ${isItemActive ? 'bg-primary text-white' : 'text-body'}`}
          style={{
            padding: '10px 12px 10px ' + paddingLeft,
            textDecoration: 'none',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.5 : 1,
            ...lockedStyle,
          }}
        >
          <i className={`${isLocked ? 'bi bi-lock' : item.icon || 'bi bi-circle'} me-2 flex-shrink-0`}></i>
          {item.label}
        </Nav.Link>
      );
    }

    // Элемент без path и без children (edge case)
    return (
      <div
        key={item.id}
        className={`d-flex align-items-center rounded mb-1 ${isItemActive ? 'bg-primary text-white' : 'text-body'}`}
        style={{
          padding: '10px 12px 10px ' + paddingLeft,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.5 : 1,
        }}
      >
        <i className={`${item.icon || 'bi bi-circle'} me-2 flex-shrink-0`}></i>
        {item.label}
      </div>
    );
  };

  return (
    <Nav
      className="flex-column p-3"
      style={{
        minHeight: '100%',
        width: '240px',
        backgroundColor: 'var(--bs-body-bg)',
        borderRight: '1px solid var(--bs-border-color)',
      }}
    >
      <style>{`
        .cursor-pointer { cursor: pointer; }
      `}</style>
      {items.map((item) => renderMenuItem(item))}
    </Nav>
  );
}
