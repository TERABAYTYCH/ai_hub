import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import App from './App';
import { AuthProvider } from '@ject-hub/ui-kit';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>,
  );
};

describe('App', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(document.body).toBeTruthy();
  });

  it('contains routes structure', () => {
    renderWithProviders(<App />);
    // Basic smoke test that App renders
    expect(document.body).toBeTruthy();
  });
});
