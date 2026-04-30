import React from 'react';
interface EmptyStateProps {
    /** Callback для добавления нового устройства */
    onAdd: () => void;
}
/**
 * Компонент пустого состояния
 * Отображается когда список устройств пуст
 */
export declare const EmptyState: React.FC<EmptyStateProps>;
export {};
