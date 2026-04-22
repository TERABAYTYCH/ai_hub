import '@testing-library/jest-dom';

// Re-export to make types available
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeVisible(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveClass(className: string): R;
    }
  }
}

export {};
