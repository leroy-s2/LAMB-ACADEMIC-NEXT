'use client';

import { useState } from 'react';
import {
  Shield,
  Search,
  Filter,
  FileText,
  Calendar,
  User,
  Database,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
} from 'lucide-react';

interface LogAuditoria {
  id: string;
  fecha: string;
  usuario: string;
  accion: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
  tabla: string;
  registroId: string;
  datosAnteriores: any;
  datosNuevos: any;
  ip: string;
  modulo: string;
}

export function AuditoriaSeguridad() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAccion, setFilterAccion] = useState('TODAS');
  const [filterModulo, setFilterModulo] = useState('TODOS');
  const [filterUsuario, setFilterUsuario] = useState('TODOS');
  const [fechaInicio, setFechaInicio] = useState('2025-12-01');
  const [fechaFin, setFechaFin] = useState('2025-12-09');

  const [logs] = useState<LogAuditoria[]>([
    {
      id: '1',
      fecha: '2025-12-09 10:45:23',
      usuario: 'admin_ti',
      accion: 'INSERT',
      tabla: 'ProgramaAcademico',
      registroId: 'PA-2025-001',
      datosAnteriores: null,
      datosNuevos: {
        nombre: 'Maestría en Ciencia de Datos',
        codigo: 'MCD-2025',
        nivel: 'POSGRADO',
      },
      ip: '192.168.1.105',
      modulo: 'Programas Académicos',
    },
    {
      id: '2',
      fecha: '2025-12-09 10:30:15',
      usuario: 'director_epim',
      accion: 'UPDATE',
      tabla: 'Nota',
      registroId: 'N-2025-4523',
      datosAnteriores: {
        nota_final: 14,
        estado: 'PENDIENTE',
      },
      datosNuevos: {
        nota_final: 16,
        estado: 'APROBADO',
      },
      ip: '192.168.1.87',
      modulo: 'Gestión de Notas',
    },
    {
      id: '3',
      fecha: '2025-12-09 09:15:42',
      usuario: 'admin_ext',
      accion: 'SELECT',
      tabla: 'AuthUsuario',
      registroId: 'USR-001',
      datosAnteriores: null,
      datosNuevos: null,
      ip: '203.45.12.89',
      modulo: 'Seguridad',
    },
    {
      id: '4',
      fecha: '2025-12-09 08:20:11',
      usuario: 'decano_fic',
      accion: 'DELETE',
      tabla: 'DocenteCurso',
      registroId: 'DC-2024-189',
      datosAnteriores: {
        docente_id: 'DOC-456',
        curso_id: 'CUR-789',
        periodo: '2024-2',
      },
      datosNuevos: null,
      ip: '192.168.1.92',
      modulo: 'Gestión Docente',
    },
    {
      id: '5',
      fecha: '2025-12-09 07:45:33',
      usuario: 'sec_general',
      accion: 'INSERT',
      tabla: 'ActaNota',
      registroId: 'ACT-2025-023',
      datosAnteriores: null,
      datosNuevos: {
        curso: 'Cálculo II',
        seccion: 'A',
        firmado_por: 'sec_general',
      },
      ip: '192.168.1.78',
      modulo: 'Actas Oficiales',
    },
  ]);

  const usuarios = Array.from(new Set(logs.map((l) => l.usuario)));
  const modulos = Array.from(new Set(logs.map((l) => l.modulo)));

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.tabla.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.modulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.registroId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAccion = filterAccion === 'TODAS' || log.accion === filterAccion;
    const matchesModulo = filterModulo === 'TODOS' || log.modulo === filterModulo;
    const matchesUsuario = filterUsuario === 'TODOS' || log.usuario === filterUsuario;

    const logDate = new Date(log.fecha);
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);
    const matchesFecha = logDate >= startDate && logDate <= endDate;

    return matchesSearch && matchesAccion && matchesModulo && matchesUsuario && matchesFecha;
  });

  const getAccionColor = (accion: string) => {
    switch (accion) {
      case 'INSERT':
        return 'bg-green-100 text-green-700';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-700';
      case 'DELETE':
        return 'bg-red-100 text-red-700';
      case 'SELECT':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getAccionIcon = (accion: string) => {
    switch (accion) {
      case 'INSERT':
        return <CheckCircle className="w-4 h-4" />;
      case 'UPDATE':
        return <Activity className="w-4 h-4" />;
      case 'DELETE':
        return <XCircle className="w-4 h-4" />;
      case 'SELECT':
        return <Eye className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Shield className="w-8 h-8" />
          Auditoría y Seguridad
        </h1>
        <p className="text-gray-600">Monitoreo completo de actividades del sistema</p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 font-medium">Total Registros</h3>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{logs.length}</p>
          <p className="text-xs text-gray-500 mt-1">En el período seleccionado</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 font-medium">Usuarios Activos</h3>
            <User className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{usuarios.length}</p>
          <p className="text-xs text-gray-500 mt-1">Con actividad registrada</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 font-medium">Módulos Accedidos</h3>
            <Database className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{modulos.length}</p>
          <p className="text-xs text-gray-500 mt-1">Diferentes módulos</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 font-medium">Alertas</h3>
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">2</p>
          <p className="text-xs text-gray-500 mt-1">Accesos sospechosos</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Búsqueda */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Usuario, tabla, módulo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por acción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Acción</label>
            <select
              value={filterAccion}
              onChange={(e) => setFilterAccion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="TODAS">Todas</option>
              <option value="INSERT">INSERT</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="SELECT">SELECT</option>
            </select>
          </div>

          {/* Fecha inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Fecha fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-semibold">{filteredLogs.length}</span> de{' '}
            <span className="font-semibold">{logs.length}</span> registros
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Exportar Reporte
          </button>
        </div>
      </div>

      {/* Tabla de logs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tabla/Módulo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registro ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.fecha}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                        {log.usuario.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{log.usuario}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${getAccionColor(
                        log.accion
                      )}`}
                    >
                      {getAccionIcon(log.accion)}
                      {log.accion}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{log.tabla}</div>
                    <div className="text-xs text-gray-500">{log.modulo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <code className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {log.registroId}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1 ml-auto">
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>
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
