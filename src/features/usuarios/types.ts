// Types para feature usuarios
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  estado: 'activo' | 'inactivo';
  fechaCreacion: Date;
}

export interface UsuariosState {
  usuarios: Usuario[];
  loading: boolean;
  error: string | null;
}
