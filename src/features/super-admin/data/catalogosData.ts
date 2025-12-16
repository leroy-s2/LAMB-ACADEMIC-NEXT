// Datos estáticos para Catálogos Maestros
import { Catalogo, RegistroCatalogo } from '../components/catalogos-maestros/types';

// Lista de catálogos disponibles
export const catalogosData: Catalogo[] = [
    {
        id: '1',
        nombre: 'Modalidades de Ingreso',
        codigo: 'MOD_INGRESO',
        descripcion: 'Tipos de modalidad de ingreso a la universidad',
        totalRegistros: 8,
        ultimaActualizacion: '2025-12-01',
        activo: true,
    },
    {
        id: '2',
        nombre: 'Tipos de Documento',
        codigo: 'TIPO_DOC',
        descripcion: 'Tipos de documentos de identidad',
        totalRegistros: 5,
        ultimaActualizacion: '2025-11-15',
        activo: true,
    },
    {
        id: '3',
        nombre: 'Estados Civiles',
        codigo: 'ESTADO_CIVIL',
        descripcion: 'Estados civiles de las personas',
        totalRegistros: 6,
        ultimaActualizacion: '2025-10-20',
        activo: true,
    },
    {
        id: '4',
        nombre: 'Niveles Académicos',
        codigo: 'NIVEL_ACAD',
        descripcion: 'Niveles de formación académica',
        totalRegistros: 4,
        ultimaActualizacion: '2025-12-05',
        activo: true,
    },
    {
        id: '5',
        nombre: 'Tipos de Contrato',
        codigo: 'TIPO_CONTRATO',
        descripcion: 'Tipos de contrato laboral para docentes',
        totalRegistros: 7,
        ultimaActualizacion: '2025-11-28',
        activo: true,
    },
    {
        id: '6',
        nombre: 'Categorías Docentes',
        codigo: 'CAT_DOCENTE',
        descripcion: 'Categorías de clasificación docente',
        totalRegistros: 5,
        ultimaActualizacion: '2025-12-08',
        activo: true,
    },
    {
        id: '7',
        nombre: 'Tipos de Matrícula',
        codigo: 'TIPO_MATRICULA',
        descripcion: 'Tipos de matrícula estudiantil',
        totalRegistros: 4,
        ultimaActualizacion: '2025-11-10',
        activo: true,
    },
    {
        id: '8',
        nombre: 'Estados de Curso',
        codigo: 'ESTADO_CURSO',
        descripcion: 'Estados posibles de un curso',
        totalRegistros: 6,
        ultimaActualizacion: '2025-12-02',
        activo: true,
    },
    {
        id: '9',
        nombre: 'Tipo de Unidad Administrativa',
        codigo: 'TIPO_UNIDAD',
        descripcion: 'Tipos de unidades administrativas y académicas de la universidad',
        totalRegistros: 0,
        ultimaActualizacion: new Date().toISOString().split('T')[0],
        activo: true,
        isApiCatalog: true,
        apiEndpoint: '/tipos-unidad',
        apiPostEndpoint: '/tipos-unidad',
        catalogType: 'tipoUnidad',
    },
    {
        id: '10',
        nombre: 'Tipos de Localización',
        codigo: 'TIPO_LOC',
        descripcion: 'Catálogo de tipos de espacios físicos y virtuales',
        totalRegistros: 0,
        ultimaActualizacion: new Date().toISOString().split('T')[0],
        activo: true,
        isApiCatalog: true,
        apiEndpoint: '/tipos-localizacion',
        apiPostEndpoint: '/tipos-localizacion',
        catalogType: 'tipoLocalizacion',
    },
    {
        id: '11',
        nombre: 'Tipos de Autoridad',
        codigo: 'TIPO_AUT',
        descripcion: 'Tipos de cargos de autoridad institucional (Rector, Decano, Director, etc.)',
        totalRegistros: 0,
        ultimaActualizacion: new Date().toISOString().split('T')[0],
        activo: true,
        isApiCatalog: true,
        apiEndpoint: '/tipos-autoridad/universidad/1',
        apiPostEndpoint: '/tipos-autoridad',
        catalogType: 'tipoAutoridad',
    },
];

// Registros estáticos por catálogo
export const registrosData: Record<string, RegistroCatalogo[]> = {
    '1': [
        { id: '1-1', codigo: 'ORD', descripcion: 'Ordinario', orden: 1, activo: true },
        { id: '1-2', codigo: 'EXT', descripcion: 'Extraordinario', orden: 2, activo: true },
        { id: '1-3', codigo: 'TRAS', descripcion: 'Traslado Externo', orden: 3, activo: true },
        { id: '1-4', codigo: 'TASI', descripcion: 'Traslado Interno', orden: 4, activo: true },
    ],
    '4': [
        { id: '4-1', codigo: 'PREG', descripcion: 'Pregrado', orden: 1, activo: true },
        { id: '4-2', codigo: 'POSG', descripcion: 'Posgrado', orden: 2, activo: true },
        { id: '4-3', codigo: 'MAES', descripcion: 'Maestría', orden: 3, activo: true },
        { id: '4-4', codigo: 'DOCT', descripcion: 'Doctorado', orden: 4, activo: true },
    ],
};

// Función para obtener estilos del nivel
export const getNivelStyles = (nivel: number): string => {
    switch (nivel) {
        case 0: return 'bg-red-100 text-red-600 border-red-200';
        case 1: return 'bg-orange-100 text-orange-600 border-orange-200';
        case 2: return 'bg-yellow-100 text-yellow-600 border-yellow-200';
        case 3: return 'bg-blue-100 text-blue-600 border-blue-200';
        case 4: return 'bg-green-100 text-green-600 border-green-200';
        case 5: return 'bg-cyan-100 text-cyan-600 border-cyan-200';
        case 6: return 'bg-pink-100 text-pink-600 border-pink-200';
        case 7: return 'bg-purple-100 text-purple-600 border-purple-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};
