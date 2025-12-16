import { api } from '@/shared/services/http';
import type {
    LandingConfig,
    LandingConfigBackend,
    LandingHeaderConfig,
    LandingHeroConfig,
    LandingCampusConfig,
    LandingFooterConfig
} from '../types/landingConfig.types';

const PUBLIC_BASE = '/public/universidad/configuracion/landing';
const ADMIN_BASE = '/universidades/1/configuracion/landing';
const MEDIA_BASE = '/universidades/1/landing';

// ============================================================
// UTILIDADES DE CONVERSIÓN snake_case <-> camelCase
// ============================================================

function convertBackendToFrontend(backend: LandingConfigBackend): LandingConfig {
    return {
        header: {
            logoUrl: backend.header.logo_url,
            nombreCorto: backend.header.nombre_corto || 'Universidad',
            links: backend.header.links || [],
            ctaButton: backend.header.cta_button,
        },
        hero: {
            titulo: backend.hero.titulo,
            subtitulo: backend.hero.subtitulo,
            descripcion: backend.hero.descripcion,
            videoUrl: backend.hero.video_url,
            slides: (backend.hero.slides || []).map(s => ({
                imagenUrl: s.imagen_url,
                titulo: s.titulo,
                descripcion: s.descripcion,
                duracion: s.duracion,
                gradiente: s.gradiente,
            })),
            ctaButtons: backend.hero.cta_buttons,
        },
        noticias: (backend.noticias || []).map(n => ({
            id: n.id,
            titulo: n.titulo,
            subtitulo: n.subtitulo,
            imagenUrl: n.imagen_url,
            linkTexto: n.link_texto,
            linkUrl: n.link_url,
            fecha: n.fecha,
        })),
        campus: {
            titulo: backend.campus.titulo,
            descripcion: backend.campus.descripcion,
            sedes: (backend.campus.sedes || []).map(s => ({
                id: s.id,
                nombre: s.nombre,
                ciudad: s.ciudad,
                direccion: s.direccion,
                telefono: s.telefono,
                email: s.email,
                imagenUrl: s.imagen_url,
                latitud: s.latitud,
                longitud: s.longitud,
            })),
        },
        footer: {
            descripcionCorta: backend.footer.descripcion_corta,
            linksRapidos: backend.footer.links_rapidos,
            redesSociales: backend.footer.redes_sociales,
            contacto: backend.footer.contacto,
            copyright: backend.footer.copyright,
        },
    };
}

function convertFrontendToBackend(frontend: LandingConfig): LandingConfigBackend {
    return {
        header: {
            logo_url: frontend.header.logoUrl,
            nombre_corto: frontend.header.nombreCorto,
            links: frontend.header.links,
            cta_button: frontend.header.ctaButton,
        },
        hero: {
            titulo: frontend.hero.titulo,
            subtitulo: frontend.hero.subtitulo,
            descripcion: frontend.hero.descripcion,
            video_url: frontend.hero.videoUrl,
            slides: frontend.hero.slides.map(s => ({
                imagen_url: s.imagenUrl,
                titulo: s.titulo,
                descripcion: s.descripcion,
                duracion: s.duracion,
                gradiente: s.gradiente,
            })),
            cta_buttons: frontend.hero.ctaButtons,
        },
        noticias: frontend.noticias.map(n => ({
            id: n.id,
            titulo: n.titulo,
            subtitulo: n.subtitulo,
            imagen_url: n.imagenUrl,
            link_texto: n.linkTexto,
            link_url: n.linkUrl,
            fecha: n.fecha,
        })),
        campus: {
            titulo: frontend.campus.titulo,
            descripcion: frontend.campus.descripcion,
            sedes: frontend.campus.sedes.map(s => ({
                id: s.id,
                nombre: s.nombre,
                ciudad: s.ciudad,
                direccion: s.direccion,
                telefono: s.telefono,
                email: s.email,
                imagen_url: s.imagenUrl,
                latitud: s.latitud,
                longitud: s.longitud,
            })),
        },
        footer: {
            descripcion_corta: frontend.footer.descripcionCorta,
            links_rapidos: frontend.footer.linksRapidos,
            redes_sociales: frontend.footer.redesSociales,
            contacto: frontend.footer.contacto,
            copyright: frontend.footer.copyright,
        },
    };
}

// ============================================================
// ENDPOINTS PÚBLICOS (GET - Sin autenticación)
// ============================================================

export async function getLandingConfig(): Promise<LandingConfig> {
    try {
        console.log('📡 Cargando configuración de landing...');
        const response = await fetch(`/api/v1${PUBLIC_BASE}`);
        const data = await response.json();

        if (data.success && data.data) {
            console.log('✅ Configuración de landing cargada');
            return convertBackendToFrontend(data.data);
        }
        throw new Error(data.message || 'Error al cargar configuración');
    } catch (error: any) {
        console.error('❌ Error getLandingConfig:', error.message);
        throw error;
    }
}

export async function getLandingHeader(): Promise<LandingHeaderConfig> {
    const response = await fetch(`/api/v1${PUBLIC_BASE}/header`);
    const data = await response.json();
    if (data.success && data.data) {
        const h = data.data;
        return {
            logoUrl: h.logo_url,
            nombreCorto: h.nombre_corto || 'Universidad',
            links: h.links || [],
            ctaButton: h.cta_button,
        };
    }
    throw new Error(data.message || 'Error al cargar header');
}

export async function getLandingHero(): Promise<LandingHeroConfig> {
    const response = await fetch(`/api/v1${PUBLIC_BASE}/hero`);
    const data = await response.json();
    if (data.success && data.data) {
        const h = data.data;
        return {
            titulo: h.titulo,
            subtitulo: h.subtitulo,
            descripcion: h.descripcion,
            videoUrl: h.video_url,
            slides: (h.slides || []).map((s: any) => ({
                imagenUrl: s.imagen_url,
                titulo: s.titulo,
                descripcion: s.descripcion,
                duracion: s.duracion,
                gradiente: s.gradiente,
            })),
            ctaButtons: h.cta_buttons,
        };
    }
    throw new Error(data.message || 'Error al cargar hero');
}

export async function getLandingCampus(): Promise<LandingCampusConfig> {
    const response = await fetch(`/api/v1${PUBLIC_BASE}/campus`);
    const data = await response.json();
    if (data.success && data.data) {
        const c = data.data;
        return {
            titulo: c.titulo,
            descripcion: c.descripcion,
            sedes: (c.sedes || []).map((s: any) => ({
                id: s.id,
                nombre: s.nombre,
                ciudad: s.ciudad,
                direccion: s.direccion,
                telefono: s.telefono,
                email: s.email,
                imagenUrl: s.imagen_url,
                latitud: s.latitud,
                longitud: s.longitud,
            })),
        };
    }
    throw new Error(data.message || 'Error al cargar campus');
}

export async function getLandingFooter(): Promise<LandingFooterConfig> {
    const response = await fetch(`/api/v1${PUBLIC_BASE}/footer`);
    const data = await response.json();
    if (data.success && data.data) {
        const f = data.data;
        return {
            descripcionCorta: f.descripcion_corta,
            linksRapidos: f.links_rapidos,
            redesSociales: f.redes_sociales,
            contacto: f.contacto,
            copyright: f.copyright,
        };
    }
    throw new Error(data.message || 'Error al cargar footer');
}

// ============================================================
// ENDPOINTS ADMIN (PUT - Con autenticación)
// ============================================================

export async function updateLandingConfig(config: LandingConfig): Promise<LandingConfig> {
    try {
        console.log('💾 Guardando configuración de landing...');
        const payload = convertFrontendToBackend(config);
        const response = await api.put(`${ADMIN_BASE}`, payload);

        if (response.data.success && response.data.data) {
            console.log('✅ Configuración de landing guardada');
            return convertBackendToFrontend(response.data.data);
        }
        throw new Error(response.data.message || 'Error al guardar');
    } catch (error: any) {
        console.error('❌ Error updateLandingConfig:', error.message);
        throw error;
    }
}

export async function updateLandingHeader(header: LandingHeaderConfig): Promise<void> {
    const payload = {
        logo_url: header.logoUrl,
        nombre_corto: header.nombreCorto,
        links: header.links,
        cta_button: header.ctaButton,
    };
    await api.put(`${ADMIN_BASE}/header`, payload);
}

export async function updateLandingHero(hero: LandingHeroConfig): Promise<void> {
    const payload = {
        titulo: hero.titulo,
        subtitulo: hero.subtitulo,
        descripcion: hero.descripcion,
        video_url: hero.videoUrl,
        slides: hero.slides.map(s => ({
            imagen_url: s.imagenUrl,
            titulo: s.titulo,
            descripcion: s.descripcion,
            duracion: s.duracion,
            gradiente: s.gradiente,
        })),
        cta_buttons: hero.ctaButtons,
    };
    await api.put(`${ADMIN_BASE}/hero`, payload);
}

export async function updateLandingCampus(campus: LandingCampusConfig): Promise<void> {
    const payload = {
        titulo: campus.titulo,
        descripcion: campus.descripcion,
        sedes: campus.sedes.map(s => ({
            id: s.id,
            nombre: s.nombre,
            ciudad: s.ciudad,
            direccion: s.direccion,
            telefono: s.telefono,
            email: s.email,
            imagen_url: s.imagenUrl,
            latitud: s.latitud,
            longitud: s.longitud,
        })),
    };
    await api.put(`${ADMIN_BASE}/campus`, payload);
}

export async function updateLandingFooter(footer: LandingFooterConfig): Promise<void> {
    const payload = {
        descripcion_corta: footer.descripcionCorta,
        links_rapidos: footer.linksRapidos,
        redes_sociales: footer.redesSociales,
        contacto: footer.contacto,
        copyright: footer.copyright,
    };
    await api.put(`${ADMIN_BASE}/footer`, payload);
}

// ============================================================
// ENDPOINTS MULTIMEDIA (Azure)
// ============================================================

export async function uploadHeaderLogo(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    const response = await api.put(`${MEDIA_BASE}/header/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.success && response.data.data?.url) {
        return response.data.data.url;
    }
    throw new Error('Error al subir logo');
}

export async function uploadHeroVideo(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    const response = await api.put(`${MEDIA_BASE}/hero/video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.success && response.data.data?.url) {
        return response.data.data.url;
    }
    throw new Error('Error al subir video');
}

export async function uploadSlideImage(index: number, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    const response = await api.put(`${MEDIA_BASE}/hero/slide/${index}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.success && response.data.data?.url) {
        return response.data.data.url;
    }
    throw new Error('Error al subir imagen de slide');
}

export async function uploadSedeImage(sedeId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    const response = await api.put(`${MEDIA_BASE}/sede/${sedeId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.success && response.data.data?.url) {
        return response.data.data.url;
    }
    throw new Error('Error al subir imagen de sede');
}
