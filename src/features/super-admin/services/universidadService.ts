import { api } from '@/shared/services/http';
import { BackendResponse } from '@/shared/types/backend.types';

export interface Universidad {
  id: number;
  codigo: string;
  nombre: string;
  dominio: string;
  ruc: string;
  tipo: 'PRIVADA' | 'PUBLICA';
  website: string;
  logoUrl: string;
  zonaHoraria: string;
  locale: string;
  configuracion?: string; // JSON string - omitir por ahora
  plan: string;
  estado: 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA';
  fechaVencimiento: string | null;
  maxEstudiantes: number;
  maxDocentes: number;
  totalEstudiantes: number | null;
  totalDocentes: number | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface UniversidadUpdatePayload {
  codigo?: string;
  nombre?: string;
  dominio?: string;
  ruc?: string;
  tipo?: 'PRIVADA' | 'PUBLICA';
  website?: string;
  logoUrl?: string;
  zonaHoraria?: string;
  locale?: string;
  plan?: string;
  estado?: 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA';
  fechaVencimiento?: string | null;
  maxEstudiantes?: number;
  maxDocentes?: number;
}

/**
 * Obtiene todas las universidades configuradas
 * GET /universidades
 * (baseURL es /api/v1, así que la URL completa será /api/v1/universidades)
 */
export async function getUniversidades(): Promise<Universidad[]> {
  try {
    console.log('📡 Obteniendo universidades...');
    const response = await api.get<BackendResponse<Universidad[]>>('/universidades');

    if (response.data.success) {
      console.log('✅ Universidades obtenidas:', response.data.data);
      return response.data.data;
    }

    throw new Error(response.data.message || 'Error al obtener universidades');
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Error al obtener universidades';
    console.error('❌ Error getUniversidades:', errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Obtiene una universidad específica por ID
 * GET /universidades/{id}
 */
export async function getUniversidad(id: number): Promise<Universidad> {
  try {
    console.log(`📡 Obteniendo universidad ${id}...`);
    const response = await api.get<BackendResponse<Universidad>>(`/universidades/${id}`);

    if (response.data.success) {
      console.log(`✅ Universidad ${id} obtenida:`, response.data.data);
      return response.data.data;
    }

    throw new Error(response.data.message || 'Error al obtener universidad');
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Error al obtener universidad';
    console.error(`❌ Error getUniversidad(${id}):`, errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Actualiza una universidad específica
 * PUT /universidades/{id}
 */
export async function updateUniversidad(
  id: number,
  payload: UniversidadUpdatePayload
): Promise<Universidad> {
  try {
    console.log(`📡 Actualizando universidad ${id}...`, payload);
    const response = await api.put<BackendResponse<Universidad>>(
      `/universidades/${id}`,
      payload
    );

    if (response.data.success) {
      console.log(`✅ Universidad ${id} actualizada:`, response.data.data);
      return response.data.data;
    }

    throw new Error(response.data.message || 'Error al actualizar universidad');
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Error al actualizar universidad';
    console.error(`❌ Error updateUniversidad(${id}):`, errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Obtiene la universidad principal (primera en la lista)
 */
export async function getUniversidadPrincipal(): Promise<Universidad> {
  try {
    console.log('📡 Obteniendo universidad principal...');
    const universidades = await getUniversidades();

    if (universidades.length === 0) {
      throw new Error('No hay universidades configuradas en el sistema');
    }

    console.log('✅ Universidad principal obtenida:', universidades[0]);
    return universidades[0];
  } catch (error: any) {
    const errorMessage = error.message || 'Error al obtener universidad principal';
    console.error('❌ Error getUniversidadPrincipal:', errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Sube el logo de una universidad a Azure
 * PUT /universidades/{id}/logo
 * Devuelve la URL de Azure del logo subido
 */
export async function uploadUniversidadLogo(
  universidadId: number,
  file: File,
  fileName: string = 'logo.png',
  fileType: string = 'imagen'
): Promise<{ logoUrl: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('fileType', fileType);

    console.log('📤 Subiendo logo para universidad', universidadId, {
      fileName,
      fileSize: file.size,
      fileType: file.type,
    });

    const response = await api.put<BackendResponse<{ logoUrl: string }>>(
      `/universidades/${universidadId}/logo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success && response.data.data?.logoUrl) {
      console.log('✅ Logo subido a Azure:', response.data.data.logoUrl);
      return response.data.data;
    }

    throw new Error(response.data.message || 'Error al subir el logo');
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Error al subir el logo';
    console.error('❌ Error uploadUniversidadLogo:', errorMessage);
    throw new Error(errorMessage);
  }
}
