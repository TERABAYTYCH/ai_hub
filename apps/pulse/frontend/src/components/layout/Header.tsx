import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@ject-hub/ui-kit';

interface HeaderProps {
  /** Название сервиса */
  serviceName?: string;
  /** Имя пользователя */
  username?: string;
  /** Callback для логаута */
  onLogout?: () => void;
}

/**
 * Компонент верхней панели (Header) для Pulse приложения.
 * Содержит логотип, название сервиса, переключатель темы и меню пользователя.
 */
export function Header({ serviceName = 'Pulse', username, onLogout }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    // Очищаем токены из localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand href="#">
          <i className="bi bi-activity me-2"></i>
          {serviceName}
        </Navbar.Brand>
        <Nav className="ms-auto d-flex align-items-center">
          <ThemeToggle />
          {username && (
            <Dropdown align="end" className="ms-3">
              <Dropdown.Toggle variant="outline-light" id="user-dropdown">
                <i className="bi bi-person-circle me-1"></i>
                {username}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
