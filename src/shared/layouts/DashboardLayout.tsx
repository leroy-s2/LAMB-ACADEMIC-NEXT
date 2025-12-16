'use client';

import { useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/libs/redux/hooks';
import { useLogout } from '@/features/auth/hooks';
import { toggleTheme } from '@/libs/redux/themes/themeSlice';
import { getIconComponent } from '@/shared/utils/iconMapper';
import type { SidebarTarget } from '@/shared/types/permissions.types';
import {
  Moon,
  Sun,
  Search,
  ChevronRight,
  Menu,
  LogOut,
  User,
  LayoutDashboard,
  ChevronLeft,
  ChevronDown,
  Home,
  Folder
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  customMenuItems?: MenuSection[];
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
  subItems?: MenuItem[];
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

export default function DashboardLayout({
  children,
  title,
  showBackButton = false,
  onBack,
  customMenuItems
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const user = useAppSelector((state) => state.user.currentUser);
  const { islaActiva } = useAppSelector((state) => state.permissions);
  const theme = useAppSelector((state) => state.theme.current);
  const dispatch = useAppDispatch();

  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useLogout();

  // Generar menú dinámicamente desde sidebarTargets
  const dynamicMenuSections = useMemo((): MenuSection[] => {
    if (!islaActiva?.sidebarTargets?.length) {
      // Menú fallback si no hay isla activa
      return [{
        items: [{
          id: 'home',
          label: 'Inicio',
          route: '/portal',
          icon: <Home className="w-5 h-5" />,
        }]
      }];
    }

    // Ordenar por orden y mapear a MenuItem
    const sortedTargets = [...islaActiva.sidebarTargets].sort(
      (a: SidebarTarget, b: SidebarTarget) => a.orden - b.orden
    );

    const menuItems: MenuItem[] = sortedTargets.map((target: SidebarTarget) => {
      const IconComponent = getIconComponent(target.icono, Folder);
      return {
        id: target.id,
        label: target.nombre,
        route: target.rutaFrontend,
        icon: <IconComponent className="w-5 h-5" />,
      };
    });

    return [{
      title: islaActiva.nombre,
      items: menuItems,
    }];
  }, [islaActiva]);

  // Usar customMenuItems si se proporcionan, sino usar dinámicos
  const menuSections = customMenuItems || dynamicMenuSections;

  const onLogout = () => {
    logout();
  };

  const avatarUrl = user
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.nombreCompleto || `${user.firstName ?? ''} ${user.lastName ?? ''}`
    )}&background=173a6b&color=fff&size=128`
    : 'https://ui-avatars.com/api/?name=UPeU&background=173a6b&color=fff&size=128';

  const handleMenuClick = (item: MenuItem) => {
    if (item.subItems) {
      if (!isSidebarOpen) setIsSidebarOpen(true);
      setExpandedMenus(prev =>
        prev.includes(item.id)
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else {
      router.push(item.route);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    }
  };

  const handleBackToDashboard = () => {
    router.push('/portal');
    setIsUserMenuOpen(false);
  };

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);

    // Mapeo dinámico de rutas basado en sidebarTargets
    const routeNames: Record<string, string> = {
      portal: 'Portal',
      admin: 'Administración',
      dashboard: 'Dashboard',
    };

    // Agregar rutas dinámicas desde la isla activa
    if (islaActiva?.sidebarTargets) {
      for (const target of islaActiva.sidebarTargets) {
        const lastSegment = target.rutaFrontend.split('/').pop();
        if (lastSegment) {
          routeNames[lastSegment] = target.nombre;
        }
      }
    }

    return (
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const name = routeNames[segment] || segment;

          return (
            <div key={segment} className="flex items-center">
              {index > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
              <span className={`${isLast ? 'font-medium text-gray-900 dark:text-gray-100' : ''} capitalize`}>
                {name.replace(/-/g, ' ')}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isActive =
      pathname === item.route ||
      (item.route !== '/' && pathname.startsWith(item.route) &&
        (pathname.length === item.route.length || pathname[item.route.length] === '/'));

    const isExpanded = expandedMenus.includes(item.id);
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => handleMenuClick(item)}
          className={`
            w-full flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden
            ${isActive && !hasSubItems
              ? 'bg-blue-50 dark:bg-slate-800/50 text-blue-600 dark:text-blue-400 shadow-sm border-l-4 border-blue-500 dark:border-blue-400'
              : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-slate-200'
            }
            ${level > 0 ? 'pl-10 text-sm py-2' : ''}
          `}
        >
          {isActive && !hasSubItems && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent dark:from-blue-400/5 opacity-100" />
          )}

          <span className={`flex-shrink-0 relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
            {item.icon}
          </span>

          <span className={`ml-3 whitespace-nowrap font-medium relative z-10 transition-all duration-300 flex-1 text-left ${isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'}`}>
            {item.label}
          </span>

          {hasSubItems && isSidebarOpen && (
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          )}

          {!isSidebarOpen && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-xs rounded-md shadow-xl border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-200">
              {item.label}
            </div>
          )}
        </button>

        {hasSubItems && isExpanded && isSidebarOpen && (
          <div className="mt-1 space-y-1">
            {item.subItems!.map(subItem => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-slate-950 flex overflow-hidden font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className={`
          relative z-20 flex flex-col transition-all duration-300 ease-in-out shadow-xl
          ${isSidebarOpen ? 'w-64' : 'w-20'}
          bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-slate-800 px-4">
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <img
              src="https://res.cloudinary.com/df6m46xxz/image/upload/v1759970308/Captura_de_pantalla_2025-10-08_184715-removebg-preview_tkekck.png"
              alt="Logo UPeU"
              className="h-8 w-auto flex-shrink-0"
            />
            <div className="absolute inset-0 hidden dark:block bg-indigo-500/10 mix-blend-overlay" />
          </div>
        </div>

        {/* Isla activa indicator */}
        {islaActiva && isSidebarOpen && (
          <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
            <div
              className="flex items-center gap-2 px-2 py-1 rounded-lg"
              style={{ backgroundColor: `${islaActiva.color}15` }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: islaActiva.color }}
              />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                {islaActiva.nombre}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {menuSections.map((section, index) => (
            <div key={index} className="mb-4">
              {section.title && isSidebarOpen && (
                <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              {section.title && !isSidebarOpen && (
                <div className="px-4 mb-2 h-4 border-b border-gray-100 dark:border-slate-800"></div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => renderMenuItem(item))}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Toggle Button (Bottom) */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-white/5 transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 dark:bg-slate-950">
        {/* Topbar */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-300">

          {/* Left: Breadcrumbs & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden md:block">
              {getBreadcrumbs()}
            </div>
          </div>

          {/* Right: Search, Theme, User */}
          <div className="flex items-center gap-3">
            {/* Search Bar (Optional/Visual) */}
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-slate-800 rounded-full px-3 py-1.5 border border-transparent focus-within:border-blue-500 transition-colors">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-32 text-gray-700 dark:text-gray-200 placeholder-gray-400"
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
              >
                <img
                  src={user?.fotoUrl || avatarUrl}
                  alt="Avatar"
                  className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                />
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                  {user?.firstName || user?.nombre || 'Usuario'}
                </span>
              </button>

              {/* Dropdown */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-800 py-2 z-40 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user?.nombreCompleto || (user ? `${user.firstName} ${user.lastName}` : 'Usuario Sistema')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email || 'usuario@upeu.edu.pe'}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleBackToDashboard}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Pantalla de inicio
                      </button>
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Mi Perfil
                      </button>
                    </div>

                    <div className="border-t border-gray-100 dark:border-slate-800 py-1">
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6 transition-all duration-300">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="mb-4 flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Volver
            </button>
          )}

          {title && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
            </div>
          )}

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

