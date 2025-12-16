# 📡 Informe: APIs Consumidas por Módulo del Sidebar

## 📋 Resumen Ejecutivo

Este informe documenta las APIs consumidas por cada módulo (isla) accesible desde el sidebar de la aplicación. Se han identificado **9 módulos principales**, de los cuales **4 tienen implementación de APIs** y **5 aún no tienen ninguna API implementada**.

---

## ✅ MÓDULOS CON APIS IMPLEMENTADAS

### 1. **🔐 AUTH (Autenticación)**
**Ubicación**: `src/features/auth/`  
**Archivo de Servicios**: `authService.ts`

#### APIs Consumidas:
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/auth/login` | `POST` | Autenticación de usuario con credenciales |
| `/auth/refresh` | `POST` | Renovación automática del token de acceso |
| `/auth/logout` | `POST` | Cierre de sesión del usuario |
| `/public/universidad/configuracion/elemento/log_url` | `GET` | Obtiene URL del fondo de la página de login |

#### Funciones:
```typescript
✓ loginUser(credentials) - Login del usuario
✓ refreshToken(refreshTokenValue) - Renovar sesión
✓ logout(refreshTokenValue) - Cerrar sesión
```

---

### 2. **🏢 SUPER-ADMIN (Administración Institucional)**
**Ubicación**: `src/features/super-admin/`  
**Archivos de Servicios**: `organizationalService.ts`, `universidadService.ts`

#### APIs Consumidas:

##### Unidades Organizativas
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/tipos-unidad` | `GET` | Obtiene tipos de unidad (Campus, Facultad, Escuela, etc.) |
| `/unidades-organizativas` | `GET` | Obtiene todas las unidades organizativas |
| `/unidades-organizativas` | `POST` | Crea nueva unidad organizativa |
| `/unidades-organizativas/{id}` | `GET` | Obtiene unidad organizativa específica |
| `/unidades-organizativas/{id}` | `PUT` | Actualiza unidad organizativa |
| `/unidades-organizativas/{id}` | `DELETE` | Elimina unidad organizativa |
| `/unidades-organizativas/tipo-unidad/{tipoUnidadId}` | `GET` | Obtiene unidades por tipo |
| `/unidades-organizativas/hijas/{unidadPadreId}` | `GET` | Obtiene unidades hijas (jerárquicas) |

##### Universidades
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/universidades` | `GET` | Obtiene todas las universidades configuradas |
| `/universidades/{id}` | `GET` | Obtiene universidad específica |
| `/universidades/{id}` | `PUT` | Actualiza configuración de universidad |
| `/universidades/{id}/logo` | `PUT` | Sube logo de universidad a Azure |

#### Funciones Principales:
```typescript
✓ getTiposUnidad() - Tipos de unidades disponibles
✓ getUnidadesOrganizativas() - Todas las unidades
✓ createUnidadOrganizativa(data) - Crear unidad
✓ updateUnidadOrganizativa(id, data) - Actualizar unidad
✓ deleteUnidadOrganizativa(id) - Eliminar unidad
✓ getUnidadesHijas(unidadPadreId) - Estructura jerárquica
✓ getUniversidades() - Universidades del sistema
✓ updateUniversidad(id, payload) - Actualizar universidad
✓ uploadUniversidadLogo(universidadId, file) - Upload a Azure
```

#### Componentes que Usan estas APIs:
- **EstructuraOrganizacional.tsx** - Gestión de estructura organizativa
- **Dashboard Super Admin** - Visualización de universidades

---

## ❌ MÓDULOS SIN APIS IMPLEMENTADAS

Los siguientes módulos están configurados en la estructura del proyecto pero **NO TIENEN ENDPOINTS DE API IMPLEMENTADOS**:

### 3. **📊 DASHBOARD**
**Ubicación**: `src/app/(private)/dashboard/`  
**Feature**: `src/features/` *(no existe)*  
**Estado**: 🔴 Sin APIs | Solo UI base

### 4. **👥 ADMIN (Administración General)**
**Ubicación**: `src/app/(private)/admin/`  
**Feature**: `src/features/` *(no existe)*  
**Estado**: 🔴 Sin APIs | Estructura lista

### 5. **📚 ESTUDIANTES**
**Ubicación**: `src/app/(private)/estudiantes/`  
**Feature**: `src/features/` *(no existe)*  
**Estado**: 🔴 Sin APIs | Módulo vacío

### 6. **👨‍🏫 DOCENTES**
**Ubicación**: `src/app/(private)/docentes/`  
**Feature**: `src/features/` *(no existe)*  
**Estado**: 🔴 Sin APIs | Módulo vacío

### 7. **🏭 EMPRESAS**
**Ubicación**: `src/app/(private)/empresas/`  
**Feature**: `src/features/` *(no existe)*  
**Estado**: 🔴 Sin APIs | Módulo vacío

### 8. **📋 PPP (Prácticas Pre-Profesionales)**
**Ubicación**: `src/app/(private)/ppp/`  
**Features Parciales**: 
- `src/features/ppp/informes/` *(no APIs)*
- `src/features/ppp/seguimiento/` *(no APIs)*
- `src/features/ppp/solicitudes/` *(no APIs)*  
**Estado**: 🟡 Parcialmente estructurado | Sin APIs

### 9. **🔍 AUDITORIA**
**Ubicación**: `src/app/(private)/auditoria/`  
**Features Parciales**: `src/features/auditoria/` *(no APIs)*  
**Estado**: 🟡 Carpeta creada | Sin APIs

---

## 📊 ESTADÍSTICAS

```
Total de Módulos:               9
├─ Con APIs Implementadas:     2 (22%)
│  ├─ AUTH:                    3 endpoints
│  └─ SUPER-ADMIN:            12 endpoints
│
└─ Sin APIs Implementadas:     7 (78%)
   ├─ Completamente vacíos:   5 módulos
   └─ Parcialmente creados:   2 módulos
```

---

## 🛠️ PRÓXIMAS TAREAS

### Prioridad Alta 🔴
1. **Implementar APIs para ADMIN**
   - Gestión de usuarios
   - Gestión de roles
   - Gestión de permisos

2. **Implementar APIs para DASHBOARD**
   - Estadísticas generales
   - Resumen del sistema

### Prioridad Media 🟠
3. **Implementar APIs para ESTUDIANTES**
   - CRUD de estudiantes
   - Historial académico
   - Calificaciones

4. **Implementar APIs para DOCENTES**
   - CRUD de docentes
   - Horarios
   - Asignaciones

5. **Implementar APIs para EMPRESAS**
   - Registro de empresas
   - Convenios
   - Contactos

### Prioridad Baja 🟡
6. **Completar PPP (Prácticas)**
   - APIs para solicitudes de prácticas
   - Seguimiento de prácticas
   - Generación de informes

7. **Completar AUDITORIA**
   - Logs del sistema
   - Historial de cambios
   - Reportes de auditoría

---

## 📁 Estructura de Directorios para Nuevos Módulos

Cuando se implemente un nuevo módulo, seguir esta estructura:

```
src/features/[modulo]/
├── api/                  # (opcional) Configuraciones específicas
├── components/           # Componentes UI
├── hooks/               # Custom hooks
├── pages/               # Páginas principales
├── services/            # 🔴 CRÍTICO - Aquí van los endpoints
│   └── [serviceName]Service.ts
├── slices/              # Redux slices (si necesita estado global)
├── types.ts             # Types específicos del módulo
└── index.ts             # Exports
```

---

## 🔗 Archivos Relacionados

- **Tipos de Backend**: `src/shared/types/backend.types.ts`
- **Tipos de Permisos**: `src/shared/types/permissions.types.ts`
- **Cliente HTTP**: `src/shared/services/http.ts`
- **DashboardLayout**: `src/shared/layouts/DashboardLayout.tsx` (genera sidebar dinámicamente)

---

## ⚠️ Notas Importantes

1. **Sistema dinámico de sidebar**: El sidebar se genera automáticamente basado en los `sidebarTargets` obtenidos del backend en el login
2. **Todas las APIs** usan la instancia `api` de axios configurada en `http.ts`
3. **Autenticación**: Todas las APIs (excepto `/auth/*` y `/public/*`) requieren token Bearer
4. **Base URL**: Todas las rutas son relativas a `/api/v1` (configurado en `http.ts`)
5. **Estructura de respuesta**: Todas las respuestas siguen el patrón `BackendResponse<T>` con propiedades `success` y `data`

---

## 📝 Generado
**Fecha**: 16 de Diciembre de 2025  
**Versión**: 1.0  
**Estado**: Actualizado a partir del análisis del código fuente
