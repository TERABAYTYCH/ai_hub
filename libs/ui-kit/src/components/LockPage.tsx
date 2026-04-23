interface LockPageProps {
  serviceName?: string;
}

/**
 * LockPage - displayed when user tries to access a locked microservice.
 * Shows lock icon and message.
 */
export function LockPage({ serviceName = 'модуль' }: LockPageProps) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <i className="bi bi-lock" style={{ fontSize: '5rem', color: '#6c757d' }}></i>
      <h2 className="mt-4">Модуль недоступен</h2>
      <p className="text-muted">
        Для активации {serviceName} обратитесь к администратору
      </p>
    </div>
  );
}
