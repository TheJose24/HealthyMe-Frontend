export interface IMedico {
  idMedico: number;
  idUsuario: number;
  nombre_especialidad: string;
  nombreUsuario: string;
  imagenPerfil: string;
  persona: {
    dni: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    edad: number;
  };
}
