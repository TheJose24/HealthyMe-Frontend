export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  rol: string; // 'ADMIN', 'PACIENTE', etc.
}
