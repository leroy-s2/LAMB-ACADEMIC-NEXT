import { api } from './http';
import { BackendResponse } from '@/shared/types/backend.types';

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * Sube un archivo a Azure Storage
 * POST /upload o /archivos/upload
 */
export async function uploadFile(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    console.log('📤 Subiendo archivo:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Intentar con los endpoints típicos del backend
    let response;
    const endpoints = ['/upload', '/archivos/upload', '/files/upload', '/storage/upload'];
    let lastError: any;

    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Intentando endpoint: ${endpoint}`);
        response = await api.post<any>(
          endpoint,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        // Si llegamos aquí, el endpoint funcionó
        if (response.data.success || response.data.url) {
          console.log('✅ Archivo subido correctamente con endpoint:', endpoint);
          console.log('📦 Respuesta del servidor:', response.data);
          // Manejar diferentes formatos de respuesta
          const uploadData = response.data.data || response.data;
          return {
            url: uploadData.url || response.data.url,
            filename: uploadData.filename || file.name,
            size: uploadData.size || file.size,
            mimeType: uploadData.mimeType || file.type,
          };
        }
        break;
      } catch (err: any) {
        lastError = err;
        const statusCode = err.response?.status || 'unknown';
        console.warn(`⚠️ Endpoint ${endpoint} falló (HTTP ${statusCode}), intentando siguiente...`);
        console.warn(`   Error: ${err.response?.data?.message || err.message}`);
        continue;
      }
    }

    throw lastError || new Error('No se pudo encontrar un endpoint válido de upload');
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Error al subir el archivo';
    console.error('❌ Error uploadFile:', {
      message: errorMessage,
      status: error.response?.status,
      endpoint: error.config?.url,
      fullError: error.response?.data,
    });
    throw new Error(errorMessage);
  }
}

/**
 * Sube un archivo específicamente para el logo de la universidad
 * POST /files/upload/logo o similar
 */
export async function uploadLogo(file: File): Promise<UploadResponse> {
  try {
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen (PNG, JPG, SVG, etc.)');
    }

    // Validar tamaño máximo (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('El archivo no debe superar 5MB');
    }

    return await uploadFile(file);
  } catch (error: any) {
    console.error('❌ Error uploadLogo:', error.message);
    throw error;
  }
}
