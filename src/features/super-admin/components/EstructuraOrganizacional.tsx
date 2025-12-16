'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, Loader, Building2, GraduationCap, BookOpen, Users, Eye, X, Check } from 'lucide-react';
import { CreateUnitModal } from '@/features/super-admin/components/CreateUnitModal';
import { RegistroUnidadInline } from '@/features/super-admin/components/RegistroUnidadInline';
import { TipoUnidad } from '@/shared/types/organizational.types';
import {
  getUnidadesOrganizativas,
  deleteUnidadOrganizativa,
  getUnidadesHijas,
  updateUnidadOrganizativa,
  getTiposUnidad,
} from '@/features/super-admin/services/organizationalService';
import { UnidadOrganizativaResponse } from '@/shared/types/organizational.types';

interface ExpandedState {
  [key: number]: boolean;
}

interface ChildrenState {
  [key: number]: UnidadOrganizativaResponse[];
}

interface LoadingChildrenState {
  [key: number]: boolean;
}

interface InlineFormState {
  parentId: number | null;
  nivel: number;
  tipo: TipoUnidad | null;
}

interface EditingState {
  id: number | null;
  nombre: string;
  codigo: string;
  sigla: string;
  descripcion: string;
}

// Configuración de colores por tipo de unidad
const TYPE_CONFIG: Record<string, { bg: string; text: string; border: string }> = {
  'Campus': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  'Facultad': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  'Escuela': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  'Departamento': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
};

const getTypeConfig = (tipoNombre: string) => {
  return TYPE_CONFIG[tipoNombre] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
};

export function EstructuraOrganizacional() {
  // Estado principal - unidades raíz (nivel 0)
  const [rootUnidades, setRootUnidades] = useState<UnidadOrganizativaResponse[]>([]);
  const [children, setChildren] = useState<ChildrenState>({});
  const [loadingChildren, setLoadingChildren] = useState<LoadingChildrenState>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [showSelectTypeModal, setShowSelectTypeModal] = useState(false);
  const [inlineForm, setInlineForm] = useState<InlineFormState>({ parentId: null, nivel: 0, tipo: null });
  const [deleting, setDeleting] = useState<number | null>(null);

  // Estado para edición
  const [editing, setEditing] = useState<EditingState>({ id: null, nombre: '', codigo: '', sigla: '', descripcion: '' });
  const [saving, setSaving] = useState(false);

  // Estado para tooltip de descripción
  const [descriptionTooltip, setDescriptionTooltip] = useState<{ id: number; visible: boolean } | null>(null);

  // Cargar todas las unidades y filtrar las raíz
  const loadRootUnidades = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allUnidades = await getUnidadesOrganizativas();
      // Filtrar solo las unidades raíz (sin padre)
      const raices = allUnidades.filter(u => u.unidadPadreId === null);
      setRootUnidades(raices);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar estructura organizacional';
      setError(message);
      console.error('Error loading root units:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRootUnidades();
  }, [loadRootUnidades]);

  // Cargar hijos de una unidad cuando se expande
  const loadChildren = useCallback(async (parentId: number) => {
    if (children[parentId]) return; // Ya cargados

    setLoadingChildren(prev => ({ ...prev, [parentId]: true }));
    try {
      const hijas = await getUnidadesHijas(parentId);
      setChildren(prev => ({ ...prev, [parentId]: hijas }));
    } catch (err) {
      console.error('Error loading children:', err);
    } finally {
      setLoadingChildren(prev => ({ ...prev, [parentId]: false }));
    }
  }, [children]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    let campus = 0, facultades = 0, escuelas = 0, departamentos = 0;

    const countType = (units: UnidadOrganizativaResponse[]) => {
      units.forEach(u => {
        const tipo = u.tipoUnidadNombre?.toLowerCase() || '';
        if (tipo.includes('campus')) campus++;
        else if (tipo.includes('facultad')) facultades++;
        else if (tipo.includes('escuela')) escuelas++;
        else if (tipo.includes('departamento')) departamentos++;
      });
    };

    // Contar raíces
    countType(rootUnidades);
    // Contar hijos cargados
    Object.values(children).forEach(childList => countType(childList));

    return { campus, facultades, escuelas, departamentos };
  }, [rootUnidades, children]);

  const handleCreateNewUnit = () => {
    setInlineForm({ parentId: null, nivel: 0, tipo: null });
    setShowSelectTypeModal(true);
  };

  const handleCreateSubordinate = (unidadId: number, nivel: number) => {
    setInlineForm({ parentId: unidadId, nivel: nivel + 1, tipo: null });
    setShowSelectTypeModal(true);
    setExpanded(prev => ({ ...prev, [unidadId]: true }));
  };

  const handleSelectType = (tipo: TipoUnidad) => {
    setInlineForm(prev => ({ ...prev, tipo }));
    setShowSelectTypeModal(false);
  };

  const handleRegistroSuccess = () => {
    // Recargar todo para reflejar cambios
    loadRootUnidades();
    // Limpiar caché de hijos para forzar recarga
    if (inlineForm.parentId) {
      setChildren(prev => {
        const newChildren = { ...prev };
        delete newChildren[inlineForm.parentId!];
        return newChildren;
      });
      // Recargar hijos del padre
      loadChildren(inlineForm.parentId);
    }
    setInlineForm({ parentId: null, nivel: 0, tipo: null });
  };

  const handleCancelRegistro = () => {
    setInlineForm({ parentId: null, nivel: 0, tipo: null });
  };

  const handleDelete = async (id: number, parentId: number | null) => {
    if (!confirm('¿Estás seguro que deseas eliminar esta unidad?')) return;

    setDeleting(id);
    try {
      await deleteUnidadOrganizativa(id);

      if (parentId === null) {
        // Es una unidad raíz
        setRootUnidades(prev => prev.filter(u => u.id !== id));
      } else {
        // Es una unidad hija
        setChildren(prev => ({
          ...prev,
          [parentId]: prev[parentId]?.filter(u => u.id !== id) || []
        }));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar unidad';
      alert('Error: ' + message);
    } finally {
      setDeleting(null);
    }
  };

  const toggleExpanded = async (id: number) => {
    const willExpand = !expanded[id];
    setExpanded(prev => ({ ...prev, [id]: willExpand }));

    if (willExpand) {
      await loadChildren(id);
    }
  };

  // Funciones de edición
  const startEditing = (unit: UnidadOrganizativaResponse) => {
    setEditing({
      id: unit.id,
      nombre: unit.nombre,
      codigo: unit.codigo,
      sigla: unit.sigla,
      descripcion: unit.descripcion || ''
    });
  };

  const cancelEditing = () => {
    setEditing({ id: null, nombre: '', codigo: '', sigla: '', descripcion: '' });
  };

  const saveEditing = async () => {
    if (!editing.id) return;

    setSaving(true);
    try {
      await updateUnidadOrganizativa(editing.id, {
        nombre: editing.nombre,
        codigo: editing.codigo,
        sigla: editing.sigla,
        descripcion: editing.descripcion
      });

      // Actualizar localmente
      const updateInList = (list: UnidadOrganizativaResponse[]): UnidadOrganizativaResponse[] =>
        list.map(u => u.id === editing.id
          ? { ...u, nombre: editing.nombre, codigo: editing.codigo, sigla: editing.sigla, descripcion: editing.descripcion }
          : u
        );

      setRootUnidades(updateInList);
      setChildren(prev => {
        const updated: ChildrenState = {};
        Object.entries(prev).forEach(([key, list]) => {
          updated[Number(key)] = updateInList(list);
        });
        return updated;
      });

      cancelEditing();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar';
      alert('Error: ' + message);
    } finally {
      setSaving(false);
    }
  };

  const getIconForType = (tipoNombre: string) => {
    const tipo = tipoNombre?.toLowerCase() || '';
    if (tipo.includes('campus')) return <Building2 className="w-5 h-5 text-orange-600" />;
    if (tipo.includes('facultad')) return <GraduationCap className="w-5 h-5 text-blue-600" />;
    if (tipo.includes('escuela')) return <BookOpen className="w-5 h-5 text-green-600" />;
    if (tipo.includes('departamento')) return <Users className="w-5 h-5 text-purple-600" />;
    return <Building2 className="w-5 h-5 text-gray-600" />;
  };

  // Componente para renderizar cada nodo del árbol
  const UnitRow = ({
    unit,
    level = 0,
    parentId = null as number | null,
  }: {
    unit: UnidadOrganizativaResponse;
    level?: number;
    parentId?: number | null;
  }) => {
    const unitChildren = children[unit.id!] || [];
    const hasChildren = unitChildren.length > 0 || !children[unit.id!]; // Asumimos que puede tener hijos si no hemos cargado
    const isExpanded = expanded[unit.id!];
    const isLoadingChildren = loadingChildren[unit.id!];
    const typeConfig = getTypeConfig(unit.tipoUnidadNombre);
    const isEditing = editing.id === unit.id;
    const showInlineFormHere = inlineForm.tipo && inlineForm.parentId === unit.id;
    const showDescTooltip = descriptionTooltip?.id === unit.id && descriptionTooltip?.visible;

    return (
      <>
        <div
          className="flex items-center gap-3 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors group relative"
          style={{ paddingLeft: `${level * 24 + 16}px` }}
        >
          {/* Expand button */}
          <button
            onClick={() => toggleExpanded(unit.id!)}
            className={`p-1 rounded transition-all hover:bg-gray-200`}
          >
            {isLoadingChildren ? (
              <Loader className="w-4 h-4 text-gray-500 animate-spin" />
            ) : (
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'
                  }`}
              />
            )}
          </button>

          {/* Icon */}
          <div className="flex-shrink-0">
            {getIconForType(unit.tipoUnidadNombre)}
          </div>

          {/* Unit Info - Normal o Editable */}
          {isEditing ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={editing.nombre}
                onChange={e => setEditing(prev => ({ ...prev, nombre: e.target.value }))}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                placeholder="Nombre"
              />
              <input
                type="text"
                value={editing.codigo}
                onChange={e => setEditing(prev => ({ ...prev, codigo: e.target.value }))}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                placeholder="Código"
              />
              <input
                type="text"
                value={editing.sigla}
                onChange={e => setEditing(prev => ({ ...prev, sigla: e.target.value }))}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                placeholder="Sigla"
              />
            </div>
          ) : (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{unit.nombre}</span>
                <span className="text-gray-400 text-sm">{unit.sigla}</span>
              </div>
            </div>
          )}

          {/* Type Badge */}
          <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${typeConfig.bg} ${typeConfig.text}`}>
            {unit.tipoUnidadNombre}
          </span>

          {/* Description tooltip button */}
          {unit.descripcion && !isEditing && (
            <div className="relative">
              <button
                onMouseEnter={() => setDescriptionTooltip({ id: unit.id!, visible: true })}
                onMouseLeave={() => setDescriptionTooltip(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                title="Ver descripción"
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Tooltip */}
              {showDescTooltip && (
                <div className="absolute right-0 top-full mt-1 z-50 w-64 p-3 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg text-sm text-gray-700">
                  <p className="whitespace-pre-wrap">{unit.descripcion}</p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {isEditing ? (
            <div className="flex gap-1">
              <button
                onClick={saveEditing}
                disabled={saving}
                className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors disabled:opacity-50"
              >
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
              <button
                onClick={cancelEditing}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleCreateSubordinate(unit.id!, level)}
                title="Añadir subordinada"
                className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => startEditing(unit)}
                title="Editar"
                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(unit.id!, parentId)}
                disabled={deleting === unit.id}
                title="Eliminar"
                className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
              >
                {deleting === unit.id ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Formulario inline - aparece DEBAJO del padre */}
        {showInlineFormHere && (
          <div style={{ paddingLeft: `${(level + 1) * 24 + 16}px` }} className="border-b border-gray-100">
            <RegistroUnidadInline
              tipoSeleccionado={inlineForm.tipo!}
              nivel={inlineForm.nivel}
              unidadPadreId={inlineForm.parentId || undefined}
              onCancel={handleCancelRegistro}
              onSuccess={handleRegistroSuccess}
            />
          </div>
        )}

        {/* Children */}
        {isExpanded && unitChildren.length > 0 && (
          <>
            {unitChildren.map((child) => (
              <UnitRow key={child.id} unit={child} level={level + 1} parentId={unit.id!} />
            ))}
          </>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando estructura organizacional...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Estructura Organizacional</h1>
            <p className="text-gray-500 mt-1 text-sm">Gestión del árbol jerárquico de unidades (RF20, RF21)</p>
          </div>
          <button
            onClick={handleCreateNewUnit}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nueva Unidad
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Campus</p>
              <p className="text-2xl font-bold text-gray-900">{stats.campus}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Facultades</p>
              <p className="text-2xl font-bold text-gray-900">{stats.facultades}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Escuelas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.escuelas}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Departamentos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.departamentos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Árbol Jerárquico */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Section Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-red-500" />
              <h2 className="font-semibold text-gray-900">Árbol Jerárquico</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">Vista completa de la estructura organizacional de la universidad</p>
          </div>

          {/* Formulario inline para nueva unidad raíz */}
          {inlineForm.tipo && inlineForm.parentId === null && (
            <div className="px-4 py-2 border-b border-gray-200 bg-blue-50">
              <RegistroUnidadInline
                tipoSeleccionado={inlineForm.tipo}
                nivel={inlineForm.nivel}
                unidadPadreId={undefined}
                onCancel={handleCancelRegistro}
                onSuccess={handleRegistroSuccess}
              />
            </div>
          )}

          {/* Tree Content */}
          <div>
            {rootUnidades.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900">No hay unidades organizativas</h3>
                <p className="text-gray-600 mt-2">Crea la primera unidad haciendo clic en &quot;Nueva Unidad&quot;</p>
              </div>
            ) : (
              rootUnidades.map((unit) => (
                <UnitRow key={unit.id} unit={unit} level={0} parentId={null} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal para seleccionar tipo */}
      <CreateUnitModal
        isOpen={showSelectTypeModal}
        onClose={() => {
          setShowSelectTypeModal(false);
          setInlineForm({ parentId: null, nivel: 0, tipo: null });
        }}
        nivel={inlineForm.nivel}
        onSelectType={handleSelectType}
      />
    </div>
  );
}
