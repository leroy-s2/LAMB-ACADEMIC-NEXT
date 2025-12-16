'use client';

import { useState } from 'react';
import { UserCog, Search, Shield, Plus, X, Check } from 'lucide-react';

interface PermisoEspecial {
  id: string;
  usuario: string;
  email: string;
  permiso: string;
  modulo: string;
  tipo: 'CONCEDIDO' | 'REVOCADO';
  fechaAsignacion: string;
  vigencia: string;
  asignadoPor: string;
}

export function PermisosIndividuales() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('TODOS');

  const [permisos] = useState<PermisoEspecial[]>([
    {
      id: '1',
      usuario: 'Carlos Mendoza',
      email: 'carlos.mendoza@upeu.edu.pe',
      permiso: 'Modificar Notas Cerradas',
      modulo: 'Gestión de Notas',
      tipo: 'CONCEDIDO',
      fechaAsignacion: '2025-12-01',
      vigencia: '2025-12-31',
      asignadoPor: 'admin_ti',
    },
    {
      id: '2',
      usuario: 'María González',
      email: 'maria.gonzalez@upeu.edu.pe',
      permiso: 'Eliminar Registros Académicos',
      modulo: 'Registros Académicos',
      tipo: 'CONCEDIDO',
      fechaAsignacion: '2025-11-15',
      vigencia: '2026-03-15',
      asignadoPor: 'admin_ti',
    },
    {
      id: '3',
      usuario: 'Roberto Silva',
      email: 'roberto.silva@upeu.edu.pe',
      permiso: 'Acceso a Auditoría',
      modulo: 'Seguridad',
      tipo: 'REVOCADO',
      fechaAsignacion: '2025-10-10',
      vigencia: '2025-11-30',
      asignadoPor: 'admin_ti',
    },
    {
      id: '4',
      usuario: 'Ana Torres',
      email: 'ana.torres@upeu.edu.pe',
      permiso: 'Configurar Sistema',
      modulo: 'Configuración',
      tipo: 'CONCEDIDO',
      fechaAsignacion: '2025-12-05',
      vigencia: 'PERMANENTE',
      asignadoPor: 'super_admin',
    },
    {
      id: '5',
      usuario: 'Luis Ramírez',
      email: 'luis.ramirez@upeu.edu.pe',
      permiso: 'Exportar Datos Financieros',
      modulo: 'Finanzas',
      tipo: 'CONCEDIDO',
      fechaAsignacion: '2025-12-08',
      vigencia: '2026-01-31',
      asignadoPor: 'admin_ti',
    },
  ]);

  const filteredPermisos = permisos.filter((p) => {
    const matchesSearch =
      p.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.permiso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.modulo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo = filterTipo === 'TODOS' || p.tipo === filterTipo;

    return matchesSearch && matchesTipo;
  });

  const concedidos = permisos.filter((p) => p.tipo === 'CONCEDIDO').length;
  const revocados = permisos.filter((p) => p.tipo === 'REVOCADO').length;

  return (
    <div className="p-8 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <UserCog className="w-8 h-8" />
          Permisos Individuales
        </h1>
        <p className="text-gray-600">
          Gestión de permisos especiales asignados a usuarios específicos
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 font-medium">Total Permisos</h3>
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">{permisos.length}</p>
          <p className="text-xs text-gray-500 mt-1">Especiales asignados</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 font-medium">Concedidos</h3>
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-semibold text-green-600">{concedidos}</p>
          <p className="text-xs text-gray-500 mt-1">Actualmente activos</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 font-medium">Revocados</h3>
            <X className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-semibold text-red-600">{revocados}</p>
          <p className="text-xs text-gray-500 mt-1">Desactivados</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 font-medium">Usuarios</h3>
            <UserCog className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {new Set(permisos.map((p) => p.email)).size}
          </p>
          <p className="text-xs text-gray-500 mt-1">Con permisos especiales</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuario, email, permiso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="TODOS">Todos</option>
              <option value="CONCEDIDO">Concedidos</option>
              <option value="REVOCADO">Revocados</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg whitespace-nowrap">
              <Plus className="w-4 h-4" />
              Asignar Permiso
            </button>
          </div>
        </div>
      </div>

      {/* Alerta informativa */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-amber-900 mb-1">
            Sobre los Permisos Individuales
          </h4>
          <p className="text-xs text-amber-800">
            Los permisos individuales son excepciones que se otorgan a usuarios específicos más
            allá de los permisos de su rol. Úsalos con precaución y siempre con fecha de vigencia
            limitada.
          </p>
        </div>
      </div>

      {/* Tabla de permisos */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permiso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Módulo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vigencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asignado Por
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPermisos.map((permiso) => (
                <tr key={permiso.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{permiso.usuario}</div>
                      <div className="text-xs text-gray-500">{permiso.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{permiso.permiso}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                      {permiso.modulo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {permiso.tipo === 'CONCEDIDO' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                        <Check className="w-3 h-3" />
                        CONCEDIDO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-medium">
                        <X className="w-3 h-3" />
                        REVOCADO
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {permiso.vigencia === 'PERMANENTE' ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                          PERMANENTE
                        </span>
                      ) : (
                        <>
                          <div className="text-xs text-gray-500">
                            Desde: {permiso.fechaAsignacion}
                          </div>
                          <div className="text-xs text-gray-900 font-medium">
                            Hasta: {permiso.vigencia}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {permiso.asignadoPor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {permiso.tipo === 'CONCEDIDO' ? (
                      <button className="text-red-600 hover:text-red-900 px-3 py-1 hover:bg-red-50 rounded transition-colors">
                        Revocar
                      </button>
                    ) : (
                      <button className="text-green-600 hover:text-green-900 px-3 py-1 hover:bg-green-50 rounded transition-colors">
                        Restaurar
                      </button>
                    )}
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
