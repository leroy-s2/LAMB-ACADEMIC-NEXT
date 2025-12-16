// Formulario para Tipo de Localización (simplificado para usuario)
import { MapPin } from 'lucide-react';
import { NuevoTipoLocalizacion } from '../types';

interface TipoLocalizacionFormProps {
    value: NuevoTipoLocalizacion;
    onChange: (value: NuevoTipoLocalizacion) => void;
    isChild?: boolean; // Si es hijo de otro nodo
    parentName?: string; // Nombre del padre para mostrar contexto
}

export function TipoLocalizacionForm({ value, onChange, isChild = false, parentName }: TipoLocalizacionFormProps) {
    return (
        <div className="space-y-5">
            {/* Indicador visual de contexto */}
            {isChild && parentName && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700">
                        Se creará como hijo de: <strong>{parentName}</strong>
                    </span>
                </div>
            )}

            {/* Código */}
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Código identificador
                </label>
                <input
                    type="text"
                    value={value.codigo}
                    onChange={(e) => onChange({ ...value, codigo: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-lg transition-all"
                    placeholder="Ej: AULA, LAB, AUD"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                    Código corto único para identificar este tipo
                </p>
            </div>

            {/* Nombre */}
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Nombre descriptivo
                </label>
                <input
                    type="text"
                    value={value.nombre}
                    onChange={(e) => onChange({ ...value, nombre: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all"
                    placeholder="Ej: Aula de clases, Laboratorio, Auditorio"
                />
            </div>

            {/* Permite asignación - toggle estilizado */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <label className="flex items-center justify-between cursor-pointer">
                    <div>
                        <span className="text-sm font-semibold text-gray-800 block">
                            ¿Permite asignación de recursos?
                        </span>
                        <span className="text-xs text-gray-500">
                            Habilita asignar horarios, personas o equipos a este tipo de espacio
                        </span>
                    </div>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={value.permiteAsignacion}
                            onChange={(e) => onChange({ ...value, permiteAsignacion: e.target.checked })}
                            className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                    </div>
                </label>
            </div>
        </div>
    );
}
