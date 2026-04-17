import { ReactNode } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Header } from './Header';
import { Sidebar, MenuItem } from './Sidebar';

interface AppLayoutProps {
  /** Дочерние элементы (контент страницы) */
  children: ReactNode;
  /** Массив элементов меню для сайдбара */
  menuItems: MenuItem[];
  /** Название сервиса (отображается в header) */
  serviceName?: string;
  /** Имя пользователя (отображается в header) */
  username?: string;
  /** Callback для логаута */
  onLogout?: () => void;
}

/**
 * Компонент-обертка для полноэкранного layout приложения Pulse.
 * Объединяет Header, Sidebar и контент в единую структуру.
 * Занимает 100vh и обеспечивает независимый скроллинг контента.
 */
export function AppLayout({
  children,
  menuItems,
  serviceName = 'Pulse',
  username,
  onLogout,
}: AppLayoutProps) {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header serviceName={serviceName} username={username} onLogout={onLogout} />
      <Row className="flex-grow-1 g-0" style={{ overflow: 'hidden' }}>
        <Col xs="auto" className="p-0" style={{ height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <Sidebar menuItems={menuItems} />
        </Col>
        <Col className="p-3" style={{ height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          {children}
        </Col>
      </Row>
    </div>
  );
}
