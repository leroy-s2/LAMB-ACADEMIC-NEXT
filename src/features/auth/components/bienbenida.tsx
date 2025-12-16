'use client';

import { useAppSelector } from '../../../libs/redux/hooks';
import { useAppDispatch } from '../../../libs/redux/hooks';
import { setIslaActiva } from '../../../libs/redux/slices/permissionsSlice';
import { clearUser } from '../../../libs/redux/slices/userSlice';
import { logout as logoutAuth } from '../../../libs/redux/slices/authSlice';
import { clearPermissions } from '../../../libs/redux/slices/permissionsSlice';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { renderIcon } from '@/shared/utils/iconMapper';
import type { Isla } from '@/shared/types/permissions.types';

// Sin fondo por defecto - se carga desde la API
const DEFAULT_BACKGROUND = '';

export default function WelcomePage() {
  const user = useAppSelector((state) => state.user.currentUser);
  const { islas } = useAppSelector((state) => state.permissions);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState(DEFAULT_BACKGROUND);

  // Estado para evitar mismatch de hidratación
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadBackgroundConfig = async () => {
      try {
        const response = await fetch('/api/v1/public/universidad/configuracion/elemento/pantalla_principal');
        const data = await response.json();

        if (data.success && data.data?.url) {
          setBackgroundUrl(data.data.url);
          console.log('✅ Fondo del portal cargado:', data.data.url);
        }
      } catch (error) {
        console.log('ℹ️ Usando fondo por defecto para portal');
      }
    };

    loadBackgroundConfig();
  }, []);

  // Obtener nombre para mostrar
  const displayName = user?.firstName || user?.nombre || 'Usuario';
  const fullName = user?.nombreCompleto ||
    (user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'Usuario');

  const handleLogout = () => {
    // Limpiar refreshToken de localStorage
    localStorage.removeItem('_rt');

    // Limpiar todo el estado de Redux (memoria)
    dispatch(logoutAuth());
    dispatch(clearUser());
    dispatch(clearPermissions());

    // Navegar al login
    router.push('/login');
  };

  const handleIslaClick = (isla: Isla) => {
    // Establecer la isla como activa
    dispatch(setIslaActiva(isla));
    // Navegar a la ruta default de la isla
    router.push(isla.rutaDefault);
  };

  const avatarUrl = user
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1e40af&color=fff&size=200&bold=true`
    : 'https://ui-avatars.com/api/?name=UPeU&background=1e40af&color=fff&size=200';

  // Obtener roles para mostrar
  const userRoles = user?.rolesBase || (user?.role ? [user.role] : ['USER']);
  const roleName = getRoleName(userRoles[0]);

  // Mostrar loading mientras se monta el componente (evita mismatch de hidratación)
  if (!mounted) {
    return (
      <div className="relative w-screen h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen flex overflow-hidden">
      {/* 🎨 Background con overlay gradiente */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: !backgroundUrl ? '#1e3a5f' : undefined,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900/50 to-indigo-900/40 z-0" />

      {/* 📦 Área de módulos (lado izquierdo) */}
      <div className="relative flex-1 flex flex-col h-screen z-10 px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header fijo */}
        <div className="flex-shrink-0 pt-6 pb-4 sm:pt-8 sm:pb-6">
          <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-1 sm:mb-2">
            Bienvenido, {displayName}
          </h1>
          <p className="text-white/70 text-sm sm:text-base lg:text-lg">
            Selecciona un módulo para continuar
          </p>
        </div>

        {/* 🏝️ Islas de acceso (módulos disponibles) - Área con scroll interno */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5 pr-2">
            {islas.length > 0 ? (
              islas
                .slice()
                .sort((a, b) => a.orden - b.orden)
                .map((isla) => (
                  <div
                    key={isla.id}
                    className={`
                      relative group cursor-pointer
                      rounded-xl p-5 lg:p-6 shadow-lg
                      transform transition-all duration-300 ease-out
                      hover:scale-105 hover:shadow-2xl
                      border border-white/20 backdrop-blur-sm
                      h-[160px] sm:h-[180px] lg:h-[200px]
                      ${hoveredModule === isla.id ? 'ring-2 ring-white/50' : ''}
                    `}
                    style={{
                      background: `linear-gradient(135deg, ${isla.color}cc, ${isla.color}99)`,
                    }}
                    onClick={() => handleIslaClick(isla)}
                    onMouseEnter={() => setHoveredModule(isla.id)}
                    onMouseLeave={() => setHoveredModule(null)}
                  >
                    {/* Efecto de brillo cristalino */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-xl transition-all duration-300" />
                    <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-white/5 blur-2xl rounded-full" />

                    <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
                      <div className="text-white mb-2 lg:mb-3 transform group-hover:scale-110 transition-transform duration-300">
                        {renderIcon(isla.icono, { className: 'w-12 h-12 lg:w-14 lg:h-14' })}
                      </div>
                      <h3 className="text-white font-bold text-xs lg:text-sm leading-tight px-2 mb-1">
                        {isla.nombre}
                      </h3>
                      <p className="text-white/70 text-[10px] lg:text-xs line-clamp-2 px-2">
                        {isla.descripcion}
                      </p>
                      {isla.esIslaPrincipal && (
                        <span className="mt-2 px-2 py-0.5 bg-white/20 rounded-full text-[9px] text-white/80">
                          Principal
                        </span>
                      )}
                    </div>

                    {/* Indicador de hover */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                ))
            ) : (
              <div className="col-span-full flex items-center justify-center h-full min-h-[300px]">
                <div className="text-white/60 text-center">
                  <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="font-medium text-lg sm:text-xl">No tienes módulos disponibles</p>
                  <p className="text-sm mt-2">Contacta con el administrador para obtener acceso</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 👤 Panel lateral derecho (Perfil de usuario) */}
      <div className="relative z-10 w-[80%] sm:w-[75%] lg:w-[360px] h-screen bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl flex flex-col border-l border-white/10 shadow-2xl md:w-[400px]">
        {/* Logo institucional */}
        <div className="flex-shrink-0 flex flex-col items-center pt-6 px-4">
          <img
            src="https://res.cloudinary.com/df6m46xxz/image/upload/v1759692970/descarga_poy9qy.png"
            alt="Logo UPeU"
            className="h-16 sm:h-20 mb-4 drop-shadow-lg"
          />
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Información del usuario - Área central con scroll */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center justify-start px-4 py-6 space-y-4">
          {/* Avatar con efecto minimalista */}
          <div className="flex-shrink-0">
            <div className="relative w-24 h-24 rounded-2xl ring-1 ring-white/20 overflow-hidden shadow-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm">
              <img
                src={user?.fotoUrl || avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Datos del usuario */}
          <div className="text-center">
            <h2 className="text-white text-xl font-bold mb-1">
              {fullName}
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-2 backdrop-blur-sm border border-white/20">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-xs font-medium">{roleName}</span>
            </div>
            <p className="text-white/60 text-xs px-2">
              {user?.email || 'usuario@upeu.edu.pe'}
            </p>
          </div>

          {/* Badges de roles */}
          <div className="flex flex-wrap gap-2 justify-center">
            {userRoles.map((role) => (
              <span
                key={role}
                className="px-2.5 py-1 bg-white/10 text-white/80 rounded-lg text-[10px] font-medium border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-colors"
              >
                {getRoleName(role)}
              </span>
            ))}
          </div>

          {/* Tarjeta de información compacta */}
          <div className="w-full bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{islas.length}</div>
              <div className="text-white/60 text-xs">Módulos accesibles</div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-[10px] text-white/50 space-y-0.5">
                  <p>✓ Conectado</p>
                  <p>✓ Sesión activa</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex-shrink-0 px-4 py-4 space-y-2 border-t border-white/10">
          <button
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 transform hover:scale-[1.02] text-xs"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
          <button
            className="w-full bg-white/10 hover:bg-white/20 text-white/90 font-medium py-2 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 text-xs"
            onClick={() => router.push('/forgot-password')}
          >
            Cambiar Contraseña
          </button>
        </div>

        {/* Footer decorativo */}
        <div className="flex-shrink-0 px-4 py-2 text-center border-t border-white/10">
          <p className="text-white/30 text-[10px]">UPeU - Sistema de Administración</p>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}

// 🎭 Helper para obtener nombres de roles legibles
function getRoleName(role: string): string {
  const roleNames: Record<string, string> = {
    ADMIN: 'Administrador',
    SUPER_ADMIN: 'Super Administrador',
    TEACHER: 'Docente',
    STUDENT: 'Estudiante',
    STAFF: 'Personal',
    RECTOR: 'Rector',
    DECANO: 'Decano',
    DIRECTOR: 'Director',
    SECRETARIO: 'Secretario',
    USER: 'Usuario',
  };
  return roleNames[role] || role;
}
