import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useTheme } from '../../theme/ThemeProvider';
import './Header.css';

interface HeaderProps {
  /** Название сервиса для отображения в header */
  serviceName?: string;
  /** Имя пользователя для отображения */
  username?: string;
  /** Callback для кнопки логаута */
  onLogout?: () => void;
}

/**
 * Компонент верхней панели (Header) для приложения.
 * Отображает название сервиса, имя пользователя, переключатель темы и кнопку выхода.
 * Поддерживает светлую и темную тему.
 */
export function Header({ serviceName = 'App', username, onLogout }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Navbar style={{ height: '56px', backgroundColor: 'var(--bs-body-tertiary)', borderBottom: '1px solid var(--bs-border-color)' }}>
      <Container fluid>
        <Navbar.Brand href="#">{serviceName}</Navbar.Brand>
        <Nav className="ms-auto align-items-center">
          {username && (
            <span className="me-3" style={{ color: 'var(--bs-body-color)' }}>{username}</span>
          )}
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={toggleTheme}
            className="me-2 header-btn"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? (
              <i className="bi bi-moon"></i>
            ) : (
              <i className="bi bi-sun"></i>
            )}
          </Button>
          {onLogout && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={onLogout}
              className="header-btn"
            >
              Logout
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
