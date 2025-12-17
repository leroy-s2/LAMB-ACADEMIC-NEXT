'use client';

import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/libs/redux/hooks';
import { Topbar } from '@/features/super-admin/components/Topbar';
import { getIconComponent } from '@/shared/utils/iconMapper';
import {
    Shield,
    ChevronLeft,
    ChevronRight,
    Folder,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { LayoutProvider, useLayout } from '@/features/super-admin/context/LayoutContext';

interface SuperAdminLayoutProps {
    children: ReactNode;
}

/**
 * Contenido interno del layout que usa el contexto
 */
function LayoutContent({ children }: SuperAdminLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { isFullscreen } = useLayout();

    const user = useAppSelector((state) => state.user.currentUser);
    const { islaActiva } = useAppSelector((state) => state.permissions);

    // Cargar estado del sidebar desde localStorage
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

    // Obtener items del sidebar desde la isla activa (del backend)
    const sidebarItems = islaActiva?.sidebarTargets
        ? [...islaActiva.sidebarTargets].sort((a, b) => a.orden - b.orden)
        : [];

    // Nombre del usuario para el topbar
    const userName = user?.nombreCompleto || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Usuario';
    const userInitials = userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar con diseño original - animación de ocultado */}
            {!isFullscreen && (
            <aside
                className={`
                    ${isCollapsed ? 'w-20' : 'w-64'} 
                    bg-gradient-to-b from-slate-950 to-blue-950 text-white flex flex-col h-screen 
                    transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0
                `}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield
                            className={`w-8 h-8 text-emerald-300 ${isCollapsed ? 'mx-auto' : ''}`}
                        />
                        {!isCollapsed && (
                            <div>
                                <h2 className="font-semibold text-lg">{islaActiva?.nombre || 'Super Admin'}</h2>
                                <p className="text-xs text-emerald-200">{islaActiva?.descripcion || 'Panel Técnico'}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation - 100% dinámico */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <div className="space-y-1">
                        {sidebarItems.map((item) => {
                            const IconComponent = getIconComponent(item.icono, Folder);
                            const isActive = pathname === item.rutaFrontend || pathname.startsWith(item.rutaFrontend + '/');

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => router.push(item.rutaFrontend)}
                                    className={`
                                        w-full flex items-center gap-3 ${isCollapsed ? 'justify-center px-4' : 'px-6'} py-2.5 text-sm transition-all
                                        ${isActive
                                            ? 'bg-white/10 text-white font-medium border-r-4 border-emerald-500'
                                            : 'text-blue-100 hover:bg-white/5 hover:text-white'
                                        }
                                    `}
                                    title={isCollapsed ? item.nombre : ''}
                                >
                                    <IconComponent className="w-5 h-5 shrink-0" />
                                    {!isCollapsed && <span>{item.nombre}</span>}
                                </button>
                            );
                        })}
                    </div>
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
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar - oculto en fullscreen */}
                {!isFullscreen && (
                    <Topbar userName={userName} userInitials={userInitials} />
                )}
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}

/**
 * Layout para las páginas de super-admin que mantiene el diseño original
 * pero usa navegación por rutas en lugar de switch de views
 */
export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
    return (
        <LayoutProvider>
            <LayoutContent>{children}</LayoutContent>
        </LayoutProvider>
    );
}
