# Módulo Super Admin

## 📋 Descripción

Módulo de administración del sistema que proporciona control total sobre la plataforma LAMB Academic. Incluye gestión de usuarios, roles, permisos, auditoría, estructura organizacional y configuración avanzada del sistema.

## 🏗️ Estructura de Carpetas

```
src/features/super-admin/
├── components/
│   ├── CreateUnitModal/              # Modal para seleccionar tipo de unidad
│   ├── RegistroUnidadInline/         # Formulario compacto inline
│   ├── EstructuraOrganizacional.tsx  # ✨ Vista principal estructura
│   ├── ConfiguracionInstitucional.tsx# ⚙️ Configuración de identidad institucional
│   ├── DashboardSuperAdmin.tsx       # Dashboard principal
│   ├── GestionUsuarios.tsx           # Gestión de usuarios
│   ├── GestionRolesPermisos.tsx      # Matriz de permisos
│   ├── SidebarSuperAdmin.tsx         # Navegación lateral
│   └── index.ts                      # Exports de componentes
├── services/
│   ├── organizationalService.ts      # 📡 API calls estructura organizacional
│   ├── universidadService.ts         # 📡 API calls configuración institucional
│   └── index.ts                      # Exports de servicios
├── pages/
│   └── SuperAdminPage.tsx            # Página de entrada del módulo
├── types/
│   └── index.ts
└── README.md                         # Este archivo
```

**Nota importante:** Los servicios y componentes específicos de `super-admin` están localizados aquí.
Solo los **tipos compartidos** están en `src/shared/types/`

## 🔄 Distribución de Datos por Capa

### 1️⃣ **TYPES** (`src/shared/types/organizational.types.ts`)
Modelos de datos **reutilizables** que se consumen de la base de datos:
```typescript
export interface TipoUnidad { ... }
export interface UnidadOrganizativa { ... }
export interface UnidadOrganizativaResponse { ... }
```
✅ Ubicación: `shared/types/` - Pueden ser usados por otros features

### 2️⃣ **SERVICES** (`src/features/super-admin/services/organizationalService.ts`)
Funciones que consumen APIs **específicas de super-admin**:
```typescript
getTiposUnidad()
getTiposUnidadByNivel(nivel)
getUnidadesOrganizativas()
createUnidadOrganizativa(data)
updateUnidadOrganizativa(id, data)
deleteUnidadOrganizativa(id)
```
✅ Ubicación: `super-admin/services/` - Solo se usan en este feature

### 3️⃣ **COMPONENTS** (`src/features/super-admin/components/`)
Componentes **específicos de super-admin**:
- `CreateUnitModal/CreateUnitModal.tsx` - Modal para seleccionar tipo
- `RegistroUnidadInline/RegistroUnidadInline.tsx` - Formulario compacto

✅ Ubicación: `super-admin/components/` - Solo se usan en este feature

### 4️⃣ **FEATURES** (`src/features/super-admin/components/`)
Vista principal que orquesta todo:
- `EstructuraOrganizacional.tsx` - Consume components + services + types

---

## 📐 Flujo de Creación de Unidad Organizativa

```
Usuario hace clic "NUEVA UNIDAD"
       ↓
CreateUnitModal abre (seleccionar tipo)
       ↓
Usuario selecciona tipo y presiona "Continuar"
       ↓
handleSelectType() → actualiza estado selectedType
       ↓
RegistroUnidadInline aparece en la página
       ↓
Usuario completa: nombre, código, sigla, descripción
       ↓
Presiona "Guardar"
       ↓
createUnidadOrganizativa(payload) → API POST
       ↓
Response actualiza lista de unidades
       ↓
handleRegistroSuccess() → Limpia formulario
```

---

## 🔗 Mapeo de Dependencias

| Archivo | Responsabilidad | Importa desde |
|---------|-----------------|---------------|
| `EstructuraOrganizacional.tsx` | Orquestador principal | `@/features/super-admin/components`, `@/features/super-admin/services`, `@/shared/types` |
| `CreateUnitModal.tsx` | UI selección tipo | `@/features/super-admin/services`, `@/shared/types` |
| `RegistroUnidadInline.tsx` | UI formulario | `@/features/super-admin/services`, `@/shared/types` |
| `organizationalService.ts` | API calls | `@/shared/services/http`, `@/shared/types` |
| `organizational.types.ts` (shared) | Modelos | (ninguno) |

**Flujo de imports:**
```
super-admin/components/ 
  ↓
super-admin/services/ + shared/types/
  ↓
shared/services/http + shared/types/backend.types
```

---

## 📡 Ejemplos de Payloads

### Request para crear unidad
```json
{
  "localizacionId": null,
  "tipoUnidadId": 4,
  "unidadPadreId": null,
  "nombre": "Campus Lima",
  "codigo": "CAMPUS-LIMA",
  "sigla": "LIM",
  "descripcion": "Campus principal Lima"
}
```

### Response después de crear
```json
{
  "id": 1,
  "localizacionId": null,
  "localizacionNombre": null,
  "tipoUnidadId": 4,
  "tipoUnidadNombre": "CAMPUS",
  "tipoUnidadNivel": 0,
  "unidadPadreId": null,
  "unidadPadreNombre": null,
  "nombre": "Campus Lima",
  "codigo": "CAMPUS-LIMA",
  "sigla": "LIM",
  "descripcion": "Campus principal Lima",
  "active": true,
  "subordinadas": []
}
```

---

## ✅ Checklist de Implementación

- [x] Tipos de datos (UnidadOrganizativa, UnidadOrganizativaResponse)
- [x] Service layer completo (CRUD operations)
- [x] Modal de selección de tipo
- [x] Formulario inline compacto
- [x] Normalización de null en payloads
- [x] Integración con vista principal
- [ ] Editar unidad organizativa
- [ ] Eliminar unidad organizativa
- [ ] Expandir/colapsar subordinadas
- [ ] Estadísticas de estructura

---

## 🔍 Estructura Organizacional Original

Módulo de administración del sistema que proporciona control total sobre la plataforma LAMB Academic. Incluye gestión de usuarios, roles, permisos, auditoría y configuración avanzada del sistema.

## 🏗️ Estructura

```
src/features/super-admin/
├── api/                    # Servicios API (futuro)
├── components/            # Componentes del módulo
│   ├── DashboardSuperAdmin.tsx       # Dashboard con métricas del sistema
│   ├── GestionUsuarios.tsx           # CRUD de usuarios
│   ├── GestionRolesPermisos.tsx      # Matriz de permisos por rol
│   └── SidebarSuperAdmin.tsx         # Navegación lateral
├── pages/                 # Páginas del módulo
│   └── SuperAdminPage.tsx            # Página principal
├── types/                 # Tipos TypeScript
│   └── index.ts                      # Definiciones de tipos
└── index.ts              # Exports del módulo
```

## 🎯 Funcionalidades Implementadas

### ✅ Dashboard del Sistema
- **KPIs en tiempo real:**
  - Estado de licencia (plan, vencimiento, días restantes)
  - Estudiantes activos vs capacidad máxima
  - Docentes registrados vs límite
  - Programas académicos activos
- **Monitoreo de servicios:**
  - Estado de bases de datos
  - Servicios externos (APIs)
  - Latencia y uptime
- **Alertas del sistema:**
  - Errores críticos
  - Advertencias
  - Información relevante
- **Actividad reciente:**
  - Log de acciones administrativas
  - Usuario y timestamp

### ✅ Gestión de Usuarios
- **Listado completo** con información detallada
- **Filtros avanzados:**
  - Por rol (ADMIN, RECTOR, DECANO, DIRECTOR, SECRETARIO, SOPORTE)
  - Por estado (ACTIVO, BLOQUEADO, INACTIVO)
  - Por unidad organizativa
- **Búsqueda:**
  - Por nombre completo
  - Por username
  - Por email
  - Por DNI
- **Acciones:**
  - Editar usuario
  - Bloquear/Desbloquear cuenta
  - Eliminar usuario
  - Ver intentos de acceso fallidos
- **Vista de datos:**
  - Avatar personalizado
  - Rol con badge de color
  - Estado con indicador visual
  - Unidad organizativa y nivel jerárquico
  - Último acceso

### ✅ Gestión de Roles y Permisos
- **Matriz de permisos** por rol del sistema
- **Categorías de permisos:**
  - **Estudiantes:** Ver, Gestionar, Eliminar
  - **Académico:** Notas (Ver, Registrar, Aprobar), Actas (Ver, Generar, Firmar)
  - **Programas:** Ver, Gestionar, Eliminar
  - **Docentes:** Ver, Gestionar
  - **Reportes:** Ver, Exportar
  - **Sistema:** Auditoría, Configuración, Usuarios, Backups
- **Roles predefinidos:**
  - ROLE_ADMIN: Acceso total
  - ROLE_RECTOR: Supervisión universitaria
  - ROLE_DECANO: Gestión de facultad
  - ROLE_DIRECTOR: Gestión de programa
  - ROLE_SECRETARIO: Documentación oficial
  - ROLE_SOPORTE: Asistencia técnica limitada
- **Toggle interactivo** de permisos por rol
- **Contador de permisos** asignados por rol

### ✅ Configuración Institucional
- **Identidad Institucional:**
  - Nombre de la universidad
  - Código institucional
  - RUC (11 dígitos)
  - Tipo (Pública/Privada)
  - Dominio web
  - Sitio web completo
  - Logo de la universidad (vista y actualización)
- **Información Operativa:**
  - Zona horaria
  - Idioma/Locale
  - Plan de licencia (BASIC, PROFESSIONAL, PREMIUM, ENTERPRISE)
  - Fecha de vencimiento del plan
  - Máximo de estudiantes permitidos
  - Máximo de docentes permitidos
- **Información de Auditoría:**
  - ID de la universidad
  - Estado (Activa/Inactiva/Suspendida)
  - Activo/Inactivo
  - Creado por y fecha de creación
  - Actualizado por y fecha de actualización
  - Total de estudiantes (si aplica)
  - Total de docentes (si aplica)

**APIs Integradas:**
- `GET /api/v1/universidades` - Obtiene todas las universidades
- `GET /api/v1/universidades/{id}` - Obtiene una universidad específica
- `PUT /api/v1/universidades/{id}` - Actualiza los datos de una universidad

**Servicio:** `universidadService.ts`
- `getUniversidades()` - Obtiene todas las universidades
- `getUniversidad(id)` - Obtiene una universidad por ID
- `updateUniversidad(id, payload)` - Actualiza una universidad
- `getUniversidadPrincipal()` - Obtiene la primera universidad (principal)

### 🚧 Módulos en Desarrollo
- Auditoría y Seguridad
- Backups y Logs
- Configuración avanzada (JSON)

## 🚀 Uso

### Acceso al Módulo

El módulo Super Admin está disponible en la vista de bienvenida para usuarios con rol `ADMIN`:

```typescript
// Ruta: /super-admin
// Requiere: rol ADMIN
```

### Integración en la Aplicación

```typescript
// En cualquier componente:
import { SuperAdminPage } from '@/features/super-admin';

// O componentes individuales:
import { 
  DashboardSuperAdmin, 
  GestionUsuarios, 
  GestionRolesPermisos 
} from '@/features/super-admin';
```

## 🎨 Diseño

- **Color principal:** Gradiente rojo-naranja (`from-red-900 to-orange-900`)
- **Layout:** Sidebar fijo + contenido principal scrolleable
- **Responsivo:** Adaptado para desktop (optimizado para pantallas grandes)
- **Componentes:** Diseño limpio y profesional con Tailwind CSS

## 🔐 Seguridad

- **Acceso restringido:** Solo usuarios con rol ADMIN
- **Control de permisos:** Validación en cada acción
- **Auditoría:** Registro de todas las operaciones (futuro)

## 📊 Tipos de Datos

```typescript
// Usuario del sistema
interface Usuario {
  id: string;
  username: string;
  email: string;
  nombreCompleto: string;
  dni: string;
  rol: string;
  estado: 'ACTIVO' | 'BLOQUEADO' | 'INACTIVO';
  intentosFallidos: number;
  ultimoAcceso: string;
  fechaCreacion: string;
  unidadOrganizativaId: string;
  unidadOrganizativaNombre: string;
  nivelOrganizativo: 0 | 1 | 2;
}

// Permiso del sistema
interface Permiso {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
}

// Rol con permisos
interface RolPermisos {
  rol: string;
  nombre: string;
  descripcion: string;
  color: string;
  permisos: Set<string>;
}
```

## 🔄 Próximas Mejoras

1. **Integración con API backend**
   - Endpoints para CRUD de usuarios
   - Endpoints para gestión de roles
   - WebSocket para actualizaciones en tiempo real

2. **Auditoría completa**
   - Log detallado de acciones
   - Exportación de logs
   - Dashboard de auditoría

3. **Configuración del sistema**
   - Variables de entorno
   - Configuración de módulos
   - Personalización de la plataforma

4. **Backups automatizados**
   - Programación de backups
   - Restauración de datos
   - Monitoreo de integridad

5. **Notificaciones**
   - Alertas por email
   - Notificaciones push
   - Panel de notificaciones

## 👥 Contribución

Al agregar nuevas funcionalidades al módulo Super Admin:

1. Mantener la estructura de carpetas
2. Usar TypeScript y tipos definidos
3. Seguir los patrones de diseño existentes
4. Documentar componentes con comentarios
5. Actualizar este README

## 📝 Notas

- Los datos actuales son **mock data** para demostración
- Se recomienda implementar paginación para listas grandes
- Los permisos deben validarse tanto en frontend como backend
- El módulo está optimizado para uso administrativo (no móvil)
