export interface MetodoPagoDTO {
  id: number;
  tipo: string; // TipoMetodoPago es un enum en el backend
  nombre: string;
  estado: boolean;
}
