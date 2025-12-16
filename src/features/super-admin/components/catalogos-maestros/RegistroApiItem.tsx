// Item de registro de API con visualización de nivel
import { Edit, Trash2 } from 'lucide-react';
import { ApiRecord } from './types';
import { getNivelStyles } from '../../data/catalogosData';

interface RegistroApiItemProps {
    registro: ApiRecord;
    onEdit?: (registro: ApiRecord) => void;
    onDelete?: (registro: ApiRecord) => void;
}

export function RegistroApiItem({ registro, onEdit, onDelete }: RegistroApiItemProps) {
    // Obtener el nivel (puede ser 'nivel' o 'nivelJerarquia')
    const nivel = (registro as any).nivel ?? (registro as any).nivelJerarquia ?? 0;
    const codigo = (registro as any).codigo;
    const active = (registro as any).active ?? true;
    const descripcion = (registro as any).descripcion;
    const permiteAsignacion = (registro as any).permiteAsignacion;

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
                {/* Círculo con nivel */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${getNivelStyles(nivel)}`}>
                    {nivel}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-semibold">
                            {registro.nombre}
                        </span>
                        {codigo && (
                            <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded font-mono">
                                {codigo}
                            </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs rounded ${active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            {active ? 'Activo' : 'Inactivo'}
                        </span>
                        {permiteAsignacion !== undefined && (
                            <span className={`px-2 py-0.5 text-xs rounded ${permiteAsignacion
                                ? 'bg-cyan-100 text-cyan-700'
                                : 'bg-gray-100 text-gray-500'
                                }`}>
                                {permiteAsignacion ? '✓ Asignable' : '✗ No asignable'}
                            </span>
                        )}
                    </div>
                    {descripcion && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {descripcion}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2 ml-2">
                <button
                    onClick={() => onEdit?.(registro)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete?.(registro)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
