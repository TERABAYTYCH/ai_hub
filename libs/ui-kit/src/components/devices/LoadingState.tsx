import React from 'react';
import { Spinner } from 'react-bootstrap';

/**
 * Компонент состояния загрузки
 * Отображает спиннер во время загрузки данных
 */
export const LoadingState: React.FC = () => (
  <div className="text-center py-5">
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);
