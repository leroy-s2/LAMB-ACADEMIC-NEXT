import { api } from '@/shared/services/http';
import { TipoUnidad, UnidadOrganizativa, UnidadOrganizativaResponse } from '@/shared/types/organizational.types';
import { BackendResponse } from '@/shared/types/backend.types';

/**
 * Obtiene los tipos de unidad disponibles del backend
 * GET /tipos-unidad
 */
export async function getTiposUnidad(): Promise<TipoUnidad[]> {
  try {
    const response = await api.get<BackendResponse<TipoUnidad[]>>('/tipos-unidad');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Error al obtener tipos de unidad');
  } catch (error: any) {
    console.error('❌ Error getTiposUnidad:', error);
    throw error;
  }
}

/**
 * Obtiene los tipos de unidad filtrados por nivel
 * GET /tipos-unidad (filtrado en cliente)
 */
export async function getTiposUnidadByNivel(nivel: number): Promise<TipoUnidad[]> {
  try {
    const tipos = await getTiposUnidad();
    return tipos.filter((tipo) => tipo.nivel === nivel);
  } catch (error) {
    console.error('❌ Error getTiposUnidadByNivel:', error);
    throw error;
  }
}

/**
 * Obtiene todas las unidades organizativas
 * GET /unidades-organizativas
 */
export async function getUnidadesOrganizativas(): Promise<UnidadOrganizativaResponse[]> {
  try {
    const response = await api.get<BackendResponse<UnidadOrganizativaResponse[]>>(
      '/unidades-organizativas'
    );
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Error al obtener unidades organizativas');
  } catch (error: any) {
    console.error('❌ Error getUnidadesOrganizativas:', error);
    throw error;
  }
}

/**
 * Obtiene una unidad organizativa por ID
 * GET /unidades-organizativas/:id
 */
export async function getUnidadOrganizativaById(id: number): Promise<UnidadOrganizativaResponse> {
  try {
    const response = await api.get<BackendResponse<UnidadOrganizativaResponse>>(
      `/unidades-organizativas/${id}`
    );
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Error al obtener unidad organizativa');
  } catch (error: any) {
    console.error('❌ Error getUnidadOrganizativaById:', error);
    throw error;
  }
}

/**
 * Crea una nueva unidad organizativa
 * POST /unidades-organizativas
 */
export async function createUnidadOrganizativa(
  data: UnidadOrganizativa
): Promise<UnidadOrganizativaResponse> {
  try {
    // Normalizar null en lugar de undefined
    const payload = {
      localizacionId: data.localizacionId ?? null,
      tipoUnidadId: data.tipoUnidadId,
      unidadPadreId: data.unidadPadreId ?? null,
      nombre: data.nombre,
      codigo: data.codigo,
      sigla: data.sigla,
      descripcion: data.descripcion,
    };

    const response = await api.post<BackendResponse<UnidadOrganizativaResponse>>(
      '/unidades-organizativas',
      payload
    );
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Error al crear unidad organizativa');
  } catch (error: any) {
    console.error('❌ Error createUnidadOrganizativa:', error);
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

/**
 * Actualiza una unidad organizativa existente
 * PUT /unidades-organizativas/:id
 */
export async function updateUnidadOrganizativa(
  id: number,
  data: Partial<UnidadOrganizativa>
): Promise<UnidadOrganizativaResponse> {
  try {
    const response = await api.put<BackendResponse<UnidadOrganizativaResponse>>(
      `/unidades-organizativas/${id}`,
      data
    );
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Error al actualizar unidad organizativa');
  } catch (error: any) {
    console.error('❌ Error updateUnidadOrganizativa:', error);
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

/**
 * Elimina una unidad organizativa
 * DELETE /unidades-organizativas/:id
 */
export async function deleteUnidadOrganizativa(id: number): Promise<void> {
  try {
    const response = await api.delete<BackendResponse<null>>(
      `/unidades-organizativas/${id}`
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al eliminar unidad organizativa');
    }
  } catch (error: any) {
    console.error('❌ Error deleteUnidadOrganizativa:', error);
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}
