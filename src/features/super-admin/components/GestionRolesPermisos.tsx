'use client';

import { useState, useRef, useEffect } from 'react';
import { RolPermisos, Permiso } from '../types';
import { Lock, Shield, Users, FileText, Settings, X } from 'lucide-react';
import { api } from '@/shared/services/http';

// ============================================
// TIPOS PARA PERMISOS API
// ============================================
interface ApiMethod {
  get: boolean;
  post: boolean;
  put: boolean;
  delete: boolean;
}

interface ApiPermiso {
  id: number;
  apiBase: string;
  descripcion: string;
  puedeGet: boolean;
  puedePost: boolean;
  puedePut: boolean;
  puedeDelete: boolean;
}

interface Target {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  apis: ApiPermiso[];
}

interface Modulo {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  orden: number;
  targets: Target[];
}

interface PermisosRolResponse {
  rolNombre: string;
  totalPermisos: number;
  modulos: Modulo[];
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

  const [rolesPermisos, setRolesPermisos] = useState<RolPermisos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar roles desde API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/admin/roles');
        
        if (response.data?.success && response.data?.data) {
          // Mapear datos de la API al formato del componente
          const rolesFormateados = response.data.data.map((rol: any, idx: number) => {
            const colors = [
              { bg: 'bg-red-100 text-red-700' },
              { bg: 'bg-purple-100 text-purple-700' },
              { bg: 'bg-blue-100 text-blue-700' },
              { bg: 'bg-indigo-100 text-indigo-700' },
              { bg: 'bg-green-100 text-green-700' },
              { bg: 'bg-orange-100 text-orange-700' },
              { bg: 'bg-cyan-100 text-cyan-700' },
            ];
            const color = colors[idx] || colors[0];
            
            return {
              rol: rol.nombre,
              nombre: rol.nombre,
              descripcion: `Rol: ${rol.nombre} - ${rol.totalPermisos} permisos asignados`,
              color: color.bg,
              permisos: new Set<string>(), // Inicia vacío, se configurará después
              totalPermisos: rol.totalPermisos,
              modulosActivos: rol.modulosActivos,
            };
          });
          
          setRolesPermisos(rolesFormateados);
        } else {
          setError('Error al cargar los roles');
        }
      } catch (err) {
        console.error('Error fetching roles:', err);
        setError('Error al conectar con la API de roles');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [selectedModulo, setSelectedModulo] = useState<string>('Todos');
  const [modulosPermisos, setModulosPermisos] = useState<Modulo[]>([]);
  const [loadingPermisos, setLoadingPermisos] = useState(false);
  const [savingPermisos, setSavingPermisos] = useState(false);

  // Cargar permisos del rol seleccionado
  useEffect(() => {
    const fetchPermisosRol = async () => {
      if (!rolesPermisos[selectedRoleIndex]) return;
      
      try {
        setLoadingPermisos(true);
        setSelectedModulo('Todos'); // Resetear filtro al cambiar rol
        const rolNombre = rolesPermisos[selectedRoleIndex].rol;
        const response = await api.get(`/admin/roles/${rolNombre}/permisos`);
        
        if (response.data?.success && response.data?.data?.modulos) {
          console.log('📦 Módulos cargados:', response.data.data.modulos);
          setModulosPermisos(response.data.data.modulos);
        }
      } catch (err) {
        console.error('Error fetching permisos rol:', err);
        setModulosPermisos([]);
      } finally {
        setLoadingPermisos(false);
      }
    };

    fetchPermisosRol();
  }, [selectedRoleIndex, rolesPermisos]);

  // Obtener códigos únicos de módulos para el filtro
  const modulosUnicos = ['Todos', ...Array.from(new Set(modulosPermisos.map(m => m.codigo)))];
  
  // Filtrar módulos según selección
  const modulosFiltrados = selectedModulo === 'Todos'
    ? modulosPermisos
    : modulosPermisos.filter(m => m.codigo === selectedModulo);

  // Cambiar estado de un target individual
  const toggleTarget = (moduloIndex: number, targetIndex: number) => {
    const nuevosModulos = [...modulosPermisos];
    nuevosModulos[moduloIndex].targets[targetIndex].activo = !nuevosModulos[moduloIndex].targets[targetIndex].activo;
    setModulosPermisos(nuevosModulos);
  };

  // Activar/Desactivar módulo completo
  const toggleModuloCompleto = (moduloIndex: number, activar: boolean) => {
    const nuevosModulos = [...modulosPermisos];
    nuevosModulos[moduloIndex].targets.forEach(target => {
      target.activo = activar;
    });
    setModulosPermisos(nuevosModulos);
  };

  // Asignar módulo completo (POST)
  const asignarModuloCompleto = async (moduloId: number) => {
    try {
      setSavingPermisos(true);
      const rolNombre = rolesPermisos[selectedRoleIndex].rol;
      await api.post(`/admin/roles/${rolNombre}/modulo/${moduloId}`);
      
      // Recargar permisos
      const response = await api.get(`/admin/roles/${rolNombre}/permisos`);
      if (response.data?.success && response.data?.data?.modulos) {
        setModulosPermisos(response.data.data.modulos);
      }
    } catch (err) {
      console.error('Error asignando módulo:', err);
    } finally {
      setSavingPermisos(false);
    }
  };

  // Remover módulo completo (DELETE)
  const removerModuloCompleto = async (moduloId: number) => {
    try {
      setSavingPermisos(true);
      const rolNombre = rolesPermisos[selectedRoleIndex].rol;
      await api.delete(`/admin/roles/${rolNombre}/modulo/${moduloId}`);
      
      // Recargar permisos
      const response = await api.get(`/admin/roles/${rolNombre}/permisos`);
      if (response.data?.success && response.data?.data?.modulos) {
        setModulosPermisos(response.data.data.modulos);
      }
    } catch (err) {
      console.error('Error removiendo módulo:', err);
    } finally {
      setSavingPermisos(false);
    }
  };

  // Guardar cambios de targets individuales (PUT)
  const guardarCambiosPermisos = async () => {
    try {
      setSavingPermisos(true);
      const rolNombre = rolesPermisos[selectedRoleIndex].rol;
      
      // Recolectar todos los IDs de targets activos
      const menuItemIdsActivos = modulosPermisos
        .flatMap(m => m.targets)
        .filter(t => t.activo)
        .map(t => t.id);
      
      await api.put(`/admin/roles/${rolNombre}/permisos`, {
        menuItemIdsActivos
      });
      
      console.log('✅ Permisos guardados:', menuItemIdsActivos);
    } catch (err) {
      console.error('Error guardando permisos:', err);
    } finally {
      setSavingPermisos(false);
    }
  };

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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Roles y Permisos</h1>
        <p className="text-sm text-gray-600">Matriz de control de acceso del sistema (RFZZ6)</p>
      </div>

      {/* Estado de carga o error */}
      {loading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span>Cargando roles desde la API...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          ⚠️ {error}
        </div>
      )}

      {!loading && rolesPermisos.length === 0 && !error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          ⚠️ No se encontraron roles disponibles
        </div>
      )}

      {/* Estadísticas de roles - SCROLL HORIZONTAL */}
      {!loading && rolesPermisos.length > 0 && (
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
                <div className={`text-2xl font-bold ${color.text} mb-1`}>{rol.totalPermisos}</div>
                <div className="text-xs text-gray-600 font-medium">{rol.nombre}</div>
                <div className="text-xs text-gray-500 mt-1">permisos</div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Matriz de Permisos por Rol */}
      {!loading && rolesPermisos.length > 0 && (
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

        {/* Filtro por Módulos */}
        {!loadingPermisos && modulosPermisos.length > 0 && (
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Filtrar por módulo:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {modulosUnicos.map((mod) => (
              <button
                key={mod}
                onClick={() => setSelectedModulo(mod)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedModulo === mod
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {mod}
              </button>
            ))}
          </div>
        </div>
        )}

        {/* Permisos del rol seleccionado */}
        <div className="p-6">
          {loadingPermisos && (
            <div className="flex items-center justify-center py-8">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2" />
              <span className="text-sm text-gray-600">Cargando permisos del rol...</span>
            </div>
          )}

          {!loadingPermisos && modulosPermisos.length === 0 && (
            <div className="py-8 text-center text-gray-600">
              No hay módulos disponibles para este rol
            </div>
          )}

          {!loadingPermisos && modulosFiltrados.length > 0 && (
            <div className="space-y-6">
              {modulosFiltrados.map((modulo) => (
                <div key={modulo.id} className="border-l-4 pl-4" style={{ borderColor: modulo.color }}>
                  {/* Encabezado del Módulo */}
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: modulo.color }}
                    >
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">{modulo.nombre}</h4>
                      <p className="text-xs text-gray-600">{modulo.descripcion}</p>
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {modulo.targets.filter(t => t.activo).length}/{modulo.targets.length}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => asignarModuloCompleto(modulo.id)}
                        disabled={savingPermisos}
                        className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 rounded disabled:opacity-50"
                      >
                        Activar
                      </button>
                      <button
                        onClick={() => removerModuloCompleto(modulo.id)}
                        disabled={savingPermisos}
                        className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 rounded disabled:opacity-50"
                      >
                        Desactivar
                      </button>
                    </div>
                  </div>

                  {/* Targets del Módulo */}
                  <div className="space-y-2 ml-13">
                    {modulo.targets.map((target) => (
                      <div
                        key={target.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                          target.activo
                            ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={target.activo}
                          onChange={() => toggleTarget(modulosPermisos.indexOf(modulo), modulo.targets.indexOf(target))}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">{target.nombre}</div>
                          <div className="text-xs text-gray-600 mt-1">{target.descripcion}</div>
                          
                          {/* APIs del Target */}
                          {target.apis.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {target.apis.map((apiItem) => {
                                const apiMethods = [apiItem.puedeGet, apiItem.puedePost, apiItem.puedePut, apiItem.puedeDelete].filter(Boolean).length;
                                return (
                                  <div key={apiItem.id} className="text-xs bg-white rounded px-2 py-1 border border-gray-200">
                                    <div className="font-mono text-blue-600">{apiItem.apiBase}</div>
                                    <div className="text-gray-600">{apiItem.descripcion}</div>
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                      {apiItem.puedeGet && <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-bold">GET</span>}
                                      {apiItem.puedePost && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs font-bold">POST</span>}
                                      {apiItem.puedePut && <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded text-xs font-bold">PUT</span>}
                                      {apiItem.puedeDelete && <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-xs font-bold">DELETE</span>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loadingPermisos && modulosFiltrados.length === 0 && modulosPermisos.length > 0 && (
            <div className="py-8 text-center text-gray-600">
              No hay módulos que coincidan con el filtro
            </div>
          )}
        </div>
      </div>
      )}

      {/* Botones de acción */}
      {!loading && rolesPermisos.length > 0 && !loadingPermisos && (
      <div className="mt-6 flex justify-end gap-3">
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button 
          onClick={guardarCambiosPermisos}
          disabled={savingPermisos}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {savingPermisos ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar Cambios'
          )}
        </button>
      </div>
      )}

      {/* Leyenda */}
      {!loading && rolesPermisos.length > 0 && (
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Información:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Los cambios en permisos afectan inmediatamente a todos los usuarios con ese rol</li>
          <li>• El botón "API" muestra los métodos HTTP permitidos (GET, POST, PUT, DELETE)</li>
          <li>• El rol ADMIN tiene todos los permisos por defecto</li>
        </ul>
      </div>
      )}
    </div>
  );
}
