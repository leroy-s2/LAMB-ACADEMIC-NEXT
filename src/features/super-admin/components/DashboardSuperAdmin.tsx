'use client';

import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
  Users,
  GraduationCap,
  AlertTriangle,
  Clock,
  Calendar,
  Activity,
} from 'lucide-react';

export function DashboardSuperAdmin() {
  // Mock data
  const licencia = {
    plan: 'ENTERPRISE',
    estado: 'ACTIVA',
    vencimiento: '2025-12-31',
    diasRestantes: 357,
  };

  const recursos = {
    estudiantes: { actual: 4523, maximo: 10000 },
    docentes: { actual: 387, maximo: 1000 },
    programas: { actual: 28 },
  };

  const alertasCriticas = [
    {
      id: 1,
      tipo: 'warning' as const,
      mensaje: 'Backup automático retrasado 2 horas',
      fecha: '2025-12-09 10:30',
    },
    {
      id: 2,
      tipo: 'error' as const,
      mensaje: '3 intentos de acceso fallidos - usuario: admin_ext',
      fecha: '2025-12-09 09:15',
    },
    {
      id: 3,
      tipo: 'info' as const,
      mensaje: 'Actualización del sistema disponible (v2.4.1)',
      fecha: '2025-12-08 18:00',
    },
  ];

  const servicios = [
    {
      nombre: 'Base de Datos Principal',
      estado: 'online' as const,
      latencia: '12ms',
      uptime: '99.9%',
      nota: 'PostgreSQL 14.2',
    },
    {
      nombre: 'Servicio de Archivos',
      estado: 'online' as const,
      latencia: '45ms',
      uptime: '99.7%',
      nota: 'AWS S3',
    },
    {
      nombre: 'API Externa (RENIEC)',
      estado: 'online' as const,
      latencia: '230ms',
      uptime: '98.5%',
      nota: 'Requiere integración externa',
    },
    {
      nombre: 'Sistema de Correos',
      estado: 'warning' as const,
      latencia: '890ms',
      uptime: '95.2%',
      nota: 'SMTP - revisar config',
    },
  ];

  const actividad = [
    {
      accion: 'Creación de nuevo programa académico',
      usuario: 'admin_decano',
      fecha: 'Hace 15 min',
    },
    {
      accion: 'Modificación de estructura organizacional',
      usuario: 'super_admin',
      fecha: 'Hace 1 hora',
    },
    {
      accion: 'Importación masiva de estudiantes',
      usuario: 'admin_ti',
      fecha: 'Hace 2 horas',
    },
    {
      accion: 'Generación de reporte trimestral',
      usuario: 'rector_sistema',
      fecha: 'Hace 3 horas',
    },
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'online':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-8 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard de Salud del Sistema
        </h1>
        <p className="text-gray-600">
          Monitoreo técnico en tiempo real de la instancia universitaria
        </p>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Estado de Licencia */}
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-green-600 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-gray-600 font-medium">
              Estado de Licencia
            </h3>
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-green-600">
                {licencia.plan}
              </span>
              <span className="px-2 py-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded">
                {licencia.estado}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{licencia.diasRestantes} días restantes</span>
            </div>
            <p className="text-xs text-gray-500">
              Vence: {licencia.vencimiento}
            </p>
          </div>
        </div>

        {/* Estudiantes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-gray-600 font-medium">
              Estudiantes Activos
            </h3>
            <GraduationCap className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-semibold text-gray-900">
              {recursos.estudiantes.actual.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>de {recursos.estudiantes.maximo.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${
                    (recursos.estudiantes.actual /
                      recursos.estudiantes.maximo) *
                    100
                  }%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {(
                (recursos.estudiantes.actual / recursos.estudiantes.maximo) *
                100
              ).toFixed(1)}
              % de capacidad
            </p>
          </div>
        </div>

        {/* Docentes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-gray-600 font-medium">
              Docentes Registrados
            </h3>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-semibold text-gray-900">
              {recursos.docentes.actual}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>de {recursos.docentes.maximo}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{
                  width: `${
                    (recursos.docentes.actual / recursos.docentes.maximo) * 100
                  }%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {(
                (recursos.docentes.actual / recursos.docentes.maximo) *
                100
              ).toFixed(1)}
              % de capacidad
            </p>
          </div>
        </div>

        {/* Programas */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-gray-600 font-medium">
              Programas Académicos
            </h3>
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-semibold text-gray-900">
              {recursos.programas.actual}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Todos activos</span>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Capacidad ilimitada en BD
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Alertas Críticas */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Alertas del Sistema
          </h3>
          <div className="space-y-3">
            {alertasCriticas.map((alerta) => (
              <div
                key={alerta.id}
                className={`p-3 rounded-lg border ${
                  alerta.tipo === 'error'
                    ? 'bg-red-50 border-red-200'
                    : alerta.tipo === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alerta.tipo)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {alerta.mensaje}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alerta.fecha}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estado de Servicios */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estado de Servicios
          </h3>
          <div className="space-y-3">
            {servicios.map((servicio, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {servicio.nombre}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{servicio.nota}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Latencia</p>
                    <p className="text-sm font-medium text-gray-900">
                      {servicio.latencia}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getEstadoColor(
                      servicio.estado
                    )}`}
                  >
                    {servicio.uptime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Actividad Reciente del Sistema
        </h3>
        <div className="space-y-3">
          {actividad.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Activity className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {item.accion}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">por</span>
                  <span className="text-xs font-medium text-blue-600">
                    {item.usuario}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{item.fecha}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
