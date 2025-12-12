# Lamb Academic - Estructura de Proyecto

## 📁 Nueva Estructura del Proyecto

El proyecto ha sido reorganizado siguiendo una arquitectura escalable y modular:

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Routes públicas (sin autenticación)
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   │
│   ├── (private)/                # Routes privadas (requieren autenticación)
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── users/
│   │   │   ├── roles/
│   │   │   └── permissions/
│   │   ├── ppp/
│   │   ├── estudiantes/
│   │   ├── docentes/
│   │   ├── empresas/
│   │   └── auditoria/
│   │
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (redirige a login o dashboard)
│   └── globals.css               # Estilos globales
│
├── features/                     # Lógica de negocio modularizada
│   ├── auth/                     # Feature: Autenticación
│   │   ├── api/                  # Llamadas API
│   │   ├── hooks/                # Hooks personalizados
│   │   ├── slices/               # Redux slices
│   │   ├── types.ts              # Tipos TypeScript
│   │   └── index.ts              # Exports públicos
│   │
│   ├── usuarios/                 # Feature: Gestión de Usuarios
│   ├── roles/                    # Feature: Gestión de Roles
│   ├── ppp/                      # Feature: Programa de Prácticas
│   ├── auditoria/                # Feature: Auditoría
│   └── [otros features]/
│
├── components/                   # Componentes reutilizables
│   ├── ui/                       # Componentes base: Button, Input, Table, Modal
│   ├── layout/                   # Componentes de layout
│   ├── common/                   # Componentes comunes: ErrorBoundary, LoadingSpinner
│   └── index.ts                  # Exports centralizados
│
├── libs/                         # Configuración y utilidades
│   ├── axios.ts                  # Instancia de Axios configurada
│   ├── permissions.ts            # Lógica de permisos
│   ├── constants.ts              # Constantes globales
│   ├── utils.ts                  # Utilidades generales
│   └── redux/                    # Redux Toolkit
│       ├── store.ts
│       ├── provider.tsx
│       ├── middlewares/
│       └── slices/
│
├── hooks/                        # Hooks globales y compartidos
│   ├── useAuth.tsx
│   ├── useInitializeAuth.ts
│   ├── useTokenRefresh.ts
│   └── index.ts
│
├── store/                        # Redux state management
│   ├── store.ts                  # Configuración del store
│   ├── rootReducer.ts
│   ├── middlewares/
│   └── slices/
│
├── types/                        # Tipos globales
│   ├── user.ts
│   ├── role.ts
│   ├── api.ts
│   └── index.ts
│
├── assets/                       # Archivos estáticos
│   ├── images/
│   └── icons/
│
└── shared/                       # Código compartido heredado (a refactorizar)
    └── [será eliminado gradualmente]
```

## 🎯 Principios de Organización

### **1. Rutas de Importación**

Usar los alias configurados en `tsconfig.json`:

```tsx
// ✅ Correcto
import { Button } from '@/components';
import { useAuth } from '@/hooks';
import { loginUser } from '@/features/auth/api';

// ❌ Evitar rutas relativas largas
import { Button } from '../../../components/ui/Button';
```

### **2. Estructura de Features**

Cada feature es independiente con su propia lógica:

```
features/auth/
├── api/              # Funciones de API
├── hooks/            # Hooks específicos del feature
├── slices/           # Redux slices
├── components/       # Componentes internos (opcional)
├── types.ts          # Tipos TypeScript
└── index.ts          # Exports públicos
```

### **3. Componentes Reutilizables**

- **`components/ui/`**: Componentes de diseño básico (100% reutilizable)
- **`components/common/`**: Componentes funcionales comunes
- **`components/layout/`**: Layouts y estructuras de página

### **4. Configuración Global**

- **`libs/`**: Todas las configuraciones globales (Axios, Redux, permisos, constantes)
- **`hooks/`**: Hooks que se usan en múltiples features
- **`types/`**: Tipos que se comparten globalmente

## 📝 Ejemplos de Uso

### Importar un componente

```tsx
import { Button, Input } from '@/components';
import { AdminLayout } from '@/components';
```

### Usar un hook

```tsx
import { useAuth } from '@/hooks';

export function Dashboard() {
  const { user, logout } = useAuth();
  // ...
}
```

### Usar lógica de un feature

```tsx
import { loginUser } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/hooks';

export function LoginForm() {
  const { dispatch } = useAuthStore();
  // ...
}
```

## 🔧 Configuración

### Alias de Rutas (`tsconfig.json`)

```json
"paths": {
  "@/*": ["./src/*"],
  "@/components/*": ["./src/components/*"],
  "@/features/*": ["./src/features/*"],
  "@/libs/*": ["./src/libs/*"],
  "@/hooks/*": ["./src/hooks/*"],
  "@/types/*": ["./src/types/*"],
  "@/assets/*": ["./src/assets/*"]
}
```

### Content Paths (Tailwind)

```js
content: [
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
]
```

## 🚀 Próximos Pasos

1. Migrar tipos de `shared/types/` a `src/types/`
2. Centralizar servicios en `features/[feature]/api/`
3. Crear componentes reutilizables en `components/ui/`
4. Documentar la API de cada feature en un `README.md`
5. Eliminar completamente la carpeta `shared/`

---

**Última actualización**: Diciembre 2025
