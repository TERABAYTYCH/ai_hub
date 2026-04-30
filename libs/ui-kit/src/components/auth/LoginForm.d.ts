export interface LoginFormProps {
    /** Callback при отправке формы с данными логина */
    onSubmit: (username: string, password: string) => Promise<void>;
    /** Флаг загрузки */
    isLoading?: boolean;
    /** Сообщение об ошибке */
    error?: string;
    /** Текст заголовка */
    title?: string;
    /** Текст ссылки на регистрацию */
    registerLinkText?: string;
    /** Путь к странице регистрации */
    registerLinkPath?: string;
}
/**
 * Универсальная форма входа.
 * Принимает callback для обработки отправки, не содержит логики API запросов.
 */
export declare function LoginForm({ onSubmit, isLoading, error, title, registerLinkText, registerLinkPath, }: LoginFormProps): import("react/jsx-runtime").JSX.Element;
