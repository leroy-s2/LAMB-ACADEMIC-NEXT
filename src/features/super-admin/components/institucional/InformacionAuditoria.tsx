'use client';

import { FileText } from 'lucide-react';
import { Universidad } from '../../services/universidadService';

interface InformacionAuditoriaProps {
    config: Universidad;
}

export function InformacionAuditoria({ config }: InformacionAuditoriaProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">Información Adicional</h2>
                        <p className="text-sm text-gray-500">Datos de auditoría y estado del sistema</p>
                    </div>
                </div>
            </div>

            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">ID</p>
                    <p className="text-lg font-semibold text-gray-900">{config.id}</p>
                </div>

                <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">Estado</p>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${config.active
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                        {config.active ? 'Activo' : 'Inactivo'}
                    </span>
                </div>

                <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">Creado Por</p>
                    <p className="text-sm text-gray-700">{config.createdBy}</p>
                </div>

                <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">Actualizado Por</p>
                    <p className="text-sm text-gray-700">{config.updatedBy}</p>
                </div>

                <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">Fecha de Creación</p>
                    <p className="text-sm text-gray-700">{new Date(config.createdAt).toLocaleDateString()}</p>
                </div>

                <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">Última Actualización</p>
                    <p className="text-sm text-gray-700">{new Date(config.updatedAt).toLocaleDateString()}</p>
                </div>

                {config.totalEstudiantes !== null && (
                    <div>
                        <p className="text-xs text-gray-600 font-medium mb-1">Total Estudiantes</p>
                        <p className="text-lg font-semibold text-gray-900">{config.totalEstudiantes}</p>
                    </div>
                )}

                {config.totalDocentes !== null && (
                    <div>
                        <p className="text-xs text-gray-600 font-medium mb-1">Total Docentes</p>
                        <p className="text-lg font-semibold text-gray-900">{config.totalDocentes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
