export interface IPersonaDTO {
  dni: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // ISO string: "YYYY-MM-DD"
  sexo: string;
  direccion: string;
  telefono: string;
  email: string;
  edad: number;
}
