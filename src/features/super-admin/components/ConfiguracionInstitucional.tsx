'use client';

import { Loader } from 'lucide-react';
import { useUniversidadConfig } from '../hooks/useUniversidadConfig';
import { DatosIdentidad, InformacionAuditoria, ParametrosAvanzados } from './institucional';

/**
 * ConfiguracionInstitucional - Componente Orquestador
 * 
 * Este componente coordina las tres secciones principales de configuración:
 * 1. DatosIdentidad - Formulario de identidad institucional
 * 2. InformacionAuditoria - Datos de auditoría y estadísticas
 * 3. ParametrosAvanzados - Fondos del sistema (portal/login)
 */
export function ConfiguracionInstitucional() {
  const {
    config,
    loading,
    saving,
    uploading,
    hasChanges,
    error,
    successMessage,
    fileInputRef,
    handleChange,
    handleSave,
    handleReset,
    handleLogoUpload,
    setError,
    setSuccessMessage,
  } = useUniversidadConfig();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Configuración Institucional</h1>
        <p className="text-sm text-gray-600">Gestión de la identidad y parámetros globales de la universidad</p>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">❌ {error}</p>
        </div>
      )}

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando configuración...</p>
          </div>
        </div>
      ) : config ? (
        <>
          {/* 1. Identidad Institucional */}
          <DatosIdentidad
            config={config}
            uploading={uploading}
            saving={saving}
            hasChanges={hasChanges}
            fileInputRef={fileInputRef}
            onLogoUpload={handleLogoUpload}
            onChange={handleChange}
            onSave={handleSave}
            onReset={handleReset}
          />

          {/* 2. Información de Auditoría */}
          <InformacionAuditoria config={config} />

          {/* 3. Parámetros Avanzados (Fondos) */}
          <ParametrosAvanzados
            onError={setError}
            onSuccess={setSuccessMessage}
          />
        </>
      ) : null}
    </div>
  );
}
