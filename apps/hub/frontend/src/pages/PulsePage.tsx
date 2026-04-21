import React, { Suspense, lazy } from 'react';

/** Компонент заглушка на время загрузки */
function LoadingFallback() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '400px' }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

/**
 * Страница Pulse - загружает удаленный модуль Dashboard через Module Federation.
 */
const PulsePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const PulseDashboard = lazy(() => import('pulse/Dashboard'));

  return (
    <Suspense fallback={<LoadingFallback />}>
      <PulseDashboard />
    </Suspense>
  );
};

export default PulsePage;
