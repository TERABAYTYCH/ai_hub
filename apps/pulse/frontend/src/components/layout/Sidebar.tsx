import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

/** Элемент меню навигации */
export interface MenuItem {
  /** Название пункта меню */
  title: string;
  /** Путь для навигации */
  path: string;
  /** Иконка (опционально, например bi bi-grid) */
  icon?: string;
}

interface SidebarProps {
  /** Массив элементов меню */
  menuItems: MenuItem[];
  /** Путь по умолчанию для активной ссылки */
  defaultPath?: string;
}

/**
 * Компонент боковой панели (Sidebar) с навигацией.
 * Принимает массив элементов меню и подсвечивает активный элемент.
 * Поддерживает светлую и темную тему.
 */
export function Sidebar({ menuItems, defaultPath = '/' }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === defaultPath) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Nav
      className="flex-column p-3"
      style={{
        minHeight: '100%',
        width: '220px',
        backgroundColor: 'var(--bs-body-bg)',
        borderRight: '1px solid var(--bs-border-color)',
      }}
    >
      {menuItems.map((item) => (
        <Nav.Link
          key={item.path}
          as={Link}
          to={item.path}
          className={`mb-1 rounded ${isActive(item.path) ? 'bg-primary text-white' : 'text-body'}`}
          style={{ padding: '10px 15px' }}
        >
          {item.icon && <i className={`${item.icon} me-2`}></i>}
          {item.title}
        </Nav.Link>
      ))}
    </Nav>
  );
}
