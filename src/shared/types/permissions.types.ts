/**
 * Tipos para el sistema de permisos dinámico
 * Basado en la estructura del JSON de login del backend
 */

// ============================================================
// API PERMISSIONS
// ============================================================

/**
 * Permisos de una API específica
 */
export interface ApiPermission {
    apiBase: string;
    descripcion: string;
    get: boolean;
    post: boolean;
    put: boolean;
    delete: boolean;
}

// ============================================================
// SIDEBAR TARGETS
// ============================================================

/**
 * Item del sidebar dentro de una isla
 */
export interface SidebarTarget {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    rutaFrontend: string;
    icono: string;
    orden: number;
    apis: ApiPermission[];
}

// ============================================================
// ISLAS (MÓDULOS)
// ============================================================

/**
 * Una "isla" o módulo del sistema
 * Cada isla representa un área funcional con su propio sidebar
 */
export interface Isla {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    icono: string;
    color: string;
    rutaDefault: string;
    esIslaPrincipal: boolean;
    orden: number;
    sidebarTargets: SidebarTarget[];
}

// ============================================================
// PERMISSIONS METADATA
// ============================================================

/**
 * Metadata de los permisos del usuario
 */
export interface PermissionsMetadata {
    totalIslas: number;
    totalModulos: number;
    totalRecursos: number;
    totalPermisosActivos: number;
    permisosIndividualesCount: number;
    islaPrincipal: string;
}

// ============================================================
// PERMISSIONS STRUCTURE
// ============================================================

/**
 * Estructura completa de permisos del usuario
 */
export interface Permissions {
    islas: Isla[];
    permisos: Record<string, unknown>;
    permisosIndividuales: unknown[];
    metadata: PermissionsMetadata;
}

// ============================================================
// LOGIN USER (Nueva estructura del backend)
// ============================================================

/**
 * Usuario como viene del backend al hacer login
 */
export interface LoginUser {
    idPersona: number;
    documentoIdentidad: string;
    nombre: string;
    apellidos: string;
    nombreCompleto: string;
    email: string;
    telefono: string;
    fotoUrl: string | null;
    rolesBase: string[];
    estadoCuenta: 'activa' | 'inactiva' | 'suspendida';
    requiereCambioPassword: boolean;
    ultimaSesion: string;
}

// ============================================================
// LOGIN RESPONSE
// ============================================================

/**
 * Respuesta completa del endpoint de login
 */
export interface LoginResponseData {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    issuedAt: string;
    user: LoginUser;
    permissions: Permissions;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: LoginResponseData;
    timestamp: string;
}
