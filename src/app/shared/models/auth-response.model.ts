export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  rol: string; // 'ADMIN', 'PACIENTE', etc.
}
