import React from 'react';

interface EmptyStateProps {
  /** Callback для добавления нового устройства */
  onAdd: () => void;
}

/**
 * Компонент пустого состояния
 * Отображается когда список устройств пуст
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ onAdd }) => (
  <div className="text-center py-5">
    <p className="text-muted mb-3">No devices found. Click "Add Device" to create one.</p>
    <button className="btn btn-primary" onClick={onAdd}>Add Device</button>
  </div>
);
