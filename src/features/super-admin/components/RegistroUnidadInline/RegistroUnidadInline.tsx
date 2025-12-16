'use client';

import { useState } from 'react';
import { AlertCircle, Building2, BookOpen, Briefcase, Home } from 'lucide-react';
import { TipoUnidad, UnidadOrganizativa, UnidadOrganizativaResponse } from '@/shared/types/organizational.types';
import { createUnidadOrganizativa } from '@/features/super-admin/services/organizationalService';

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
        localizacionId: localizacionId ? localizacionId : undefined,
        tipoUnidadId: tipoSeleccionado.id,
        unidadPadreId: unidadPadreId ? unidadPadreId : undefined,
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

  const getIconForLevel = () => {
    switch (tipoSeleccionado.nivel) {
      case 0:
        return <Home className="w-5 h-5 text-orange-600" />;
      case 1:
        return <Building2 className="w-5 h-5 text-blue-600" />;
      case 2:
        return <BookOpen className="w-5 h-5 text-green-600" />;
      case 3:
        return <Briefcase className="w-5 h-5 text-purple-600" />;
      default:
        return <Building2 className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 bg-blue-50 hover:bg-blue-100 transition-colors" style={{ marginLeft: `${nivel * 2}rem` }}>
        {/* Icon for type */}
        <div className="flex-shrink-0">
          {getIconForLevel()}
        </div>

        {/* Unit Info - Editable */}
        <div className="flex-1 min-w-0 flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre"
              className="w-full font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 px-0 py-1"
              required
            />
          </div>
          <div className="flex gap-4 text-xs text-gray-600">
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleInputChange}
              placeholder="Código"
              className="w-20 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 px-0 py-1"
              required
            />
            <input
              type="text"
              name="sigla"
              value={formData.sigla}
              onChange={handleInputChange}
              placeholder="Sigla"
              className="w-16 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 px-0 py-1"
              required
            />
          </div>
        </div>

        {/* Level Badge */}
        <div className="flex-shrink-0">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            Nivel {nivel}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs border border-gray-300 rounded text-gray-700 hover:bg-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {submitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex gap-2 p-2 bg-red-50 border-l-4 border-red-600 ml-4 mt-2 text-xs">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </form>
  );
}
