'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit2, Trash2, Upload, Save, Eye, Loader, Link as LinkIcon, AlertCircle, Check } from 'lucide-react';
import type { LandingConfig } from '@/features/landing/types/landingConfig.types';
import { getLandingConfig, updateLandingConfig, uploadSedeImage, uploadHeroVideo } from '@/features/landing/services/landingConfigService';

// Datos de fallback si la API falla
const fallbackConfig: LandingConfig = {
    header: {
        logoUrl: null,
        nombreCorto: 'Universidad',
        links: [
            { texto: 'Admisión', url: '/admision' },
            { texto: 'Plan académico', url: '/plan-academico' },
            { texto: 'Consultas', url: '/consultas' },
        ],
    },
    hero: {
        titulo: 'BIENVENIDOS',
        subtitulo: 'Tu futuro comienza aquí',
        videoUrl: null,
        slides: [
            { imagenUrl: null, titulo: 'Slide 1', descripcion: 'Descripción', gradiente: 'from-blue-900/80 to-cyan-500/60' },
        ],
    },
    noticias: [],
    campus: {
        sedes: [],
    },
    footer: {
        descripcionCorta: 'Universidad de excelencia',
    },
};

// Componente de control de edición flotante
function EditOverlay({ label, onEdit, onDelete, children }: { label: string; onEdit?: () => void; onDelete?: () => void; children: React.ReactNode }) {
    return (
        <div className="group relative">
            {children}
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/20 transition-colors border-2 border-transparent group-hover:border-blue-500 rounded pointer-events-none" />
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-20">
                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-medium">{label}</span>
                {onEdit && (
                    <button onClick={onEdit} className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700">
                        <Edit2 className="w-3 h-3" />
                    </button>
                )}
                {onDelete && (
                    <button onClick={onDelete} className="bg-red-600 text-white p-1 rounded hover:bg-red-700">
                        <Trash2 className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    );
}

// Componente de botón agregar
function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
        >
            <Plus className="w-3 h-3" />
            {label}
        </button>
    );
}

export default function LandingEditor() {
    const router = useRouter();
    const [config, setConfig] = useState<LandingConfig>(fallbackConfig);
    const [originalConfig, setOriginalConfig] = useState<LandingConfig>(fallbackConfig);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Cargar configuración desde API
    useEffect(() => {
        async function loadConfig() {
            try {
                setLoading(true);
                setError(null);
                const data = await getLandingConfig();
                setConfig(data);
                setOriginalConfig(JSON.parse(JSON.stringify(data)));
            } catch (err: any) {
                console.error('Error cargando config:', err);
                setError('No se pudo cargar la configuración. Usando datos de ejemplo.');
                setConfig(fallbackConfig);
                setOriginalConfig(fallbackConfig);
            } finally {
                setLoading(false);
            }
        }
        loadConfig();
    }, []);

    // Detectar cambios
    useEffect(() => {
        setHasChanges(JSON.stringify(config) !== JSON.stringify(originalConfig));
    }, [config, originalConfig]);

    // Guardar cambios
    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            const savedConfig = await updateLandingConfig(config);
            setConfig(savedConfig);
            setOriginalConfig(JSON.parse(JSON.stringify(savedConfig)));
            setHasChanges(false);
            setSuccess('✓ Configuración guardada correctamente');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            console.error('Error guardando:', err);
            setError('Error al guardar: ' + (err.message || 'Desconocido'));
        } finally {
            setSaving(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Cargando configuración...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Barra superior de edición */}
            <div className="fixed top-0 left-0 right-0 bg-slate-900 text-white z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/super-admin')}
                            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Regresar</span>
                        </button>
                        <div className="h-6 w-px bg-gray-600" />
                        <h1 className="font-semibold">Editor de Landing Page</h1>
                        {hasChanges && (
                            <span className="text-xs text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded">
                                Cambios sin guardar
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Mensajes */}
                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/20 px-3 py-1 rounded">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/20 px-3 py-1 rounded">
                                <Check className="w-4 h-4" />
                                {success}
                            </div>
                        )}
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm">
                            <Eye className="w-4 h-4" />
                            Vista previa
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || saving}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Contenido - Preview editable */}
            <div className="pt-16">
                {/* ========== HEADER ========== */}
                <EditOverlay label="Header" onEdit={() => console.log('Edit header')}>
                    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-16">
                                {/* Logo */}
                                <EditOverlay label="Logo" onEdit={() => console.log('Edit logo')}>
                                    <div className="flex items-center">
                                        <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2">
                                            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center overflow-hidden">
                                                {config.header.logoUrl ? (
                                                    <img src={config.header.logoUrl} alt="Logo" className="object-cover w-8 h-8" />
                                                ) : (
                                                    <span className="text-white text-xs">🏛️</span>
                                                )}
                                            </div>
                                            <span className="text-slate-900 font-bold text-xl">{config.header.nombreCorto}</span>
                                        </div>
                                    </div>
                                </EditOverlay>

                                {/* Navigation */}
                                <nav className="flex items-center gap-4">
                                    {config.header.links.map((link, i) => (
                                        <EditOverlay key={i} label={`Link ${i + 1}`} onEdit={() => console.log('Edit link', i)} onDelete={() => {
                                            const newLinks = [...config.header.links];
                                            newLinks.splice(i, 1);
                                            setConfig({ ...config, header: { ...config.header, links: newLinks } });
                                        }}>
                                            <a href="#" className="text-white hover:text-cyan-400 transition-colors px-3 py-1">{link.texto}</a>
                                        </EditOverlay>
                                    ))}
                                    <AddButton label="Agregar link" onClick={() => {
                                        const newLinks = [...config.header.links, { texto: 'Nuevo Link', url: '/nuevo' }];
                                        setConfig({ ...config, header: { ...config.header, links: newLinks } });
                                    }} />
                                </nav>
                            </div>
                        </div>
                    </header>
                </EditOverlay>

                {/* ========== HERO ========== */}
                <EditOverlay label="Hero Section" onEdit={() => console.log('Edit hero')}>
                    <section className="relative h-[500px] overflow-hidden">
                        {/* Video/Imagen de fondo */}
                        <EditOverlay label="Video de fondo" onEdit={() => console.log('Edit video')}>
                            <div className="absolute inset-0 w-full h-full">
                                {config.hero.videoUrl ? (
                                    <video autoPlay muted loop playsInline className="w-full h-full object-cover" src={config.hero.videoUrl} />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-900" />
                                )}
                                <div className="absolute inset-0 bg-slate-900/40 pointer-events-none" />
                            </div>
                        </EditOverlay>

                        {/* Content */}
                        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                            <div className="max-w-2xl">
                                {config.hero.slides.length > 0 && (
                                    <EditOverlay label={`Slide ${currentSlide + 1}`} onEdit={() => console.log('Edit slide', currentSlide)}>
                                        <div>
                                            <h1 className={`text-6xl font-bold text-white mb-4 bg-gradient-to-r ${config.hero.slides[currentSlide]?.gradiente || 'from-blue-500 to-cyan-500'} bg-clip-text text-transparent`}>
                                                {config.hero.slides[currentSlide]?.titulo || config.hero.titulo}
                                            </h1>
                                            <p className="text-2xl text-white mb-2">{config.hero.subtitulo}</p>
                                            <p className="text-xl text-cyan-300 mb-6">{config.hero.slides[currentSlide]?.descripcion}</p>
                                        </div>
                                    </EditOverlay>
                                )}
                                <button className="px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg">Iniciar sesión</button>
                            </div>
                        </div>

                        {/* Slide controls */}
                        {config.hero.slides.length > 0 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 px-4 py-2 rounded-lg">
                                {config.hero.slides.map((slide, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentSlide(i)}
                                        className={`w-3 h-3 rounded-full transition-all ${currentSlide === i ? 'bg-white w-8' : 'bg-white/50'}`}
                                    />
                                ))}
                                <AddButton label="Agregar slide" onClick={() => {
                                    const newSlides = [...config.hero.slides, { imagenUrl: null, titulo: 'Nuevo Slide', descripcion: '', gradiente: 'from-purple-900/80 to-pink-500/60' }];
                                    setConfig({ ...config, hero: { ...config.hero, slides: newSlides } });
                                }} />
                            </div>
                        )}
                    </section>
                </EditOverlay>

                {/* ========== NOTICIAS ========== */}
                <section className="py-12 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-700">Sección Noticias / Destacados</h2>
                            <AddButton label="Agregar noticia" onClick={() => {
                                const newNoticias = [...config.noticias, { id: `noticia-${Date.now()}`, titulo: 'Nueva Noticia', subtitulo: 'Subtítulo', imagenUrl: null }];
                                setConfig({ ...config, noticias: newNoticias });
                            }} />
                        </div>
                        {config.noticias.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-500">No hay noticias configuradas</p>
                                <p className="text-sm text-gray-400">Haz clic en "Agregar noticia" para crear una</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {config.noticias.map((noticia, i) => (
                                    <EditOverlay key={noticia.id} label="Noticia" onEdit={() => console.log('Edit noticia', noticia.id)} onDelete={() => {
                                        const newNoticias = config.noticias.filter(n => n.id !== noticia.id);
                                        setConfig({ ...config, noticias: newNoticias });
                                    }}>
                                        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl overflow-hidden">
                                            <div className="flex flex-col md:flex-row">
                                                <div className="md:w-1/2 relative overflow-hidden h-48 bg-gray-200">
                                                    {noticia.imagenUrl ? (
                                                        <img src={noticia.imagenUrl} alt={noticia.titulo} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <Upload className="w-8 h-8" />
                                                        </div>
                                                    )}
                                                    <button className="absolute top-2 right-2 bg-blue-600 text-white p-1.5 rounded">
                                                        <Upload className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="md:w-1/2 p-6 flex flex-col justify-center">
                                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{noticia.titulo}</h3>
                                                    <p className="text-cyan-600 mb-4">{noticia.subtitulo}</p>
                                                    <div className="flex items-center gap-2 text-cyan-600">
                                                        <LinkIcon className="w-4 h-4" />
                                                        <span className="text-sm">{noticia.linkTexto || 'Ver más'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </EditOverlay>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ========== CAMPUS ========== */}
                <section className="py-12 px-4 bg-gradient-to-b from-white to-slate-100">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-700">Sección Campus / Sedes</h2>
                            <AddButton label="Agregar sede" onClick={() => {
                                const newSedes = [...config.campus.sedes, { id: `sede-${Date.now()}`, nombre: 'Nueva Sede', ciudad: 'Ciudad', imagenUrl: null }];
                                setConfig({ ...config, campus: { ...config.campus, sedes: newSedes } });
                            }} />
                        </div>
                        {config.campus.sedes.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-500">No hay sedes configuradas</p>
                                <p className="text-sm text-gray-400">Haz clic en "Agregar sede" para crear una</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {config.campus.sedes.map((sede) => (
                                    <EditOverlay key={sede.id} label={sede.nombre} onEdit={() => console.log('Edit sede', sede.id)} onDelete={() => {
                                        const newSedes = config.campus.sedes.filter(s => s.id !== sede.id);
                                        setConfig({ ...config, campus: { ...config.campus, sedes: newSedes } });
                                    }}>
                                        <div className="relative h-60 rounded-xl overflow-hidden bg-gray-200">
                                            {sede.imagenUrl ? (
                                                <img src={sede.imagenUrl} alt={sede.nombre} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Upload className="w-8 h-8" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                                            <div className="absolute top-4 left-4 text-white font-semibold">{sede.nombre}</div>
                                            <div className="absolute bottom-4 left-4 text-white/80 text-sm">{sede.ciudad}</div>
                                            <button className="absolute top-2 right-2 bg-blue-600 text-white p-1.5 rounded">
                                                <Upload className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </EditOverlay>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ========== FOOTER CTA ========== */}
                <EditOverlay label="Footer CTA" onEdit={() => console.log('Edit footer')}>
                    <section className="py-12 px-4 bg-slate-900 text-center">
                        <div className="max-w-3xl mx-auto">
                            <h3 className="text-2xl font-bold text-white mb-3">{config.footer.descripcionCorta || 'Únete a nuestra comunidad'}</h3>
                            <p className="text-slate-300 mb-6">{config.footer.copyright || 'Tu futuro comienza aquí'}</p>
                            <button className="px-6 py-2 bg-cyan-500 text-white font-semibold rounded-lg">
                                Más información
                            </button>
                        </div>
                    </section>
                </EditOverlay>
            </div>
        </div>
    );
}
