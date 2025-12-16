'use client';

import { useState } from 'react';
import { X, Mail, Phone, MapPin, Calendar, Shield, Lock, LogOut, Key, Zap } from 'lucide-react';
import { UniversalProfile } from '@/shared/types/profile.types';
import { useRouter } from 'next/navigation';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UniversalProfile;
}

export function ProfileModal({ isOpen, onClose, profile }: ProfileModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'general' | 'academic' | 'security' | 'institutional'>('general');

  if (!isOpen) return null;

  const handleLogout = () => {
    // Logout logic - limpiar solo memoria (Redux)
    // El middleware de Redux se encarga de la limpieza
    window.location.href = '/log';
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      ADMIN: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
      TEACHER: { bg: 'bg-blue-100', text: 'text-blue-800' },
      STUDENT: { bg: 'bg-purple-100', text: 'text-purple-800' },
      STAFF: { bg: 'bg-amber-100', text: 'text-amber-800' },
    };
    return colors[role] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  const roleColor = getRoleColor(profile.roleData.primaryRole);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl min-w-[680px] min-h-[60vh] max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-slate-100 to-blue-50 border-b border-blue-200 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-slate-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {profile.personalData.firstName.charAt(0)}
                {profile.personalData.lastName.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.personalData.firstName} {profile.personalData.lastName}
                </h2>
                <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${roleColor.bg} ${roleColor.text}`}>
                  {profile.roleData.primaryRole}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 min-h-[50vh]">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('general')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'general'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                General
              </button>
              {(profile.studentAcademicData || profile.teacherAcademicData || profile.staffPositionData) && (
                <button
                  onClick={() => setActiveTab('academic')}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'academic'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {profile.studentAcademicData ? 'Académico' : 'Laboral'}
                </button>
              )}
              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Seguridad
              </button>
              {profile.institutionalData && (
                <button
                  onClick={() => setActiveTab('institutional')}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'institutional'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Institucional
                </button>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-sm font-semibold text-gray-600 block mb-2">Email Institucional</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 font-medium">{profile.personalData.email}</span>
                    </div>
                  </div>
                  {profile.personalData.cellphone && (
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-sm font-semibold text-gray-600 block mb-2">Celular</label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 font-medium">{profile.personalData.cellphone}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Personal Data */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Tipo de Documento</label>
                      <p className="text-gray-900 font-medium">{profile.personalData.documentType}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Número</label>
                      <p className="text-gray-900 font-medium">{profile.personalData.documentNumber}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Fecha de Nacimiento</label>
                      <p className="text-gray-900 font-medium">
                        {new Date(profile.personalData.dateOfBirth).toLocaleDateString('es-PE')}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Género</label>
                      <p className="text-gray-900 font-medium capitalize">{profile.personalData.gender}</p>
                    </div>
                    {profile.personalData.address && (
                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Dirección</label>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-900">{profile.personalData.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Roles */}
                {profile.roleData.secondaryRoles && profile.roleData.secondaryRoles.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Roles Secundarios</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.roleData.secondaryRoles.map((role) => {
                        const color = getRoleColor(role);
                        return (
                          <span key={role} className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${color.bg} ${color.text}`}>
                            {role}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Permissions */}
                {profile.roleData.activePermissions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Permisos Activos</h3>
                    <div className="space-y-2">
                      {profile.roleData.activePermissions.map((perm, idx) => (
                        <div key={idx} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-emerald-900">{perm.name}</p>
                              <p className="text-sm text-emerald-700">{perm.description}</p>
                            </div>
                            {perm.expiryDate && (
                              <span className="text-xs font-medium text-emerald-600 whitespace-nowrap ml-2">
                                Vence: {new Date(perm.expiryDate).toLocaleDateString('es-PE')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="space-y-6">
                {profile.studentAcademicData && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Programa</label>
                        <p className="text-gray-900 font-medium">{profile.studentAcademicData.program}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Facultad</label>
                        <p className="text-gray-900 font-medium">{profile.studentAcademicData.faculty}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Año Actual</label>
                        <p className="text-gray-900 font-medium">{profile.studentAcademicData.currentYear}°</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Estado</label>
                        <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg">
                          {profile.studentAcademicData.academicStatus === 'active' && 'Activo'}
                          {profile.studentAcademicData.academicStatus === 'at_risk' && 'En Riesgo'}
                          {profile.studentAcademicData.academicStatus === 'graduated' && 'Egresado'}
                        </span>
                      </div>
                    </div>

                    {/* Academic Performance */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Desempeño Académico</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-indigo-600">
                            {profile.studentAcademicData.cumulativeAverage.toFixed(1)}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">Promedio Acumulado</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">
                            {profile.studentAcademicData.approvedCredits}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">Créditos Aprobados</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-teal-600">
                            {profile.studentAcademicData.totalCredits}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">Total Créditos</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {profile.teacherAcademicData && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Dedicación</label>
                        <p className="text-gray-900 font-medium">
                          {profile.teacherAcademicData.dedication === 'full_time' ? 'Tiempo Completo' : 'Tiempo Parcial'}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Categoría</label>
                        <p className="text-gray-900 font-medium capitalize">{profile.teacherAcademicData.category}</p>
                      </div>
                    </div>

                    {profile.teacherAcademicData.assignedCourses.length > 0 && (
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Cursos Asignados</label>
                        <div className="space-y-2">
                          {profile.teacherAcademicData.assignedCourses.map((course, idx) => (
                            <div key={idx} className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-900">
                              {course}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.teacherAcademicData.orcid && (
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">ORCID</label>
                        <p className="text-gray-900 font-medium">{profile.teacherAcademicData.orcid}</p>
                      </div>
                    )}
                  </>
                )}

                {profile.staffPositionData && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Cargo</label>
                        <p className="text-gray-900 font-medium">{profile.staffPositionData.position}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Dependencia</label>
                        <p className="text-gray-900 font-medium">{profile.staffPositionData.department}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Designación</label>
                        <p className="text-gray-900 font-medium">
                          {new Date(profile.staffPositionData.designationPeriod.startDate).toLocaleDateString('es-PE')} 
                          {profile.staffPositionData.designationPeriod.endDate && 
                            ` - ${new Date(profile.staffPositionData.designationPeriod.endDate).toLocaleDateString('es-PE')}`
                          }
                        </p>
                      </div>
                      {profile.staffPositionData.isTemporary && (
                        <div>
                          <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-lg">
                            Cargo Temporal
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Account Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Estado de la Cuenta</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-lg">
                        {profile.accountData.status === 'active' && 'Activa'}
                        {profile.accountData.status === 'blocked' && 'Bloqueada'}
                        {profile.accountData.status === 'inactive' && 'Inactiva'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Último acceso:</span>
                      <span className="text-gray-900 font-medium">
                        {new Date(profile.accountData.lastAccessDate).toLocaleDateString('es-PE', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">2FA:</span>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                        profile.accountData.twoFactorEnabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {profile.accountData.twoFactorEnabled ? 'Habilitado' : 'Deshabilitado'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Actions */}
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                    <Key className="w-5 h-5" />
                    Cambiar Contraseña
                  </button>
                  {!profile.accountData.twoFactorEnabled && (
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg hover:bg-amber-100 transition-colors font-medium">
                      <Zap className="w-5 h-5" />
                      Activar Autenticación de Dos Factores
                    </button>
                  )}
                </div>

                {/* Recent Access Log */}
                {profile.securityData?.recentAccessLog && profile.securityData.recentAccessLog.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Accesos Recientes</h4>
                    <div className="space-y-2">
                      {profile.securityData.recentAccessLog.slice(0, 5).map((log, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{log.device}</span>
                            <span className="text-xs text-gray-500">{log.ipAddress}</span>
                          </div>
                          <span className="text-gray-600">
                            {new Date(log.timestamp).toLocaleDateString('es-PE', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'institutional' && profile.institutionalData && (
              <div className="space-y-6">
                {profile.institutionalData.employeeNumber && (
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase block mb-1">Número de Empleado</label>
                    <p className="text-gray-900 font-medium">{profile.institutionalData.employeeNumber}</p>
                  </div>
                )}

                {profile.institutionalData.institutionalEmails.length > 1 && (
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Emails Institucionales</label>
                    <div className="space-y-2">
                      {profile.institutionalData.institutionalEmails.map((email, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {profile.institutionalData.notificationPreferences.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">Preferencias de Notificación</label>
                    <div className="space-y-2">
                      {profile.institutionalData.notificationPreferences.map((pref, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-900 font-medium capitalize">{pref.channel}</span>
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded ${
                            pref.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {pref.enabled ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-4 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cerrar
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
