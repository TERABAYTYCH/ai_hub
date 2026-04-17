import React, { Suspense } from 'react';

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
 * Страница Pulse - загружает удаленный модуль PulseDashboard через Module Federation.
 * Использует React.lazy для динамической загрузки удаленного компонента.
 */
function PulsePage() {
  // Динамический импорт remote модуля pulse через Module Federation
  const PulseDashboard = React.lazy(() => import('pulse/PulseDashboard'));

  return (
    <Suspense fallback={<LoadingFallback />}>
      <PulseDashboard />
    </Suspense>
  );
}

export default PulsePage;
