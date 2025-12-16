// Formulario para Tipo de Unidad Administrativa (mejorado)
import { Building2 } from 'lucide-react';
import { NuevoTipoUnidad } from '../types';

interface TipoUnidadFormProps {
    value: NuevoTipoUnidad;
    onChange: (value: NuevoTipoUnidad) => void;
}

export function TipoUnidadForm({ value, onChange }: TipoUnidadFormProps) {
    return (
        <div className="space-y-5">
            {/* Nombre */}
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Nombre del tipo
                </label>
                <input
                    type="text"
                    value={value.nombre}
                    onChange={(e) => onChange({ ...value, nombre: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all"
                    placeholder="Ej: FACULTAD, ESCUELA, DEPARTAMENTO"
                />
            </div>

            {/* Descripción */}
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Descripción
                </label>
                <textarea
                    value={value.descripcion}
                    onChange={(e) => onChange({ ...value, descripcion: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                    rows={3}
                    placeholder="Descripción breve de este tipo de unidad..."
                />
            </div>

            {/* Nivel jerárquico - visual mejorado */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Nivel en la jerarquía
                </label>
                <div className="flex items-center gap-3">
                    <input
                        type="range"
                        min="0"
                        max="5"
                        value={value.nivel}
                        onChange={(e) => onChange({ ...value, nivel: parseInt(e.target.value) })}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                        {value.nivel}
                    </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Más alto</span>
                    <span>Más bajo</span>
                </div>
            </div>
        </div>
    );
}
