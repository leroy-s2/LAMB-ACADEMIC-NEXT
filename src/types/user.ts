export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rol?: string;
  estado: 'activo' | 'inactivo';
  fechaCreacion?: Date;
}
