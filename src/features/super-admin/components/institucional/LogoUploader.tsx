'use client';

import { Upload, Loader } from 'lucide-react';

interface LogoUploaderProps {
    logoUrl: string | null | undefined;
    nombre: string;
    uploading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LogoUploader({ logoUrl, nombre, uploading, fileInputRef, onUpload }: LogoUploaderProps) {
    return (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-left">
                Logo de la Universidad
            </label>

            {/* Área de carga */}
            <div
                className="relative w-40 h-40 mx-auto bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 cursor-pointer hover:border-blue-400 transition-colors overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
            >
                {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                        <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                    </div>
                )}

                {logoUrl && logoUrl.trim() ? (
                    <img
                        src={logoUrl}
                        alt={nombre}
                        className="w-full h-full object-contain p-2"
                        onLoad={() => console.log('✅ Logo cargado:', logoUrl)}
                        onError={(e) => {
                            console.error('❌ Error cargando logo:', logoUrl);
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" x="50" text-anchor="middle" dominant-baseline="middle" font-size="40">🏛️</text></svg>';
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Upload className="w-8 h-8" />
                        <span className="text-xs">Sin logo</span>
                    </div>
                )}
            </div>

            {/* Input oculto para archivos */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onUpload}
                disabled={uploading}
                className="hidden"
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
                {uploading ? (
                    <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Subiendo...
                    </>
                ) : (
                    <>
                        <Upload className="w-4 h-4" />
                        {logoUrl ? 'Cambiar Logo' : 'Subir Logo'}
                    </>
                )}
            </button>

            {logoUrl && (
                <p className="text-xs text-gray-500 mt-2">
                    Haz clic en la imagen o el botón para cambiar el logo
                </p>
            )}
        </div>
    );
}
