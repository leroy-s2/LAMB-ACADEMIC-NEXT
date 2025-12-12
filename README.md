# 🎓 Lamb Academic - Sistema de Gestión Académica

Sistema académico modular desarrollado con Next.js 15, TypeScript, Redux Toolkit y Tailwind CSS.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev          # http://localhost:3000

# Producción
npm run build
npm start

# Linting
npm run lint
```

## 📁 Estructura del Proyecto

```
lamb-academic-next/
├── app/                    # App Router de Next.js
│   ├── (auth)/            # Rutas de autenticación
│   │   ├── log/           # Login
│   │   └── register/      # Registro
│   ├── (portal)/          # Rutas protegidas
│   │   └── portal/        # Dashboard
│   ├── layout.tsx         # Layout raíz
│   └── page.tsx           # Landing page
├── components/            # Componentes globales
├── features/              # Módulos por funcionalidad
│   ├── auth/             # Autenticación
│   └── landing/          # Landing
├── hooks/                # Custom hooks
├── lib/                  # Librerías
│   ├── redux/           # Redux store
│   └── utils.ts
├── shared/              # Compartidos
│   ├── components/
│   ├── layouts/
│   ├── services/
│   └── types/
├── middleware.ts        # Protección de rutas
└── tailwind.config.ts
```

## 🎯 Arquitectura Modular

Cada feature contiene:
- `components/` - UI específicos
- `hooks/` - Custom hooks
- `pages/` - Páginas principales
- `services/` - Lógica de API
- `types/` - Tipos TypeScript

## 🛣️ Rutas

### Públicas
- `/` - Landing
- `/log` - Login
- `/register` - Registro

### Protegidas
- `/portal` - Dashboard
- `/portal/*` - Módulos

## 🔐 Autenticación

- JWT tokens (access + refresh)
- Renovación automática
- Protección con middleware
- Persistencia en localStorage

## 📦 Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State**: Redux Toolkit
- **Styling**: Tailwind CSS
- **HTTP**: Axios
- **Auth**: JWT

## 🎨 Temas

Dark/Light mode con:
- Redux state management
- Persistencia localStorage
- Tailwind CSS dinámico

## 📝 Convenciones

- `'use client'` para componentes con hooks
- Path alias `@/` en imports
- PascalCase para componentes
- camelCase para hooks/utils

## 🔧 Variables de Entorno

Crear `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2025
