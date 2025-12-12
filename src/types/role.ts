export interface Role {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: string[];
  estado: 'activo' | 'inactivo';
}
