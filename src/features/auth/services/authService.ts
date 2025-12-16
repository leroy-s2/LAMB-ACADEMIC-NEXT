import { api } from '@/shared/services/http';
import type { BackendResponse, LoginRequest, LoginResponse, RefreshTokenResponse } from '@/shared/types/backend.types';

function extractFriendlyMessageFromText(text: string): string {
  let current: any = text;
  for (let i = 0; i < 2; i++) {
    try {
      if (typeof current === 'string') {
        current = JSON.parse(current);
      }
    } catch (_e) {
      break;
    }
  }

  if (current && typeof current === 'object') {
    const friendly = current.error || current.message || (current.data && current.data.message);
    if (friendly) return typeof friendly === 'string' ? friendly : JSON.stringify(friendly);
    return JSON.stringify(current);
  }

  return String(text).trim();
}

/**
 * Login con la API real del backend
 * POST /auth/login
 */
export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await api.post<BackendResponse<LoginResponse>>('/auth/login', credentials);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Error en el login');
  } catch (error: any) {
    // Si el backend devuelve un mensaje estructurado
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    const friendly = extractFriendlyMessageFromText(error?.response?.data || error?.message || String(error));
    throw new Error(friendly);
  }
}

/**
 * Refresh token con la API real del backend
 * POST /auth/refresh
 */
export async function refreshToken(refreshTokenValue: string): Promise<RefreshTokenResponse> {
  try {
    const response = await api.post<BackendResponse<RefreshTokenResponse>>('/auth/refresh', { 
      refreshToken: refreshTokenValue 
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Error al refrescar el token');
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    const friendly = extractFriendlyMessageFromText(error?.response?.data || error?.message || String(error));
    throw new Error(friendly);
  }
}

/**
 * Logout con la API real del backend
 * POST /auth/logout
 */
export async function logout(refreshTokenValue: string): Promise<void> {
  try {
    await api.post('/auth/logout', { refreshToken: refreshTokenValue });
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    const friendly = extractFriendlyMessageFromText(error?.response?.data || error?.message || String(error));
    throw new Error(friendly);
  }
}