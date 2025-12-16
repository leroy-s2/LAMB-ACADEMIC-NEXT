'use client';

import { Upload, Loader } from 'lucide-react';

interface FondoPreviewProps {
    tipo: 'portal' | 'login';
    imageUrl: string;
    uploading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onUpload: (file: File) => void;
}

export function FondoPreview({ tipo, imageUrl, uploading, fileInputRef, onUpload }: FondoPreviewProps) {
    const isPortal = tipo === 'portal';
    const title = isPortal ? 'Fondo del inicio' : 'Fondo del login';

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">{title}</h3>

            {/* Miniatura */}
            <div className={`relative rounded-lg overflow-hidden shadow-lg aspect-video ${isPortal
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900'
                    : 'bg-gradient-to-br from-blue-800 to-indigo-900'
                }`}>
                {/* Preview con imagen real si existe */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: imageUrl ? `url('${imageUrl}')` : undefined,
                        backgroundColor: imageUrl ? undefined : '#374151',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <div className={`absolute inset-0 ${isPortal
                        ? 'bg-gradient-to-br from-blue-900/40 via-slate-900/50 to-indigo-900/40'
                        : 'bg-[#173a6b]/80'
                    }`} />

                {/* Overlay de carga */}
                {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                        <Loader className="w-6 h-6 text-white animate-spin" />
                    </div>
                )}

                {/* UI simulada */}
                <div className={`absolute inset-0 p-3 ${isPortal ? 'flex' : 'flex items-center justify-center'}`}>
                    {isPortal ? (
                        <>
                            {/* UI del portal */}
                            <div className="flex-1 pr-2">
                                <p className="text-white text-[8px] font-bold mb-1">Bienvenido, Super</p>
                                <div className="grid grid-cols-2 gap-1">
                                    <div className="bg-slate-800/60 rounded p-1.5 backdrop-blur-sm border border-white/10">
                                        <div className="w-3 h-3 bg-white/20 rounded mb-1 mx-auto" />
                                        <div className="h-1 bg-white/40 rounded w-8 mx-auto" />
                                    </div>
                                    <div className="bg-slate-700/60 rounded p-1.5 backdrop-blur-sm border border-white/10 opacity-50">
                                        <div className="w-3 h-3 bg-white/20 rounded mb-1 mx-auto" />
                                        <div className="h-1 bg-white/40 rounded w-8 mx-auto" />
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/3 bg-white/10 backdrop-blur-sm rounded p-2 flex flex-col items-center">
                                <div className="w-6 h-6 bg-blue-600 rounded text-white text-[6px] flex items-center justify-center font-bold">SA</div>
                                <div className="h-1 bg-white/40 rounded w-10 mt-1" />
                                <div className="h-0.5 bg-white/30 rounded w-8 mt-0.5" />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* UI del login */}
                            <div className="absolute top-1 left-2">
                                <div className="w-8 h-2 bg-white/60 rounded" />
                            </div>
                            <div className="absolute top-1 right-2 flex gap-2">
                                <div className="w-6 h-1.5 bg-white/40 rounded" />
                                <div className="w-6 h-1.5 bg-white/40 rounded" />
                            </div>
                            <div className="w-2/3 bg-white/25 backdrop-blur rounded-lg p-3 border border-white/30">
                                <p className="text-white text-[7px] font-bold text-center mb-2">Iniciar sesión</p>
                                <div className="space-y-1.5">
                                    <div className="h-2 bg-white/10 rounded-full border border-white/30" />
                                    <div className="h-2 bg-white/10 rounded-full border border-white/30" />
                                    <div className="h-2 bg-[#1a3d5c] rounded-full mt-2" />
                                    <div className="h-2 bg-[#4a6cf7] rounded-full flex items-center justify-center">
                                        <div className="flex gap-0.5">
                                            <div className="w-0.5 h-0.5 bg-[#f25022]" />
                                            <div className="w-0.5 h-0.5 bg-[#7fba00]" />
                                            <div className="w-0.5 h-0.5 bg-[#00a4ef]" />
                                            <div className="w-0.5 h-0.5 bg-[#ffb900]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Indicador si no hay imagen */}
                {!imageUrl && (
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-red-500/80 text-white text-[6px] rounded">
                        Sin imagen
                    </div>
                )}
            </div>

            {/* Input oculto para archivo */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onUpload(file);
                    e.target.value = '';
                }}
            />

            {/* Botones de acción */}
            <div className="flex gap-2">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {uploading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                        <Upload className="w-4 h-4" />
                    )}
                    {uploading ? 'Subiendo...' : 'Cambiar imagen'}
                </button>
            </div>
        </div>
    );
}
