'use client';

import React from 'react';
import {
    ShieldCheck,
    Building,
    Tags,
    Crown,
    MapPin,
    Network,
    Lock,
    Home,
    Users,
    Settings,
    FileText,
    Calendar,
    BarChart3,
    BookOpen,
    GraduationCap,
    Briefcase,
    Bell,
    Mail,
    Folder,
    Database,
    Globe,
    Layers,
    type LucideIcon
} from 'lucide-react';

/**
 * Mapeo de nombres de iconos (del backend) a componentes de Lucide
 */
const iconMap: Record<string, LucideIcon> = {
    // Administración
    'shield-check': ShieldCheck,
    'shield': ShieldCheck,
    'lock': Lock,
    'settings': Settings,

    // Estructura organizativa
    'building': Building,
    'building-2': Building,
    'sitemap': Network,
    'network': Network,
    'layers': Layers,

    // Catálogos
    'tags': Tags,
    'crown': Crown,
    'map-pin': MapPin,
    'location': MapPin,

    // Navegación general
    'home': Home,
    'dashboard': Home,
    'users': Users,
    'user': Users,

    // Documentos
    'file-text': FileText,
    'document': FileText,
    'folder': Folder,

    // Académico
    'book-open': BookOpen,
    'book': BookOpen,
    'graduation-cap': GraduationCap,
    'academic': GraduationCap,

    // Otros
    'calendar': Calendar,
    'chart': BarChart3,
    'bar-chart': BarChart3,
    'briefcase': Briefcase,
    'bell': Bell,
    'mail': Mail,
    'database': Database,
    'globe': Globe,
};

/**
 * Obtiene el componente de icono correspondiente al nombre
 * @param name - Nombre del icono (como viene del backend)
 * @param fallback - Icono por defecto si no se encuentra
 * @returns Componente de Lucide
 */
export function getIconComponent(name: string, fallback: LucideIcon = Folder): LucideIcon {
    const normalizedName = name.toLowerCase().replace(/_/g, '-');
    return iconMap[normalizedName] || fallback;
}

/**
 * Renderiza un icono dado su nombre
 * @param name - Nombre del icono
 * @param props - Props adicionales para el icono
 */
export function renderIcon(
    name: string,
    props?: { className?: string; size?: number }
): React.ReactNode {
    const IconComponent = getIconComponent(name);
    return <IconComponent {...props} />;
}

/**
 * Hook para obtener un icono como componente
 */
export function useIcon(name: string): LucideIcon {
    return getIconComponent(name);
}

export default iconMap;
