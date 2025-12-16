// Tipos e interfaces para Catálogos Maestros

export interface Catalogo {
    id: string;
    nombre: string;
    codigo: string;
    descripcion: string;
    totalRegistros: number;
    ultimaActualizacion: string;
    activo: boolean;
    isApiCatalog?: boolean;
    apiEndpoint?: string;
    apiPostEndpoint?: string;
    catalogType?: CatalogType;
}

export type CatalogType = 'tipoUnidad' | 'tipoLocalizacion' | 'tipoAutoridad';

export interface RegistroCatalogo {
    id: string;
    codigo: string;
    descripcion: string;
    orden: number;
    activo: boolean;
}

export interface TipoUnidadAPI {
    id: number;
    nombre: string;
    descripcion: string;
    nivel: number;
    active: boolean;
}

export interface TipoAutoridadAPI {
    id: number;
    nombre: string;
    codigo: string;
    nivelJerarquia: number;
    descripcion: string;
    active?: boolean;
}

export interface TipoLocalizacionAPI {
    id: number;
    codigo: string;
    nombre: string;
    padreId?: number;
    nivelJerarquia: number;
    permiteAsignacion: boolean;
    active?: boolean;
}

// Tipos para formularios
export interface NuevoTipoUnidad {
    nombre: string;
    descripcion: string;
    nivel: number;
}

export interface NuevoTipoLocalizacion {
    codigo: string;
    nombre: string;
    padreId: number;
    nivelJerarquia: number;
    permiteAsignacion: boolean;
}

export interface NuevoTipoAutoridad {
    nombre: string;
    codigo: string;
    nivelJerarquia: number;
    descripcion: string;
}

// Tipo genérico para datos de API
export type ApiRecord = TipoUnidadAPI | TipoAutoridadAPI | TipoLocalizacionAPI;
