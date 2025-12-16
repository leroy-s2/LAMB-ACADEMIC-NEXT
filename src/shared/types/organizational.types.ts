export interface TipoUnidad {
  id: number;
  nombre: string;
  descripcion: string;
  nivel: number;
  active: boolean;
}

export interface UnidadOrganizativa {
  localizacionId?: number | null;
  tipoUnidadId: number;
  unidadPadreId?: number | null;
  nombre: string;
  codigo: string;
  sigla: string;
  descripcion: string;
}

export interface UnidadOrganizativaResponse {
  id: number;
  localizacionId: number | null;
  localizacionNombre: string | null;
  tipoUnidadId: number;
  tipoUnidadNombre: string;
  tipoUnidadNivel: number;
  unidadPadreId: number | null;
  unidadPadreNombre: string | null;
  nombre: string;
  codigo: string;
  sigla: string;
  descripcion: string;
  active: boolean;  subordinadas?: UnidadOrganizativaResponse[];
}