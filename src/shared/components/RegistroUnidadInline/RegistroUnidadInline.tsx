'use client';

import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { TipoUnidad, UnidadOrganizativa, UnidadOrganizativaResponse } from '@/shared/types/organizational.types';
import { createUnidadOrganizativa } from '@/shared/services/organizationalService';

interface RegistroUnidadInlineProps {
  tipoSeleccionado: TipoUnidad;
  nivel: number;
  unidadPadreId?: number;
  localizacionId?: number;
  onCancel: () => void;
  onSuccess?: (unidad: UnidadOrganizativaResponse) => void;
}

export function RegistroUnidadInline({
  tipoSeleccionado,
  nivel,
  unidadPadreId,
  localizacionId = 0,
  onCancel,
  onSuccess,
}: RegistroUnidadInlineProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    sigla: '',
    descripcion: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload: UnidadOrganizativa = {
        localizacionId: localizacionId ?? null,
        tipoUnidadId: tipoSeleccionado.id,
        unidadPadreId: unidadPadreId ?? null,
        nombre: formData.nombre,
        codigo: formData.codigo,
        sigla: formData.sigla,
        descripcion: formData.descripcion,
      };

      const response = await createUnidadOrganizativa(payload);
      
      // Llamar callback de éxito
      onSuccess?.(response);

      // Limpiar formulario
      setFormData({
        nombre: '',
        codigo: '',
        sigla: '',
        descripcion: '',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear unidad organizativa';
      setError(message);
      console.error('Error creating unit:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Nuevo Registro</h3>
          <p className="text-xs text-gray-600">
            Tipo: <span className="font-medium text-blue-700">{tipoSeleccionado.nombre}</span>
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-white/50 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded mb-4 text-xs">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Row 1: Nombre */}
        <div>
          <label className="block text-xs font-medium text-gray-900 mb-0.5">
            Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Ej: Facultad de Ingeniería"
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Row 2: Código y Sigla */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-900 mb-0.5">
              Código *
            </label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleInputChange}
              placeholder="FI-001"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-900 mb-0.5">
              Sigla *
            </label>
            <input
              type="text"
              name="sigla"
              value={formData.sigla}
              onChange={handleInputChange}
              placeholder="FI"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Row 3: Descripción */}
        <div>
          <label className="block text-xs font-medium text-gray-900 mb-0.5">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            placeholder="Descripción"
            rows={2}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-end pt-2 border-t border-blue-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            {submitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
