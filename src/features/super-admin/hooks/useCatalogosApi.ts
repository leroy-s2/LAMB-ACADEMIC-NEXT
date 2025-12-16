// Custom hook para manejo de API de catálogos
import { useState } from 'react';
import { api } from '@/shared/services/http';
import { ApiRecord, CatalogType, NuevoTipoUnidad, NuevoTipoLocalizacion, NuevoTipoAutoridad } from '../components/catalogos-maestros/types';

type CreatePayload = NuevoTipoUnidad | NuevoTipoLocalizacion | NuevoTipoAutoridad;

interface UseCatalogosApiReturn {
    // Estado de datos
    data: ApiRecord[];
    loading: boolean;
    error: string | null;

    // Estado de creación
    createLoading: boolean;
    createError: string | null;

    // Acciones
    fetchData: (endpoint: string) => Promise<void>;
    createRecord: (endpoint: string, payload: CreatePayload) => Promise<boolean>;
    clearCreateError: () => void;
}

export function useCatalogosApi(): UseCatalogosApiReturn {
    const [data, setData] = useState<ApiRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const fetchData = async (endpoint: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(endpoint);
            const result = response.data;
            if (result.success) {
                setData(result.data);
            } else {
                setError(result.message || 'Error al cargar los datos');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error de conexión al cargar los datos';
            setError(errorMessage);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const createRecord = async (endpoint: string, payload: CreatePayload): Promise<boolean> => {
        setCreateLoading(true);
        setCreateError(null);
        try {
            const response = await api.post(endpoint, payload);
            if (response.data.success) {
                return true;
            } else {
                setCreateError(response.data.message || 'Error al crear el registro');
                return false;
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error de conexión al crear el registro';
            setCreateError(errorMessage);
            console.error('Error creating:', err);
            return false;
        } finally {
            setCreateLoading(false);
        }
    };

    const clearCreateError = () => setCreateError(null);

    return {
        data,
        loading,
        error,
        createLoading,
        createError,
        fetchData,
        createRecord,
        clearCreateError,
    };
}
