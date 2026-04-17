import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@ject-hub/ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import PulseDashboard from './PulseDashboard';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PulseDashboard />} />
            <Route path="/pulse" element={<PulseDashboard />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>,
  );
}
