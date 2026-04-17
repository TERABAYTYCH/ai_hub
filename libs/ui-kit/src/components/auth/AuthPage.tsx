import { ReactNode } from 'react';
import { Container, Card } from 'react-bootstrap';
import { ThemeToggle } from '../../theme/ThemeToggle';
import './AuthPage.css';

export interface AuthPageProps {
  /** Заголовок страницы */
  title: string;
  /** Дочерние элементы (форма) */
  children: ReactNode;
  /** Иконка для заголовка (опционально) */
  icon?: string;
}

/**
 * Универсальная обертка для страниц авторизации.
 * Обеспечивает консистентный внешний вид: фон, карточку, заголовок с кнопкой темы.
 */
export function AuthPage({ title, children, icon }: AuthPageProps) {
  return (
    <div className="auth-page-wrapper">
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '100vh' }}
      >
        <Card className="auth-card shadow">
          <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white py-3">
            <span className="d-flex align-items-center gap-2">
              {icon && <i className={icon} />}
              <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{title}</span>
            </span>
            <ThemeToggle />
          </Card.Header>
          <Card.Body className="p-4">{children}</Card.Body>
        </Card>
      </Container>
    </div>
  );
}
