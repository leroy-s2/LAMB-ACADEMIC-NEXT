'use client';

import { useFondosSistema } from '../../hooks/useFondosSistema';
import { FondoPreview } from './FondoPreview';

interface ParametrosAvanzadosProps {
    onError?: (error: string | null) => void;
    onSuccess?: (message: string | null) => void;
    onOpenLandingEditor?: () => void;
}

export function ParametrosAvanzados({ onError, onSuccess, onOpenLandingEditor }: ParametrosAvanzadosProps) {
    const {
        fondoPortal,
        fondoLogin,
        uploadingPortal,
        uploadingLogin,
        portalFileInputRef,
        loginFileInputRef,
        handleUploadFondo,
        error,
        successMessage,
    } = useFondosSistema();

    // Propagar errores y mensajes al componente padre si se proporcionan los callbacks
    if (error && onError) onError(error);
    if (successMessage && onSuccess) onSuccess(successMessage);

    return (
        <div className="bg-white rounded-lg border border-gray-200 mt-6">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">⚙️</span>
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">Parámetros Avanzados del Sistema</h2>
                        <p className="text-sm text-gray-500">Configuración de apariencia pública del sistema</p>
                    </div>
                </div>
            </div>

            {/* Alerta de precaución */}
            <div className="mx-6 mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-semibold text-amber-800">(fondos) Precaución:</p>
                <p className="text-sm text-amber-700">Al modificar estos parámetros serán visibles para todos los usuarios</p>
            </div>

            {/* Grid de fondos */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <FondoPreview
                    tipo="portal"
                    imageUrl={fondoPortal}
                    uploading={uploadingPortal}
                    fileInputRef={portalFileInputRef}
                    onUpload={(file) => handleUploadFondo('pantalla_principal', file)}
                />

                <FondoPreview
                    tipo="login"
                    imageUrl={fondoLogin}
                    uploading={uploadingLogin}
                    fileInputRef={loginFileInputRef}
                    onUpload={(file) => handleUploadFondo('log_url', file)}
                />
            </div>

            {/* Alerta de vista pública */}
            <div className="mx-6 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-semibold text-yellow-800">(vista del sistema desde afuera) Precaución:</p>
                <p className="text-sm text-yellow-700">Al modificar estos parámetros serán visibles por cualquier persona</p>
            </div>

            {/* Botón principal - abre el editor en modo fullscreen */}
            <div className="px-6 pb-6 text-center">
                <button
                    onClick={onOpenLandingEditor}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                    Configurar cara del sistema
                </button>
            </div>
        </div>
    );
}

