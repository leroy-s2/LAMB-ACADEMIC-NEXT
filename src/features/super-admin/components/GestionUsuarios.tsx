'use client';

import { useState } from 'react';
import { Usuario } from '../types';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

export function GestionUsuarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('TODOS');
  const [filterEstado, setFilterEstado] = useState('TODOS');

  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: '1',
      username: 'rector_principal',
      email: 'rector@upeu.edu.pe',
      nombreCompleto: 'Dr. Jorge Alva Hurtado',
      dni: '12345678',
      rol: 'ROLE_RECTOR',
      estado: 'ACTIVO',
      intentosFallidos: 0,
      ultimoAcceso: '2025-12-09 09:30',
      fechaCreacion: '2024-01-15',
      unidadOrganizativaId: 'SECT-001',
      unidadOrganizativaNombre: 'Rectorado - Campus Central',
      nivelOrganizativo: 0,
    },
    {
      id: '2',
      username: 'decano_fic',
      email: 'decano.fic@upeu.edu.pe',
      nombreCompleto: 'Dr. Manuel Gonzales Silva',
      dni: '23456789',
      rol: 'ROLE_DECANO',
      estado: 'ACTIVO',
      intentosFallidos: 0,
      ultimoAcceso: '2025-12-09 08:15',
      fechaCreacion: '2024-02-01',
      unidadOrganizativaId: 'FAC-001',
      unidadOrganizativaNombre: 'Facultad de Ingeniería Civil',
      nivelOrganizativo: 1,
    },
    {
      id: '3',
      username: 'admin_ti',
      email: 'admin.ti@upeu.edu.pe',
      nombreCompleto: 'Ing. Carlos Ramírez Torres',
      dni: '34567890',
      rol: 'ROLE_ADMIN',
      estado: 'ACTIVO',
      intentosFallidos: 0,
      ultimoAcceso: '2025-12-09 10:45',
      fechaCreacion: '2024-01-10',
      unidadOrganizativaId: 'SECT-002',
      unidadOrganizativaNombre: 'Oficina Central de TI',
      nivelOrganizativo: 0,
    },
    {
      id: '4',
      username: 'sec_general',
      email: 'secretario@upeu.edu.pe',
      nombreCompleto: 'Dra. Patricia Morales Vega',
      dni: '45678901',
      rol: 'ROLE_SECRETARIO',
      estado: 'ACTIVO',
      intentosFallidos: 1,
      ultimoAcceso: '2025-12-09 07:20',
      fechaCreacion: '2024-01-20',
      unidadOrganizativaId: 'SECT-003',
      unidadOrganizativaNombre: 'Secretaría General',
      nivelOrganizativo: 0,
    },
    {
      id: '5',
      username: 'admin_ext',
      email: 'externo@consultant.com',
      nombreCompleto: 'Lic. Roberto Sánchez Luna',
      dni: '56789012',
      rol: 'ROLE_SOPORTE',
      estado: 'BLOQUEADO',
      intentosFallidos: 5,
      ultimoAcceso: '2025-12-08 18:30',
      fechaCreacion: '2024-11-01',
      unidadOrganizativaId: 'SECT-002',
      unidadOrganizativaNombre: 'Oficina Central de TI',
      nivelOrganizativo: 0,
    },
    {
      id: '6',
      username: 'director_sistemas',
      email: 'director.sistemas@upeu.edu.pe',
      nombreCompleto: 'Mg. Ana María López Cruz',
      dni: '67890123',
      rol: 'ROLE_DIRECTOR',
      estado: 'ACTIVO',
      intentosFallidos: 0,
      ultimoAcceso: '2025-12-09 09:00',
      fechaCreacion: '2024-03-15',
      unidadOrganizativaId: 'ESC-001',
      unidadOrganizativaNombre: 'Escuela de Ingeniería de Sistemas',
      nivelOrganizativo: 2,
    },
  ]);

  const roles = ['TODOS', 'ROLE_ADMIN', 'ROLE_RECTOR', 'ROLE_DECANO', 'ROLE_DIRECTOR', 'ROLE_SECRETARIO', 'ROLE_SOPORTE'];
  const estados = ['TODOS', 'ACTIVO', 'BLOQUEADO', 'INACTIVO'];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'ACTIVO':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Activo
          </span>
        );
      case 'BLOQUEADO':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" />
            Bloqueado
          </span>
        );
      case 'INACTIVO':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
            <AlertTriangle className="w-3 h-3" />
            Inactivo
          </span>
        );
      default:
        return null;
    }
  };

  const getRolBadge = (rol: string) => {
    const colores: Record<string, string> = {
      ROLE_ADMIN: 'bg-red-100 text-red-700',
      ROLE_RECTOR: 'bg-purple-100 text-purple-700',
      ROLE_DECANO: 'bg-blue-100 text-blue-700',
      ROLE_DIRECTOR: 'bg-indigo-100 text-indigo-700',
      ROLE_SECRETARIO: 'bg-green-100 text-green-700',
      ROLE_SOPORTE: 'bg-orange-100 text-orange-700',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colores[rol] || 'bg-gray-100 text-gray-700'}`}>
        {rol.replace('ROLE_', '')}
      </span>
    );
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const matchSearch =
      usuario.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.dni.includes(searchTerm);

    const matchRol = filterRol === 'TODOS' || usuario.rol === filterRol;
    const matchEstado = filterEstado === 'TODOS' || usuario.estado === filterEstado;

    return matchSearch && matchRol && matchEstado;
  });

  return (
    <div className="p-8 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Users className="w-8 h-8" />
          Gestión de Usuarios del Sistema
        </h1>
        <p className="text-gray-600">
          Administración centralizada de cuentas y accesos
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar usuario
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Nombre, username, email o DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por rol
            </label>
            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {roles.map((rol) => (
                <option key={rol} value={rol}>
                  {rol === 'TODOS' ? 'Todos los roles' : rol.replace('ROLE_', '')}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por estado
            </label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado === 'TODOS' ? 'Todos los estados' : estado}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-semibold">{usuariosFiltrados.length}</span> de{' '}
            <span className="font-semibold">{usuarios.length}</span> usuarios
          </p>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidad Organizativa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Acceso
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {usuario.nombreCompleto.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {usuario.nombreCompleto}
                        </div>
                        <div className="text-sm text-gray-500">
                          {usuario.username} • {usuario.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRolBadge(usuario.rol)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{usuario.unidadOrganizativaNombre}</div>
                    <div className="text-sm text-gray-500">
                      Nivel {usuario.nivelOrganizativo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEstadoBadge(usuario.estado)}
                    {usuario.intentosFallidos > 0 && (
                      <div className="text-xs text-red-600 mt-1">
                        {usuario.intentosFallidos} intentos fallidos
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {usuario.ultimoAcceso}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {usuario.estado === 'BLOQUEADO' ? (
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Desbloquear"
                        >
                          <Unlock className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Bloquear"
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
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
