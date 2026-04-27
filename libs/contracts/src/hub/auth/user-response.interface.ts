/**
 * DTO для ответа с данными пользователя из JWT
 */
export interface UserResponse {
  id: string;
  username: string;
  role: string;
  licenseId: string;
}
