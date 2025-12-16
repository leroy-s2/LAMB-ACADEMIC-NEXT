'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Moon, User, Home, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProfileModal } from '@/shared/components/ProfileModal';
import { NotificationsPanel } from '@/shared/components/NotificationsPanel';
import { useUniversalProfile } from '@/hooks/useUniversalProfile';
import { Notification } from '@/shared/types/notification.types';

interface TopbarProps {
  userName?: string;
  userInitials?: string;
}

export function Topbar({ userName = 'Angel Leroy', userInitials = 'AL' }: TopbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const userProfile = useUniversalProfile();

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'payment',
      title: 'Pago de matrícula vencido',
      message: 'Tu pago de matrícula del semestre actual vencerá el 15 de diciembre. Por favor, realiza el pago antes de esta fecha.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      action: {
        label: 'Pagar ahora',
        href: '/payments',
      },
    },
    {
      id: '2',
      type: 'grades',
      title: 'Notas publicadas - Matemática I',
      message: 'El docente ha publicado las notas del segundo examen parcial.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
      action: {
        label: 'Ver nota',
        href: '/grades',
      },
    },
    {
      id: '3',
      type: 'document',
      title: 'Certificado de matrícula disponible',
      message: 'Tu certificado de matrícula para el semestre 2025-I está disponible para descarga.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true,
      action: {
        label: 'Descargar',
        href: '/certificates',
      },
    },
    {
      id: '4',
      type: 'message',
      title: 'Mensaje de tu asesor académico',
      message: 'Tu asesor académico te ha enviado un mensaje importante sobre tu plan de estudios.',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      read: true,
    },
    {
      id: '5',
      type: 'grades',
      title: 'Notas publicadas - Física II',
      message: 'El docente ha publicado las notas del primer examen parcial.',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      read: true,
      action: {
        label: 'Ver nota',
        href: '/grades',
      },
    },
    {
      id: '6',
      type: 'payment',
      title: 'Pago recibido correctamente',
      message: 'Tu pago de $1,500.00 ha sido procesado correctamente. Gracias.',
      timestamp: new Date(Date.now() - 345600000).toISOString(),
      read: true,
    },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="h-16 bg-gradient-to-r from-slate-100 to-blue-50 border-b border-blue-200 flex items-center justify-between px-8 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en el sistema..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Theme toggle button */}
        <button 
          className="p-2 text-gray-500 hover:bg-blue-100 rounded-lg transition-colors"
          title="Cambiar tema (próximamente)"
        >
          <Moon className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 text-gray-500 hover:bg-blue-100 rounded-lg transition-colors"
          title="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {mockNotifications.filter((n) => !n.read).length}
          </span>
        </button>

        {/* User menu */}
        <div className="relative pl-4 border-l border-blue-200" ref={menuRef}>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 hover:bg-blue-100 rounded-lg px-3 py-2 transition-colors"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-slate-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{userInitials}</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setShowProfileModal(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Ver perfil</span>
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  router.push('/portal');
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Volver a pantalla principal</span>
              </button>
              <div className="my-1 border-t border-gray-100"></div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  router.push('/log');
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profile={userProfile}
        />
      )}

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={mockNotifications}
      />
    </div>
  );
}
