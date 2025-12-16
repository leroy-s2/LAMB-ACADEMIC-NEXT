'use client';

import { Building, Save, Globe, Loader } from 'lucide-react';
import { Universidad } from '../../services/universidadService';
import { LogoUploader } from './LogoUploader';

interface DatosIdentidadProps {
    config: Universidad;
    uploading: boolean;
    saving: boolean;
    hasChanges: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChange: (field: keyof Universidad, value: any) => void;
    onSave: () => void;
    onReset: () => void;
}

export function DatosIdentidad({
    config,
    uploading,
    saving,
    hasChanges,
    fileInputRef,
    onLogoUpload,
    onChange,
    onSave,
    onReset,
}: DatosIdentidadProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Identidad Institucional</h2>
                            <p className="text-sm text-gray-500">Datos oficiales de la universidad</p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${config.estado === 'ACTIVA'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                        {config.estado}
                    </span>
                </div>
            </div>

            {/* Grid de secciones */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna izquierda */}
                <div className="space-y-6">
                    {/* Logo */}
                    <LogoUploader
                        logoUrl={config.logoUrl}
                        nombre={config.nombre}
                        uploading={uploading}
                        fileInputRef={fileInputRef}
                        onUpload={onLogoUpload}
                    />

                    {/* Nombre y Código */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre de la Universidad *
                            </label>
                            <input
                                type="text"
                                value={config.nombre}
                                onChange={(e) => onChange('nombre', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="Universidad Peruana Unión"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Código Institucional *
                            </label>
                            <input
                                type="text"
                                value={config.codigo}
                                disabled
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
                                placeholder="UPEU-001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                RUC (11 dígitos) *
                            </label>
                            <input
                                type="text"
                                value={config.ruc}
                                disabled
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
                                placeholder="20138069909"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dominio Web *
                            </label>
                            <div className="flex items-center">
                                <span className="px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-600">
                                    <Globe className="w-4 h-4" />
                                </span>
                                <input
                                    type="text"
                                    value={config.dominio}
                                    onChange={(e) => onChange('dominio', e.target.value)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    placeholder="upeu.edu.pe"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna derecha */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sitio Web Completo *
                        </label>
                        <input
                            type="url"
                            value={config.website}
                            onChange={(e) => onChange('website', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="https://upeu.edu.pe"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Universidad
                            </label>
                            <select
                                value={config.tipo}
                                onChange={(e) => onChange('tipo', e.target.value as 'PRIVADA' | 'PUBLICA')}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                                <option value="PRIVADA">Privada</option>
                                <option value="PUBLICA">Pública</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Zona Horaria
                            </label>
                            <select
                                value={config.zonaHoraria}
                                onChange={(e) => onChange('zonaHoraria', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                                <option value="America/Lima">América/Lima (UTC-5)</option>
                                <option value="America/New_York">América/New York (UTC-5/-4)</option>
                                <option value="America/Chicago">América/Chicago (UTC-6/-5)</option>
                                <option value="America/Denver">América/Denver (UTC-7/-6)</option>
                                <option value="America/Los_Angeles">América/Los Angeles (UTC-8/-7)</option>
                                <option value="UTC">UTC</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plan de Licencia
                            </label>
                            <select
                                value={config.plan}
                                onChange={(e) => onChange('plan', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                                <option value="BASIC">🔹 Basic</option>
                                <option value="PROFESSIONAL">🔸 Professional</option>
                                <option value="PREMIUM">⭐ Premium</option>
                                <option value="ENTERPRISE">🏢 Enterprise</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha de Vencimiento del Plan
                            </label>
                            <input
                                type="date"
                                value={config.fechaVencimiento ? config.fechaVencimiento.split('T')[0] : ''}
                                onChange={(e) => onChange('fechaVencimiento', e.target.value ? `${e.target.value}T00:00:00` : null)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Máximo de Estudiantes
                            </label>
                            <input
                                type="number"
                                value={config.maxEstudiantes}
                                onChange={(e) => onChange('maxEstudiantes', parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="10000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Máximo de Docentes
                            </label>
                            <input
                                type="number"
                                value={config.maxDocentes}
                                onChange={(e) => onChange('maxDocentes', parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Idioma/Locale
                        </label>
                        <select
                            value={config.locale}
                            onChange={(e) => onChange('locale', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value="es_PE">Español - Perú</option>
                            <option value="es_ES">Español - España</option>
                            <option value="en_US">English - USA</option>
                            <option value="pt_BR">Português - Brasil</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Footer con botones */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between rounded-b-lg">
                <button
                    onClick={onReset}
                    disabled={!hasChanges || saving}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ↻ Restablecer
                </button>
                <button
                    onClick={onSave}
                    disabled={!hasChanges || saving}
                    className="px-6 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
    );
}
