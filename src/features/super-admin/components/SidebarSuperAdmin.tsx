'use client';

import { useState, useEffect } from 'react';
import { SuperAdminViewType } from '../types';
import {
  LayoutDashboard,
  Users,
  Lock,
  Shield,
  Database,
  Server,
  Settings,
  Building,
  Network,
  UserCog,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarSuperAdminProps {
  currentView: SuperAdminViewType;
  onViewChange: (view: SuperAdminViewType) => void;
}

export function SidebarSuperAdmin({
  currentView,
  onViewChange,
}: SidebarSuperAdminProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };
  const menuSections = [
    {
      title: 'Principal',
      items: [
        { id: 'dashboard' as SuperAdminViewType, label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Configuración',
      items: [
        { id: 'institucion' as SuperAdminViewType, label: 'Institución', icon: Building },
        { id: 'organizacion' as SuperAdminViewType, label: 'Organización', icon: Network },
      ],
    },
    {
      title: 'Seguridad',
      items: [
        { id: 'usuarios' as SuperAdminViewType, label: 'Usuarios', icon: Users },
        { id: 'roles-permisos' as SuperAdminViewType, label: 'Roles y Permisos', icon: Lock },
        { id: 'permisos-individuales' as SuperAdminViewType, label: 'Permisos Individuales', icon: UserCog },
        { id: 'auditoria' as SuperAdminViewType, label: 'Auditoría', icon: Shield },
      ],
    },
    {
      title: 'Sistema',
      items: [
        { id: 'catalogos' as SuperAdminViewType, label: 'Catálogos', icon: Database },
        { id: 'backups' as SuperAdminViewType, label: 'Backups y Logs', icon: Server },
      ],
    },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-slate-950 to-blue-950 text-white flex flex-col h-screen transition-all duration-300`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <Shield className={`${isCollapsed ? 'w-8 h-8' : 'w-8 h-8'} text-emerald-300 ${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-lg">Super Admin</h2>
              <p className="text-xs text-emerald-200">Panel Técnico</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-6 text-xs font-semibold text-emerald-200 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}
            {isCollapsed && (
              <div className="h-px bg-white/10 mx-4 mb-2"></div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`
                      w-full flex items-center gap-3 ${isCollapsed ? 'justify-center px-4' : 'px-6'} py-2.5 text-sm transition-all
                      ${
                        isActive
                          ? 'bg-white/10 text-white font-medium border-r-4 border-emerald-500'
                          : 'text-blue-100 hover:bg-white/5 hover:text-white'
                      }
                    `}
                    title={isCollapsed ? item.label : ''}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer - Toggle button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          title={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Contraer</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
