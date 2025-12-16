'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { TipoUnidad } from '@/shared/types/organizational.types';
import { getTiposUnidadByNivel } from '@/features/super-admin/services/organizationalService';

interface CreateUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  nivel: number;
  onSelectType: (tipo: TipoUnidad) => void;
}

export function CreateUnitModal({
  isOpen,
  onClose,
  nivel,
  onSelectType,
}: CreateUnitModalProps) {
  const [tipos, setTipos] = useState<TipoUnidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<TipoUnidad | null>(null);

  // Cargar tipos de unidad para el nivel actual
  useEffect(() => {
    if (isOpen) {
      loadTipos();
    }
  }, [isOpen, nivel]);

  const loadTipos = async () => {
    setLoading(true);
    setError(null);
    try {
      const tiposData = await getTiposUnidadByNivel(nivel);
      setTipos(tiposData);
      if (tiposData.length > 0) {
        setSelectedType(tiposData[0]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar tipos de unidad';
      setError(message);
      console.error('Error loading tipos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectType = () => {
    if (selectedType) {
      onSelectType(selectedType);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-100 to-blue-50 border-b border-blue-200 px-8 py-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Seleccionar Tipo de Unidad
              </h2>
              <p className="text-sm text-gray-600 mt-1">Nivel {nivel}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-4">
            {error && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="space-y-3">
                <div className="animate-pulse h-12 bg-gray-200 rounded-lg"></div>
                <div className="animate-pulse h-12 bg-gray-200 rounded-lg"></div>
                <div className="animate-pulse h-12 bg-gray-200 rounded-lg"></div>
              </div>
            ) : tipos.length > 0 ? (
              <div className="space-y-2">
                {tipos.map((tipo) => (
                  <button
                    key={tipo.id}
                    onClick={() => setSelectedType(tipo)}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                      selectedType?.id === tipo.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{tipo.nombre}</div>
                    <div className="text-sm text-gray-600">{tipo.descripcion}</div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No hay tipos de unidad disponibles para este nivel
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-8 py-4 flex gap-4 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSelectType}
              disabled={!selectedType || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
