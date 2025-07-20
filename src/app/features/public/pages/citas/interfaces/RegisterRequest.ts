export interface RegisterRequest {
  nombre_usuario: string;
  contrasena: string;
  dni: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string; // yyyy-MM-dd
  email: string;
  telefono: string;
  direccion: string;
  sexo: string; // M o F
  rol_solicitado?: string;
  fecha_inicio_contrato?: string;
  fecha_fin_contrato?: string;
}
