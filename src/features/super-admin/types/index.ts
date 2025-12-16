export interface Usuario {
  id: string;
  username: string;
  email: string;
  nombreCompleto: string;
  dni: string;
  rol: string;
  estado: 'ACTIVO' | 'BLOQUEADO' | 'INACTIVO';
  intentosFallidos: number;
  ultimoAcceso: string;
  fechaCreacion: string;
  unidadOrganizativaId: string;
  unidadOrganizativaNombre: string;
  nivelOrganizativo: 0 | 1 | 2; // 0: Sectores Clave, 1: Facultad, 2: Escuela
}

export interface Permiso {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
}

export interface RolPermisos {
  rol: string;
  nombre: string;
  descripcion: string;
  color: string;
  permisos: Set<string>;
  totalPermisos?: number;
  modulosActivos?: number;
}

export interface Licencia {
  plan: string;
  estado: 'ACTIVA' | 'VENCIDA' | 'SUSPENDIDA';
  vencimiento: string;
  diasRestantes: number;
}

export interface RecursosUso {
  estudiantes: { actual: number; maximo: number };
  docentes: { actual: number; maximo: number };
  programas: { actual: number };
}

export interface Servicio {
  nombre: string;
  estado: 'online' | 'warning' | 'error' | 'offline';
  latencia: string;
  uptime: string;
  nota: string;
}

export interface AlertaSistema {
  id: number;
  tipo: 'error' | 'warning' | 'info';
  mensaje: string;
  fecha: string;
}

export interface ActividadReciente {
  accion: string;
  usuario: string;
  fecha: string;
}

export type SuperAdminViewType =
  | 'dashboard'
  | 'institucion'
  | 'organizacion'
  | 'usuarios'
  | 'roles-permisos'
  | 'permisos-individuales'
  | 'auditoria'
  | 'catalogos'
  | 'backups';
