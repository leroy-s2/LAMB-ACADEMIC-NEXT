'use client';

// Modal para crear nuevos registros en catálogos
import { useState, useEffect } from 'react';
import { Plus, Loader2, Shield } from 'lucide-react';
import { CatalogType, NuevoTipoUnidad, NuevoTipoLocalizacion, NuevoTipoAutoridad } from './types';
import { TipoUnidadForm, TipoLocalizacionForm, TipoAutoridadForm } from './forms';

interface CreateRecordModalProps {
    isOpen: boolean;
    catalogType: CatalogType | undefined;
    catalogName: string;
    loading: boolean;
    error: string | null;
    onClose: () => void;
    onSubmit: (payload: NuevoTipoUnidad | NuevoTipoLocalizacion | NuevoTipoAutoridad) => Promise<void>;
    // Props para crear hijos en jerarquía
    parentId?: number | null;
    parentNivel?: number;
    parentName?: string;
}

export function CreateRecordModal({
    isOpen,
    catalogType,
    catalogName,
    loading,
    error,
    onClose,
    onSubmit,
    parentId = null,
    parentNivel = -1,
    parentName = '',
}: CreateRecordModalProps) {
    // Estados de formularios
    const [tipoUnidad, setTipoUnidad] = useState<NuevoTipoUnidad>({ nombre: '', descripcion: '', nivel: 0 });
    const [tipoLocalizacion, setTipoLocalizacion] = useState<NuevoTipoLocalizacion>({ codigo: '', nombre: '', padreId: 0, nivelJerarquia: 0, permiteAsignacion: true });
    const [tipoAutoridad, setTipoAutoridad] = useState<NuevoTipoAutoridad>({ nombre: '', codigo: '', nivelJerarquia: 0, descripcion: '' });
    const [validationError, setValidationError] = useState<string | null>(null);

    // Actualizar estado cuando cambian parentId/parentNivel
    useEffect(() => {
        if (isOpen && catalogType === 'tipoLocalizacion') {
            setTipoLocalizacion(prev => ({
                ...prev,
                padreId: parentId ?? 0,
                nivelJerarquia: parentNivel + 1
            }));
        }
    }, [isOpen, parentId, parentNivel, catalogType]);

    // Limpiar formularios cuando se cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setTipoUnidad({ nombre: '', descripcion: '', nivel: 0 });
            setTipoLocalizacion({ codigo: '', nombre: '', padreId: 0, nivelJerarquia: 0, permiteAsignacion: true });
            setTipoAutoridad({ nombre: '', codigo: '', nivelJerarquia: 0, descripcion: '' });
            setValidationError(null);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        setValidationError(null);

        // Validar según el tipo
        if (catalogType === 'tipoAutoridad') {
            if (!tipoAutoridad.nombre.trim()) {
                setValidationError('El nombre es requerido');
                return;
            }
            if (!tipoAutoridad.codigo.trim()) {
                setValidationError('El código es requerido');
                return;
            }
            await onSubmit(tipoAutoridad);
        } else if (catalogType === 'tipoLocalizacion') {
            if (!tipoLocalizacion.codigo.trim()) {
                setValidationError('El código es requerido');
                return;
            }
            if (!tipoLocalizacion.nombre.trim()) {
                setValidationError('El nombre es requerido');
                return;
            }
            await onSubmit(tipoLocalizacion);
        } else {
            if (!tipoUnidad.nombre.trim()) {
                setValidationError('El nombre es requerido');
                return;
            }
            await onSubmit(tipoUnidad);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const displayError = validationError || error;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {catalogType === 'tipoAutoridad' ? (
                            <Shield className="w-5 h-5 text-purple-600" />
                        ) : (
                            <Plus className="w-5 h-5 text-green-600" />
                        )}
                        Nuevo Registro
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{catalogName}</p>
                </div>

                <div className="p-6 space-y-4">
                    {displayError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{displayError}</p>
                        </div>
                    )}

                    {catalogType === 'tipoAutoridad' ? (
                        <TipoAutoridadForm value={tipoAutoridad} onChange={setTipoAutoridad} />
                    ) : catalogType === 'tipoLocalizacion' ? (
                        <TipoLocalizacionForm
                            value={tipoLocalizacion}
                            onChange={setTipoLocalizacion}
                            isChild={parentId !== null}
                            parentName={parentName}
                        />
                    ) : (
                        <TipoUnidadForm value={tipoUnidad} onChange={setTipoUnidad} />
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                        Crear
                    </button>
                </div>
            </div>
        </div>
    );
}
