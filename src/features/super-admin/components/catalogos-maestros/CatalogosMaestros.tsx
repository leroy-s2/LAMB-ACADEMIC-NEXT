'use client';

// Componente principal de Catálogos Maestros (Refactorizado con SOLID)
import { useState, useEffect } from 'react';
import { Package, Plus, List, Search, Building2, Loader2 } from 'lucide-react';

// Tipos
import { Catalogo, RegistroCatalogo, NuevoTipoUnidad, NuevoTipoLocalizacion, NuevoTipoAutoridad } from './types';

// Datos estáticos
import { catalogosData, registrosData } from '../../data/catalogosData';

// Hook de API
import { useCatalogosApi } from '../../hooks/useCatalogosApi';

// Componentes
import { CreateRecordModal } from './CreateRecordModal';
import { RegistroApiItem } from './RegistroApiItem';
import { LocalizacionTree } from './LocalizacionTree';
import { TipoLocalizacionAPI } from './types';

export function CatalogosMaestros() {
    const [catalogoSeleccionado, setCatalogoSeleccionado] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Estado para crear hijos en jerarquía
    const [createParentId, setCreateParentId] = useState<number | null>(null);
    const [createParentNivel, setCreateParentNivel] = useState<number>(-1);

    const { data: apiData, loading, error, fetchData, createRecord, createLoading, createError, clearCreateError } = useCatalogosApi();

    const catalogos = catalogosData;
    const registros = registrosData;

    // Cargar datos cuando se selecciona un catálogo de API
    useEffect(() => {
        const catalogoActual = catalogos.find((c) => c.id === catalogoSeleccionado);
        if (catalogoActual?.isApiCatalog && catalogoActual.apiEndpoint) {
            fetchData(catalogoActual.apiEndpoint);
        }
    }, [catalogoSeleccionado]);

    const filteredCatalogos = catalogos.filter(
        (c) =>
            c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const catalogoActual = catalogos.find((c) => c.id === catalogoSeleccionado);
    const registrosActuales = catalogoSeleccionado ? registros[catalogoSeleccionado] || [] : [];

    const handleCreateSubmit = async (payload: NuevoTipoUnidad | NuevoTipoLocalizacion | NuevoTipoAutoridad) => {
        if (!catalogoActual) return;

        const postEndpoint = catalogoActual.apiPostEndpoint || catalogoActual.apiEndpoint;
        if (!postEndpoint) return;

        const success = await createRecord(postEndpoint, payload);
        if (success) {
            setShowCreateModal(false);
            setCreateParentId(null);
            setCreateParentNivel(-1);
            // Recargar datos
            if (catalogoActual.apiEndpoint) {
                fetchData(catalogoActual.apiEndpoint);
            }
        }
    };

    // Abrir modal para crear hijo
    const handleAddChild = (parentId: number, parentNivel: number) => {
        setCreateParentId(parentId);
        setCreateParentNivel(parentNivel);
        setShowCreateModal(true);
    };

    // Abrir modal para crear raíz
    const handleAddRoot = () => {
        setCreateParentId(null);
        setCreateParentNivel(-1);
        setShowCreateModal(true);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-7 h-7 text-blue-600" />
                    Catálogos Maestros
                </h1>
                <p className="text-gray-600 mt-1">Gestión de catálogos del sistema académico</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panel izquierdo: Lista de catálogos */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                    {/* Estadísticas */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-2xl font-bold text-blue-700">{catalogos.length}</p>
                            <p className="text-xs text-blue-600">Catálogos</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-2xl font-bold text-green-700">
                                {catalogos.reduce((acc, c) => acc + c.totalRegistros, 0)}
                            </p>
                            <p className="text-xs text-green-600">Registros totales</p>
                        </div>
                    </div>

                    {/* Búsqueda */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar catálogo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Lista de catálogos */}
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {filteredCatalogos.map((catalogo) => (
                            <div
                                key={catalogo.id}
                                onClick={() => setCatalogoSeleccionado(catalogo.id)}
                                className={`p-3 rounded-lg cursor-pointer transition-all ${catalogoSeleccionado === catalogo.id
                                    ? 'bg-blue-50 border-2 border-blue-500'
                                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        {catalogo.isApiCatalog ? (
                                            <Building2 className="w-4 h-4 text-blue-600" />
                                        ) : (
                                            <Package className="w-4 h-4 text-gray-500" />
                                        )}
                                        <span className="font-medium text-gray-900 text-sm">{catalogo.nombre}</span>
                                    </div>
                                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                        {catalogo.isApiCatalog && catalogoSeleccionado === catalogo.id
                                            ? apiData.length
                                            : catalogo.totalRegistros}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-1">{catalogo.descripcion}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-400 font-mono">{catalogo.codigo}</span>
                                    {catalogo.isApiCatalog && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">API</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Panel derecho: Detalle del catálogo */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
                    {catalogoSeleccionado && catalogoActual ? (
                        <>
                            {/* Header del detalle */}
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                                <div className="flex items-center gap-2 mb-2">
                                    {catalogoActual.isApiCatalog && <Building2 className="w-5 h-5 text-blue-600" />}
                                    <h3 className="text-lg font-semibold text-gray-900">{catalogoActual.nombre}</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{catalogoActual.descripcion}</p>

                                {!catalogoActual.isApiCatalog && (
                                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                        <Plus className="w-4 h-4" />
                                        Agregar Registro
                                    </button>
                                )}

                                {catalogoActual.isApiCatalog && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => catalogoActual.apiEndpoint && fetchData(catalogoActual.apiEndpoint)}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <List className="w-4 h-4" />}
                                            Recargar
                                        </button>
                                        <button
                                            onClick={handleAddRoot}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Nuevo
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Contenido */}
                            <div className="p-6">
                                {/* Registros estáticos */}
                                {!catalogoActual.isApiCatalog && registrosActuales.length > 0 && (
                                    <div className="space-y-2">
                                        {registrosActuales.map((registro) => (
                                            <div
                                                key={registro.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-mono">
                                                        {registro.codigo}
                                                    </span>
                                                    <span className="text-sm text-gray-900">{registro.descripcion}</span>
                                                </div>
                                                <span className={`px-2 py-0.5 text-xs rounded ${registro.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {registro.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {!catalogoActual.isApiCatalog && registrosActuales.length === 0 && (
                                    <div className="text-center py-12">
                                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 text-sm">No hay registros en este catálogo</p>
                                    </div>
                                )}

                                {/* Registros de API */}
                                {catalogoActual.isApiCatalog && (
                                    <>
                                        {loading && (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="text-center">
                                                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                                                    <p className="text-gray-500 text-sm">Cargando datos...</p>
                                                </div>
                                            </div>
                                        )}

                                        {error && (
                                            <div className="text-center py-12">
                                                <Package className="w-12 h-12 text-red-300 mx-auto mb-3" />
                                                <p className="text-red-500 text-sm mb-4">{error}</p>
                                                <button
                                                    onClick={() => catalogoActual?.apiEndpoint && fetchData(catalogoActual.apiEndpoint)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm mx-auto"
                                                >
                                                    <List className="w-4 h-4" />
                                                    Reintentar
                                                </button>
                                            </div>
                                        )}

                                        {!loading && !error && apiData.length > 0 && (
                                            catalogoActual.catalogType === 'tipoLocalizacion' ? (
                                                <LocalizacionTree
                                                    data={apiData as TipoLocalizacionAPI[]}
                                                    onAddChild={handleAddChild}
                                                />
                                            ) : (
                                                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                                    {apiData.map((registro) => (
                                                        <RegistroApiItem key={registro.id} registro={registro} />
                                                    ))}
                                                </div>
                                            )
                                        )}

                                        {!loading && !error && apiData.length === 0 && (
                                            <div className="text-center py-12">
                                                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500 text-sm">No hay registros disponibles</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full py-20">
                            <div className="text-center">
                                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Selecciona un catálogo para ver sus registros</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de creación */}
            <CreateRecordModal
                isOpen={showCreateModal}
                catalogType={catalogoActual?.catalogType}
                catalogName={catalogoActual?.nombre || ''}
                loading={createLoading}
                error={createError}
                parentId={createParentId}
                parentNivel={createParentNivel}
                onClose={() => {
                    setShowCreateModal(false);
                    setCreateParentId(null);
                    setCreateParentNivel(-1);
                    clearCreateError();
                }}
                onSubmit={handleCreateSubmit}
            />
        </div>
    );
}
