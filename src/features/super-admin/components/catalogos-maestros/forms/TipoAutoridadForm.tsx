// Formulario para Tipo de Autoridad (mejorado)
import { Shield } from 'lucide-react';
import { NuevoTipoAutoridad } from '../types';

interface TipoAutoridadFormProps {
    value: NuevoTipoAutoridad;
    onChange: (value: NuevoTipoAutoridad) => void;
}

export function TipoAutoridadForm({ value, onChange }: TipoAutoridadFormProps) {
    return (
        <div className="space-y-5">
            {/* Código */}
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Código
                </label>
                <input
                    type="text"
                    value={value.codigo}
                    onChange={(e) => onChange({ ...value, codigo: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-lg transition-all"
                    placeholder="Ej: REC, DEC, DIR"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                    Código corto para identificar el cargo
                </p>
            </div>

            {/* Nombre */}
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Nombre del cargo
                </label>
                <input
                    type="text"
                    value={value.nombre}
                    onChange={(e) => onChange({ ...value, nombre: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg transition-all"
                    placeholder="Ej: Rector, Decano, Director"
                />
            </div>

            {/* Nivel jerárquico - visual mejorado */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Nivel de autoridad
                </label>
                <div className="flex items-center gap-3">
                    <input
                        type="range"
                        min="0"
                        max="5"
                        value={value.nivelJerarquia}
                        onChange={(e) => onChange({ ...value, nivelJerarquia: parseInt(e.target.value) })}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                        {value.nivelJerarquia}
                    </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Máxima autoridad</span>
                    <span>Menor jerarquía</span>
                </div>
            </div>

            {/* Descripción */}
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Descripción <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <textarea
                    value={value.descripcion}
                    onChange={(e) => onChange({ ...value, descripcion: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all"
                    rows={2}
                    placeholder="Funciones o responsabilidades del cargo..."
                />
            </div>
        </div>
    );
}
