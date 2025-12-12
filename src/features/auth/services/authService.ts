import type { ApiResponse } from '@/shared/types';
import type { LoginRequest, LoginResponseData } from '../types';
import { api } from '@/shared/services/http';

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
    // If object but no common fields, return its JSON string
    return JSON.stringify(current);
  }

  return String(text).trim();
}

export async function loginUser(credentials: LoginRequest): Promise<LoginResponseData> {
  try {
    const response = await api.post<ApiResponse<LoginResponseData>>('/v1/auth/login', credentials);
    return response.data.data;
  } catch (error: any) {
    const friendly = extractFriendlyMessageFromText(error?.response?.data || error?.message || String(error));
    throw new Error(friendly);
  }
}

export async function refreshToken(refreshToken: string): Promise<LoginResponseData> {
  try {
    const response = await api.post<ApiResponse<LoginResponseData>>('/v1/auth/refresh', { refreshToken });
    return response.data.data;
  } catch (error: any) {
    const friendly = extractFriendlyMessageFromText(error?.response?.data || error?.message || String(error));
    throw new Error(friendly);
  }
}

export async function logout(refreshToken: string): Promise<void> {
  try {
    await api.post('/v1/auth/logout', { refreshToken });
  } catch (error: any) {
    const friendly = extractFriendlyMessageFromText(error?.response?.data || error?.message || String(error));
    throw new Error(friendly);
  }
}