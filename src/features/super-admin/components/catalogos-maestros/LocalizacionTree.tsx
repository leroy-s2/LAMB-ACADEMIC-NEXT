'use client';

// Vista en árbol jerárquico para Tipos de Localización
import { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { TipoLocalizacionAPI } from './types';
import { getNivelStyles } from '../../data/catalogosData';

interface LocalizacionTreeProps {
    data: TipoLocalizacionAPI[];
    onAddChild: (parentId: number, parentNivel: number, parentName: string) => void;
    onEdit?: (item: TipoLocalizacionAPI) => void;
    onDelete?: (item: TipoLocalizacionAPI) => void;
}

interface TreeNode extends TipoLocalizacionAPI {
    children: TreeNode[];
}

// Construir árbol desde lista plana
function buildTree(items: TipoLocalizacionAPI[]): TreeNode[] {
    const itemMap = new Map<number, TreeNode>();
    const roots: TreeNode[] = [];

    // Crear nodos con array de hijos vacío
    items.forEach(item => {
        itemMap.set(item.id, { ...item, children: [] });
    });

    // Asignar hijos a padres
    items.forEach(item => {
        const node = itemMap.get(item.id)!;
        if (item.padreId && itemMap.has(item.padreId)) {
            itemMap.get(item.padreId)!.children.push(node);
        } else {
            roots.push(node);
        }
    });

    // Ordenar por nivel y nombre
    const sortNodes = (nodes: TreeNode[]) => {
        nodes.sort((a, b) => a.nivelJerarquia - b.nivelJerarquia || a.nombre.localeCompare(b.nombre));
        nodes.forEach(node => sortNodes(node.children));
    };
    sortNodes(roots);

    return roots;
}

function TreeNodeItem({
    node,
    level = 0,
    onAddChild,
    onEdit,
    onDelete,
}: {
    node: TreeNode;
    level?: number;
    onAddChild: (parentId: number, parentNivel: number, parentName: string) => void;
    onEdit?: (item: TipoLocalizacionAPI) => void;
    onDelete?: (item: TipoLocalizacionAPI) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(level < 2); // Expandir primeros 2 niveles
    const hasChildren = node.children.length > 0;

    return (
        <div className="select-none">
            <div
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                style={{ paddingLeft: `${level * 24 + 8}px` }}
            >
                {/* Botón expandir/colapsar */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${hasChildren ? 'hover:bg-gray-200 text-gray-600' : 'text-transparent'
                        }`}
                    disabled={!hasChildren}
                >
                    {hasChildren ? (
                        isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                    ) : (
                        <span className="w-4 h-4" />
                    )}
                </button>

                {/* Círculo con nivel - más grande y visible */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 flex-shrink-0 shadow-sm ${getNivelStyles(node.nivelJerarquia)}`}>
                    N{node.nivelJerarquia}
                </div>

                {/* Código destacado */}
                <div className="px-2.5 py-1 bg-slate-700 text-white text-xs rounded-md font-mono font-semibold shadow-sm flex-shrink-0">
                    {node.codigo}
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">
                            {node.nombre}
                        </span>
                        {node.permiteAsignacion && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs rounded-full font-medium shadow-sm">
                                ✓ Asignable
                            </span>
                        )}
                        {!node.permiteAsignacion && (
                            <span className="px-2 py-0.5 bg-gray-200 text-gray-500 text-xs rounded-full">
                                No asignable
                            </span>
                        )}
                        {hasChildren && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                                📁 {node.children.length} sub-tipo{node.children.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onAddChild(node.id, node.nivelJerarquia, node.nombre)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Agregar hijo"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onEdit?.(node)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete?.(node)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Hijos */}
            {hasChildren && isExpanded && (
                <div className="border-l-2 border-gray-200 ml-5">
                    {node.children.map(child => (
                        <TreeNodeItem
                            key={child.id}
                            node={child}
                            level={level + 1}
                            onAddChild={onAddChild}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function LocalizacionTree({ data, onAddChild, onEdit, onDelete }: LocalizacionTreeProps) {
    const tree = buildTree(data);

    if (tree.length === 0) {
        return (
            <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No hay tipos de localización</p>
                <p className="text-gray-400 text-xs mt-1">Usa el botón "Nuevo" para crear el primer tipo</p>
            </div>
        );
    }

    return (
        <div className="space-y-1 max-h-[500px] overflow-y-auto">
            {tree.map(node => (
                <TreeNodeItem
                    key={node.id}
                    node={node}
                    onAddChild={onAddChild}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
