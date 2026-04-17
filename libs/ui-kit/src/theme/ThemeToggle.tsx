import { Button } from 'react-bootstrap';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline-secondary"
      size="sm"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <i className="bi bi-moon"></i>
      ) : (
        <i className="bi bi-sun"></i>
      )}
    </Button>
  );
}
