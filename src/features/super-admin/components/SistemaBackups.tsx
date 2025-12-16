'use client';

import { useState } from 'react';
import {
  Database,
  HardDrive,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Server,
  Package,
  Play,
  Settings,
  FileArchive,
} from 'lucide-react';

interface Backup {
  id: string;
  nombre: string;
  tipo: 'COMPLETO' | 'INCREMENTAL' | 'DIFERENCIAL';
  fecha: string;
  tamano: string;
  estado: 'EXITOSO' | 'FALLIDO' | 'EN_PROCESO';
  duracion: string;
  ubicacion: string;
  automatico: boolean;
}

export function SistemaBackups() {
  const [backups] = useState<Backup[]>([
    {
      id: '1',
      nombre: 'backup_completo_2025_12_09',
      tipo: 'COMPLETO',
      fecha: '2025-12-09 02:00:00',
      tamano: '2.4 GB',
      estado: 'EXITOSO',
      duracion: '45 min',
      ubicacion: '/backups/completo/',
      automatico: true,
    },
    {
      id: '2',
      nombre: 'backup_incremental_2025_12_08',
      tipo: 'INCREMENTAL',
      fecha: '2025-12-08 14:30:00',
      tamano: '180 MB',
      estado: 'EXITOSO',
      duracion: '8 min',
      ubicacion: '/backups/incremental/',
      automatico: true,
    },
    {
      id: '3',
      nombre: 'backup_manual_archivos_2025_12_07',
      tipo: 'DIFERENCIAL',
      fecha: '2025-12-07 16:45:00',
      tamano: '520 MB',
      estado: 'EXITOSO',
      duracion: '15 min',
      ubicacion: '/backups/diferencial/',
      automatico: false,
    },
    {
      id: '4',
      nombre: 'backup_completo_2025_12_02',
      tipo: 'COMPLETO',
      fecha: '2025-12-02 02:00:00',
      tamano: '2.3 GB',
      estado: 'EXITOSO',
      duracion: '42 min',
      ubicacion: '/backups/completo/',
      automatico: true,
    },
    {
      id: '5',
      nombre: 'backup_incremental_2025_12_01',
      tipo: 'INCREMENTAL',
      fecha: '2025-12-01 18:00:00',
      tamano: '165 MB',
      estado: 'FALLIDO',
      duracion: '3 min',
      ubicacion: '/backups/incremental/',
      automatico: true,
    },
  ]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'EXITOSO':
        return 'bg-green-100 text-green-700';
      case 'FALLIDO':
        return 'bg-red-100 text-red-700';
      case 'EN_PROCESO':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'EXITOSO':
        return <CheckCircle className="w-4 h-4" />;
      case 'FALLIDO':
        return <AlertCircle className="w-4 h-4" />;
      case 'EN_PROCESO':
        return <Clock className="w-4 h-4 animate-spin" />;
      default:
        return null;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'COMPLETO':
        return 'bg-blue-100 text-blue-700';
      case 'INCREMENTAL':
        return 'bg-purple-100 text-purple-700';
      case 'DIFERENCIAL':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const exitosos = backups.filter((b) => b.estado === 'EXITOSO').length;
  const fallidos = backups.filter((b) => b.estado === 'FALLIDO').length;
  const ultimoBackup = backups[0];

  return (
    <div className="p-8 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Database className="w-8 h-8" />
          Sistema de Backups
        </h1>
        <p className="text-gray-600">Gestión de copias de seguridad y recuperación</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Último Backup</h3>
            <Clock className="w-5 h-5 opacity-80" />
          </div>
          <p className="text-2xl font-semibold">{ultimoBackup.fecha.split(' ')[0]}</p>
          <p className="text-xs opacity-80 mt-1">{ultimoBackup.tamano}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 font-medium">Exitosos</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{exitosos}</p>
          <p className="text-xs text-gray-500 mt-1">Backups completados</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 font-medium">Fallidos</h3>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{fallidos}</p>
          <p className="text-xs text-gray-500 mt-1">Con errores</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 font-medium">Espacio Total</h3>
            <HardDrive className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">5.6 GB</p>
          <p className="text-xs text-gray-500 mt-1">Almacenado</p>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
            <Play className="w-5 h-5" />
            Crear Backup Manual
          </button>

          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg">
            <Upload className="w-5 h-5" />
            Restaurar desde Backup
          </button>

          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg">
            <Calendar className="w-5 h-5" />
            Configurar Programación
          </button>
        </div>
      </div>

      {/* Configuración automática */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Server className="w-5 h-5" />
          Configuración Automática
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Backup Completo</h4>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                ACTIVO
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Cada domingo 02:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                <span>Retención: 30 días</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Backup Incremental</h4>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                ACTIVO
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Cada día 14:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                <span>Retención: 7 días</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Backup Diferencial</h4>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                INACTIVO
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Manual</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                <span>Retención: 15 días</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de backups */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileArchive className="w-5 h-5" />
            Historial de Backups
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tamaño
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{backup.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getTipoColor(
                        backup.tipo
                      )}`}
                    >
                      {backup.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {backup.fecha}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {backup.tamano}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {backup.duracion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${getEstadoColor(
                        backup.estado
                      )}`}
                    >
                      {getEstadoIcon(backup.estado)}
                      {backup.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {backup.automatico ? 'Automático' : 'Manual'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors">
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
