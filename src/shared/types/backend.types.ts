// Tipos para las respuestas del backend
import type { Permissions, LoginUser } from './permissions.types';

export interface BackendResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Respuesta del endpoint POST /auth/login
 * Incluye tokens, usuario y permisos
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  issuedAt: string;
  user: LoginUser;
  permissions: Permissions;
}

/**
 * @deprecated Usar LoginUser de permissions.types.ts
 */
export interface BackendUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLogin: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}
