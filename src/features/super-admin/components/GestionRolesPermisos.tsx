'use client';

import { useState, useRef, useEffect } from 'react';
import { RolPermisos, Permiso } from '../types';
import { Lock, Shield, Users, FileText, Settings, X } from 'lucide-react';

// ============================================
// TIPOS PARA PERMISOS API
// ============================================
interface ApiMethod {
  get: boolean;
  post: boolean;
  put: boolean;
  delete: boolean;
}

// ============================================
// COMPONENTE: Popup de Permisos API
// ============================================
interface ApiPopupProps {
  permisoId: string;
  permisoNombre: string;
  methods: ApiMethod;
  onUpdate: (permisoId: string, methods: ApiMethod) => void;
  onClose: () => void;
}

function ApiPermissionsPopup({ permisoId, permisoNombre, methods, onUpdate, onClose }: ApiPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const toggleMethod = (method: keyof ApiMethod) => {
    onUpdate(permisoId, { ...methods, [method]: !methods[method] });
  };

  return (
    <div
      ref={popupRef}
      className="absolute z-50 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[180px]"
    >
      <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-700">Métodos API</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-3 h-3" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {(['get', 'post', 'put', 'delete'] as const).map((method) => (
          <button
            key={method}
            onClick={() => toggleMethod(method)}
            className={`px-2 py-1 text-xs font-bold rounded transition-colors ${methods[method]
                ? method === 'get' ? 'bg-green-500 text-white'
                  : method === 'post' ? 'bg-blue-500 text-white'
                    : method === 'put' ? 'bg-yellow-500 text-white'
                      : 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-400'
              }`}
          >
            {method.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export function GestionRolesPermisos() {
  const permisos: Permiso[] = [
    // Estudiantes
    { id: 'READ_ESTUDIANTES', nombre: 'Ver Estudiantes', descripcion: 'Visualizar lista de estudiantes', categoria: 'Estudiantes' },
    { id: 'WRITE_ESTUDIANTES', nombre: 'Gestionar Estudiantes', descripcion: 'Crear y editar estudiantes', categoria: 'Estudiantes' },
    { id: 'DELETE_ESTUDIANTES', nombre: 'Eliminar Estudiantes', descripcion: 'Eliminar registros de estudiantes', categoria: 'Estudiantes' },

    // Académico
    { id: 'READ_NOTAS', nombre: 'Ver Notas', descripcion: 'Visualizar calificaciones', categoria: 'Académico' },
    { id: 'WRITE_NOTAS', nombre: 'Registrar Notas', descripcion: 'Ingresar y modificar notas', categoria: 'Académico' },
    { id: 'APPROVE_NOTAS', nombre: 'Aprobar Notas', descripcion: 'Aprobar actas de notas', categoria: 'Académico' },
    { id: 'READ_ACTAS', nombre: 'Ver Actas', descripcion: 'Visualizar actas oficiales', categoria: 'Académico' },
    { id: 'WRITE_ACTAS', nombre: 'Generar Actas', descripcion: 'Crear actas oficiales', categoria: 'Académico' },
    { id: 'SIGN_ACTAS', nombre: 'Firmar Actas', descripcion: 'Firmar digitalmente actas', categoria: 'Académico' },

    // Programas
    { id: 'READ_PROGRAMAS', nombre: 'Ver Programas', descripcion: 'Visualizar programas académicos', categoria: 'Programas' },
    { id: 'WRITE_PROGRAMAS', nombre: 'Gestionar Programas', descripcion: 'Crear y editar programas', categoria: 'Programas' },
    { id: 'DELETE_PROGRAMAS', nombre: 'Eliminar Programas', descripcion: 'Eliminar programas académicos', categoria: 'Programas' },

    // Docentes
    { id: 'READ_DOCENTES', nombre: 'Ver Docentes', descripcion: 'Visualizar lista de docentes', categoria: 'Docentes' },
    { id: 'WRITE_DOCENTES', nombre: 'Gestionar Docentes', descripcion: 'Crear y editar docentes', categoria: 'Docentes' },

    // Reportes
    { id: 'READ_REPORTES', nombre: 'Ver Reportes', descripcion: 'Visualizar reportes del sistema', categoria: 'Reportes' },
    { id: 'EXPORT_REPORTES', nombre: 'Exportar Reportes', descripcion: 'Exportar reportes a PDF/Excel', categoria: 'Reportes' },

    // Sistema
    { id: 'READ_AUDITORIA', nombre: 'Ver Auditoría', descripcion: 'Acceso a logs de auditoría', categoria: 'Sistema' },
    { id: 'WRITE_CONFIG', nombre: 'Configurar Sistema', descripcion: 'Modificar configuración global', categoria: 'Sistema' },
    { id: 'MANAGE_USERS', nombre: 'Gestionar Usuarios', descripcion: 'Administrar cuentas de usuario', categoria: 'Sistema' },
    { id: 'MANAGE_BACKUPS', nombre: 'Gestionar Backups', descripcion: 'Crear y restaurar backups', categoria: 'Sistema' },
  ];

  const [rolesPermisos, setRolesPermisos] = useState<RolPermisos[]>([
    {
      rol: 'ROLE_ADMIN',
      nombre: 'Administrador TI',
      descripcion: 'Acceso total al sistema',
      color: 'bg-red-100 text-red-700',
      permisos: new Set(permisos.map((p) => p.id)),
    },
    {
      rol: 'ROLE_RECTOR',
      nombre: 'Rector',
      descripcion: 'Gestión y supervisión universitaria',
      color: 'bg-purple-100 text-purple-700',
      permisos: new Set(['READ_ESTUDIANTES', 'READ_DOCENTES', 'READ_PROGRAMAS', 'READ_NOTAS', 'READ_ACTAS', 'READ_REPORTES', 'EXPORT_REPORTES', 'APPROVE_NOTAS', 'SIGN_ACTAS']),
    },
    {
      rol: 'ROLE_DECANO',
      nombre: 'Decano',
      descripcion: 'Gestión de facultad',
      color: 'bg-blue-100 text-blue-700',
      permisos: new Set(['READ_ESTUDIANTES', 'READ_DOCENTES', 'WRITE_DOCENTES', 'READ_PROGRAMAS', 'WRITE_PROGRAMAS', 'READ_NOTAS', 'READ_ACTAS', 'SIGN_ACTAS', 'READ_REPORTES']),
    },
    {
      rol: 'ROLE_DIRECTOR',
      nombre: 'Director de Escuela',
      descripcion: 'Gestión de programa académico',
      color: 'bg-indigo-100 text-indigo-700',
      permisos: new Set(['READ_ESTUDIANTES', 'WRITE_ESTUDIANTES', 'READ_DOCENTES', 'WRITE_DOCENTES', 'READ_NOTAS', 'WRITE_NOTAS', 'READ_ACTAS', 'WRITE_ACTAS', 'READ_REPORTES']),
    },
    {
      rol: 'ROLE_SECRETARIO',
      nombre: 'Secretario General',
      descripcion: 'Documentación y archivo oficial',
      color: 'bg-green-100 text-green-700',
      permisos: new Set(['READ_ESTUDIANTES', 'READ_DOCENTES', 'READ_NOTAS', 'READ_ACTAS', 'WRITE_ACTAS', 'SIGN_ACTAS', 'READ_REPORTES', 'EXPORT_REPORTES']),
    },
    {
      rol: 'ROLE_SOPORTE',
      nombre: 'Soporte Técnico',
      descripcion: 'Asistencia técnica limitada',
      color: 'bg-orange-100 text-orange-700',
      permisos: new Set(['READ_ESTUDIANTES', 'READ_DOCENTES', 'READ_PROGRAMAS', 'READ_AUDITORIA']),
    },
    {
      rol: 'ROLE_DOCENTE',
      nombre: 'Docente',
      descripcion: 'Acceso a cursos y notas',
      color: 'bg-cyan-100 text-cyan-700',
      permisos: new Set(['READ_ESTUDIANTES', 'READ_NOTAS', 'WRITE_NOTAS', 'READ_REPORTES']),
    },
  ]);

  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [activePopup, setActivePopup] = useState<string | null>(null);

  // Estado para métodos API por permiso
  const [apiMethods, setApiMethods] = useState<Record<string, ApiMethod>>(() => {
    const initial: Record<string, ApiMethod> = {};
    permisos.forEach((p) => {
      initial[p.id] = { get: true, post: false, put: false, delete: false };
    });
    return initial;
  });

  const categorias = Array.from(new Set(permisos.map((p) => p.categoria)));

  const togglePermiso = (rolIndex: number, permisoId: string) => {
    const newRoles = [...rolesPermisos];
    const permisosSet = new Set(newRoles[rolIndex].permisos);
    if (permisosSet.has(permisoId)) {
      permisosSet.delete(permisoId);
    } else {
      permisosSet.add(permisoId);
    }
    newRoles[rolIndex].permisos = permisosSet;
    setRolesPermisos(newRoles);
  };

  const updateApiMethods = (permisoId: string, methods: ApiMethod) => {
    setApiMethods((prev) => ({ ...prev, [permisoId]: methods }));
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'Estudiantes': return <Users className="w-4 h-4" />;
      case 'Académico': return <FileText className="w-4 h-4" />;
      case 'Programas': return <Settings className="w-4 h-4" />;
      case 'Docentes': return <Users className="w-4 h-4" />;
      case 'Reportes': return <FileText className="w-4 h-4" />;
      case 'Sistema': return <Shield className="w-4 h-4" />;
      default: return <Lock className="w-4 h-4" />;
    }
  };

  // Contar métodos activos
  const countActiveMethods = (permisoId: string) => {
    const m = apiMethods[permisoId];
    return [m.get, m.post, m.put, m.delete].filter(Boolean).length;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Roles y Permisos</h1>
        <p className="text-sm text-gray-600">Matriz de control de acceso del sistema (RFZZ6)</p>
      </div>

      {/* Estadísticas de roles - SCROLL HORIZONTAL */}
      <div className="overflow-x-auto pb-2 mb-6">
        <div className="flex gap-4 min-w-max">
          {rolesPermisos.map((rol, idx) => {
            const colors = [
              { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
              { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
              { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
              { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
              { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
              { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
              { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
            ];
            const color = colors[idx] || colors[0];
            return (
              <div key={idx} className={`${color.bg} border ${color.border} rounded-lg p-4 text-center min-w-[140px]`}>
                <Shield className={`w-8 h-8 ${color.text} mx-auto mb-2`} />
                <div className={`text-2xl font-bold ${color.text} mb-1`}>{rol.permisos.size}</div>
                <div className="text-xs text-gray-600 font-medium">{rol.nombre}</div>
                <div className="text-xs text-gray-500 mt-1">permisos</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Matriz de Permisos por Rol */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Matriz de Permisos por Rol</h2>
              <p className="text-sm text-gray-500">Configure los permisos de cada rol del sistema</p>
            </div>
          </div>
        </div>

        {/* Botones de filtro por rol - SCROLL HORIZONTAL */}
        <div className="p-6 border-b border-gray-200 overflow-x-auto">
          <div className="flex flex-wrap gap-2 min-w-max">
            {rolesPermisos.map((rol, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedRoleIndex(idx)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${selectedRoleIndex === idx
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {rol.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Información del rol seleccionado */}
        {rolesPermisos[selectedRoleIndex] && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-7 h-7 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {rolesPermisos[selectedRoleIndex].nombre}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {rolesPermisos[selectedRoleIndex].descripcion}
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900">{rolesPermisos[selectedRoleIndex].permisos.size}</span>
                    <span className="text-gray-600"> de {permisos.length} permisos activos</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      {Math.round((rolesPermisos[selectedRoleIndex].permisos.size / permisos.length) * 100)}%
                    </span>
                    <span className="text-gray-600"> de cobertura</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Permisos del rol seleccionado */}
        <div className="p-6">
          {categorias.map((categoria) => {
            const categPermisos = permisos.filter((p) => p.categoria === categoria);
            const categAsignados = categPermisos.filter(
              (p) => rolesPermisos[selectedRoleIndex]?.permisos.has(p.id)
            ).length;

            return (
              <div key={categoria} className="mb-8 last:mb-0">
                {/* Encabezado de categoría */}
                <div className="flex items-center gap-2 mb-4">
                  {getCategoriaIcon(categoria)}
                  <h4 className="text-sm font-semibold text-gray-900">{categoria}</h4>
                  <span className="text-xs text-gray-600">{categAsignados} / {categPermisos.length}</span>
                </div>

                {/* Lista de permisos */}
                <div className="space-y-3">
                  {categPermisos.map((permiso) => {
                    const isChecked = rolesPermisos[selectedRoleIndex]?.permisos.has(permiso.id) || false;
                    const activeMethods = countActiveMethods(permiso.id);

                    return (
                      <div
                        key={permiso.id}
                        className="relative flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermiso(selectedRoleIndex, permiso.id)}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{permiso.nombre}</div>
                          <div className="text-xs text-gray-500">{permiso.id}</div>
                          <div className="text-xs text-gray-600 mt-1">{permiso.descripcion}</div>
                        </div>

                        {/* BOTÓN DE PERMISOS API */}
                        <div className="relative">
                          <button
                            onClick={() => setActivePopup(activePopup === permiso.id ? null : permiso.id)}
                            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${activeMethods > 0
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                          >
                            API ({activeMethods}/4)
                          </button>

                          {activePopup === permiso.id && (
                            <ApiPermissionsPopup
                              permisoId={permiso.id}
                              permisoNombre={permiso.nombre}
                              methods={apiMethods[permiso.id]}
                              onUpdate={updateApiMethods}
                              onClose={() => setActivePopup(null)}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="mt-6 flex justify-end gap-3">
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Guardar Cambios
        </button>
      </div>

      {/* Leyenda */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Información:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Los cambios en permisos afectan inmediatamente a todos los usuarios con ese rol</li>
          <li>• El botón "API" muestra los métodos HTTP permitidos (GET, POST, PUT, DELETE)</li>
          <li>• El rol ADMIN tiene todos los permisos por defecto</li>
        </ul>
      </div>
    </div>
  );
}
