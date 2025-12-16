'use client';

import { useState, useEffect, useRef } from 'react';
import { getUniversidadPrincipal, updateUniversidad, uploadUniversidadLogo, Universidad } from '../services/universidadService';

export interface UseUniversidadConfigReturn {
    config: Universidad | null;
    loading: boolean;
    saving: boolean;
    uploading: boolean;
    hasChanges: boolean;
    error: string | null;
    successMessage: string | null;
    imageLoadError: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleChange: (field: keyof Universidad, value: any) => void;
    handleSave: () => Promise<void>;
    handleReset: () => void;
    handleLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    loadUniversidad: () => Promise<void>;
    setError: (error: string | null) => void;
    setSuccessMessage: (message: string | null) => void;
}

export function useUniversidadConfig(): UseUniversidadConfigReturn {
    const [config, setConfig] = useState<Universidad | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [imageLoadError, setImageLoadError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const lastObjectUrlRef = useRef<string | null>(null);
    const logoFileRef = useRef<File | null>(null);
    const originalConfigRef = useRef<Universidad | null>(null);

    // Cargar datos de la universidad
    const loadUniversidad = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔄 Iniciando carga de datos de universidad...');
            const universidad = await getUniversidadPrincipal();
            console.log('✅ Datos de universidad cargados:', universidad);
            setConfig(universidad);
            originalConfigRef.current = JSON.parse(JSON.stringify(universidad));
            setHasChanges(false);
        } catch (err: any) {
            const errorMessage = err.message || 'Error al cargar la configuración de la universidad';
            console.error('❌ Error al cargar universidad:', { message: errorMessage, error: err });
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUniversidad();
    }, []);

    // Limpiar object URLs al desmontar
    useEffect(() => {
        return () => {
            if (lastObjectUrlRef.current?.startsWith('blob:')) {
                try { URL.revokeObjectURL(lastObjectUrlRef.current); } catch (e) { /* ignore */ }
            }
        };
    }, []);

    const handleChange = (field: keyof Universidad, value: any) => {
        if (config) {
            setConfig((prev) => prev ? { ...prev, [field]: value } : null);
            setHasChanges(true);
            setSuccessMessage(null);
        }
    };

    const handleSave = async () => {
        if (!config || !hasChanges) {
            console.warn('⚠️ No hay cambios para guardar o config es nula');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            let finalLogoUrl = config.logoUrl;

            // Si hay un archivo de logo nuevo (blob URL), subirlo a Azure primero
            if (logoFileRef.current && config.logoUrl?.startsWith('blob:')) {
                console.log('📤 Subiendo logo a Azure antes de guardar...');
                try {
                    const uploadResponse = await uploadUniversidadLogo(
                        config.id,
                        logoFileRef.current,
                        logoFileRef.current.name,
                        'imagen'
                    );
                    finalLogoUrl = uploadResponse.logoUrl;
                    console.log('✅ Logo subido a Azure:', finalLogoUrl);
                } catch (err: any) {
                    console.error('❌ Error al subir logo a Azure:', err.message);
                    setError(`Error al subir logo: ${err.message}`);
                    return;
                }
            }

            const payload = {
                codigo: config.codigo,
                ruc: config.ruc,
                nombre: config.nombre,
                tipo: config.tipo,
                plan: config.plan,
                dominio: config.dominio,
                website: config.website,
                logoUrl: finalLogoUrl,
                zonaHoraria: config.zonaHoraria,
                locale: config.locale,
                estado: config.estado,
                fechaVencimiento: config.fechaVencimiento,
                maxEstudiantes: config.maxEstudiantes,
                maxDocentes: config.maxDocentes,
            };

            console.log('💾 Guardando configuración de universidad:', { id: config.id, payload });
            const updatedUniversidad = await updateUniversidad(config.id, payload);
            console.log('✅ Universidad actualizada correctamente:', updatedUniversidad);

            setConfig(updatedUniversidad);
            originalConfigRef.current = JSON.parse(JSON.stringify(updatedUniversidad));
            logoFileRef.current = null;
            setHasChanges(false);
            setSuccessMessage('✓ Configuración guardada correctamente');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            const errorMessage = err.message || 'Error al guardar la configuración';
            console.error('❌ Error al guardar:', { message: errorMessage, error: err });
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !config) return;

        try {
            setUploading(true);
            setError(null);

            console.log('📤 Archivo seleccionado para logo:', { name: file.name, size: file.size, type: file.type });

            const localUrl = URL.createObjectURL(file);

            if (lastObjectUrlRef.current?.startsWith('blob:')) {
                try { URL.revokeObjectURL(lastObjectUrlRef.current); } catch (e) { /* ignore */ }
            }
            lastObjectUrlRef.current = localUrl;
            logoFileRef.current = file;

            setConfig((prev) => prev ? { ...prev, logoUrl: localUrl } : null);
            setImageLoadError(false);
            setHasChanges(true);
            setSuccessMessage('Logo seleccionado. Haz clic en "Guardar Cambios" para aplicar.');
        } catch (err: any) {
            console.error('❌ Error al seleccionar logo:', err);
            setError(`Error al seleccionar logo: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleReset = () => {
        if (originalConfigRef.current) {
            setConfig(JSON.parse(JSON.stringify(originalConfigRef.current)));
            setHasChanges(false);
        }
    };

    return {
        config,
        loading,
        saving,
        uploading,
        hasChanges,
        error,
        successMessage,
        imageLoadError,
        fileInputRef,
        handleChange,
        handleSave,
        handleReset,
        handleLogoUpload,
        loadUniversidad,
        setError,
        setSuccessMessage,
    };
}
