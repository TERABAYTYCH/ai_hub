import React from 'react';

/**
 * Service Dashboard - главная страница Service после авторизации.
 * Заглушка - показывает базовую информацию.
 */
function ServiceDashboard() {
  return (
    <div className="container mt-4">
      <h1>Service Dashboard</h1>
      <p>Добро пожаловать в Service - система обслуживания.</p>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Задачи</h5>
              <p className="card-text">Управление задачами на обслуживание</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Фотоотчеты</h5>
              <p className="card-text">Фотоотчеты выполненных работ</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Устройства</h5>
              <p className="card-text">Список устройств для обслуживания</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDashboard;
