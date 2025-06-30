export interface IMedico {
  idMedico: number;
  idUsuario: number;
  idEspecialidad: number;
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

export interface IEspecialidad {
  idEspecialidad: number;
  nombreEspecialidad: string;
  imgEspecialidad: string;
}
