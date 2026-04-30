/** Минимальный набор полей для регистрации */
export interface RegisterData {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}
export interface RegisterFormProps {
    /** Callback при отправке формы с данными регистрации */
    onSubmit: (data: RegisterData) => Promise<void>;
    /** Флаг загрузки */
    isLoading?: boolean;
    /** Сообщение об ошибке */
    error?: string;
    /** Дополнительная валидация пароля */
    validatePassword?: (password: string, confirmPassword: string) => string | null;
    /** Текст заголовка */
    title?: string;
    /** Текст ссылки на вход */
    loginLinkText?: string;
    /** Путь к странице входа */
    loginLinkPath?: string;
}
/**
 * Универсальная форма регистрации.
 * Принимает callback для обработки отправки, не содержит логики API запросов.
 */
export declare function RegisterForm({ onSubmit, isLoading, error, validatePassword, title, loginLinkText, loginLinkPath, }: RegisterFormProps): import("react/jsx-runtime").JSX.Element;
