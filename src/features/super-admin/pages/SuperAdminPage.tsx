'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuperAdminViewType } from '../types';
import { SidebarSuperAdmin } from '../components/SidebarSuperAdmin';
import { Topbar } from '../components/Topbar';
import { DashboardSuperAdmin } from '../components/DashboardSuperAdmin';
import { GestionUsuarios } from '../components/GestionUsuarios';
import { GestionRolesPermisos } from '../components/GestionRolesPermisos';
import { AuditoriaSeguridad } from '../components/AuditoriaSeguridad';
import { SistemaBackups } from '../components/SistemaBackups';
import { ConfiguracionInstitucional } from '../components/ConfiguracionInstitucional';
import { EstructuraOrganizacional } from '../components/EstructuraOrganizacional';
import { PermisosIndividuales } from '../components/PermisosIndividuales';
import { CatalogosMaestros } from '../components/catalogos-maestros';

export function SuperAdminPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<SuperAdminViewType>('dashboard');

  const handleLogout = () => {
    // Aquí irá la lógica de logout del sistema
    router.push('/login');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardSuperAdmin />;
      case 'usuarios':
        return <GestionUsuarios />;
      case 'roles-permisos':
        return <GestionRolesPermisos />;
      case 'institucion':
        return <ConfiguracionInstitucional />;
      case 'organizacion':
        return <EstructuraOrganizacional />;
      case 'permisos-individuales':
        return <PermisosIndividuales />;
      case 'auditoria':
        return <AuditoriaSeguridad />;
      case 'catalogos':
        return <CatalogosMaestros />;
      case 'backups':
        return <SistemaBackups />;
      default:
        return <DashboardSuperAdmin />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarSuperAdmin currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">{renderView()}</main>
      </div>
    </div>
  );
}
