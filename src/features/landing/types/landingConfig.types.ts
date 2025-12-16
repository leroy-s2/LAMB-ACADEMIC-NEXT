// Tipos TypeScript que mapean a LandingConfigDTO.java del backend
// Nota: Backend usa snake_case, convertimos a camelCase en el servicio

export interface LandingLink {
    texto: string;
    url: string;
    target?: string;
}

export interface LandingCtaButton {
    texto: string;
    url: string;
    color?: string;
}

export interface LandingHeaderConfig {
    logoUrl: string | null;
    nombreCorto: string;
    links: LandingLink[];
    ctaButton?: LandingCtaButton;
}

export interface LandingSlide {
    imagenUrl: string | null;
    titulo: string;
    descripcion?: string;
    duracion?: number;
    gradiente?: string;
}

export interface LandingHeroConfig {
    titulo: string;
    subtitulo: string;
    descripcion?: string;
    videoUrl: string | null;
    slides: LandingSlide[];
    ctaButtons?: LandingCtaButton[];
}

export interface LandingNoticia {
    id: string;
    titulo: string;
    subtitulo?: string;
    imagenUrl: string | null;
    linkTexto?: string;
    linkUrl?: string;
    fecha?: string;
}

export interface LandingSede {
    id: string;
    nombre: string;
    ciudad: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    imagenUrl: string | null;
    latitud?: number;
    longitud?: number;
}

export interface LandingCampusConfig {
    titulo?: string;
    descripcion?: string;
    sedes: LandingSede[];
}

export interface LandingRedesSociales {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
}

export interface LandingContacto {
    email?: string;
    telefono?: string;
    direccion?: string;
}

export interface LandingFooterConfig {
    descripcionCorta?: string;
    linksRapidos?: LandingLink[];
    redesSociales?: LandingRedesSociales;
    contacto?: LandingContacto;
    copyright?: string;
}

export interface LandingConfig {
    header: LandingHeaderConfig;
    hero: LandingHeroConfig;
    noticias: LandingNoticia[];
    campus: LandingCampusConfig;
    footer: LandingFooterConfig;
}

// Tipos para respuesta del backend (snake_case)
export interface LandingConfigBackend {
    header: {
        logo_url: string | null;
        nombre_corto: string;
        links: Array<{ texto: string; url: string; target?: string }>;
        cta_button?: { texto: string; url: string; color?: string };
    };
    hero: {
        titulo: string;
        subtitulo: string;
        descripcion?: string;
        video_url: string | null;
        slides: Array<{
            imagen_url: string | null;
            titulo: string;
            descripcion?: string;
            duracion?: number;
            gradiente?: string;
        }>;
        cta_buttons?: Array<{ texto: string; url: string; color?: string }>;
    };
    noticias: Array<{
        id: string;
        titulo: string;
        subtitulo?: string;
        imagen_url: string | null;
        link_texto?: string;
        link_url?: string;
        fecha?: string;
    }>;
    campus: {
        titulo?: string;
        descripcion?: string;
        sedes: Array<{
            id: string;
            nombre: string;
            ciudad: string;
            direccion?: string;
            telefono?: string;
            email?: string;
            imagen_url: string | null;
            latitud?: number;
            longitud?: number;
        }>;
    };
    footer: {
        descripcion_corta?: string;
        links_rapidos?: Array<{ texto: string; url: string; target?: string }>;
        redes_sociales?: {
            facebook?: string;
            twitter?: string;
            instagram?: string;
            youtube?: string;
            linkedin?: string;
        };
        contacto?: {
            email?: string;
            telefono?: string;
            direccion?: string;
        };
        copyright?: string;
    };
}
