import { Button } from 'react-bootstrap';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="light"
      size="sm"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className="d-flex align-items-center justify-content-center"
      style={{ width: '32px', height: '32px', borderRadius: '50%' }}
    >
      {theme === 'light' ? (
        <i className="bi bi-moon" style={{ fontSize: '1rem' }}></i>
      ) : (
        <i className="bi bi-sun" style={{ fontSize: '1rem' }}></i>
      )}
    </Button>
  );
}
