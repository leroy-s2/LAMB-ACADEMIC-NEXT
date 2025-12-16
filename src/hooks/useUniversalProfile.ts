import { useAppSelector } from '@/libs/redux/hooks';
import { UniversalProfile } from '@/shared/types/profile.types';

/**
 * Hook para obtener el perfil universal del usuario actual
 * Para usar en modales y vistas de perfil universal
 */
export function useUniversalProfile(): UniversalProfile {
  const user = useAppSelector((state: any) => state.user.currentUser);

  // Valores por defecto si no hay usuario
  const firstName = user?.firstName || 'Angel';
  const lastName = user?.lastName || 'Leroy';
  const email = user?.email || 'angel.leroy@upeu.edu.pe';
  const userId = user?.id || '1';
  const userRole = user?.role || 'ADMIN';

  // Este es un mock profile - en producción vendría del backend
  const mockProfile: UniversalProfile = {
    id: userId,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${firstName} ${lastName}`
    )}&background=0066cc&color=fff&size=200`,
    personalData: {
      firstName: firstName,
      lastName: lastName,
      documentType: 'DNI',
      documentNumber: '12345678',
      dateOfBirth: '1990-01-15',
      gender: 'M',
      phone: '01-1234567',
      cellphone: '+51987654321',
      address: 'Av. Principal 123, Lima, Perú',
      email: email,
      alternativeEmail: 'alt@upeu.edu.pe',
    },
    accountData: {
      username: email.split('@')[0] || 'usuario',
      email: email,
      status: 'active',
      lastAccessDate: new Date().toISOString(),
      createdAt: '2024-01-01T00:00:00Z',
      twoFactorEnabled: false,
    },
    roleData: {
      primaryRole: userRole,
      secondaryRoles: ['STAFF'],
      permissions: [
        'users.read',
        'users.write',
        'roles.manage',
        'audit.read',
        'system.config',
      ],
      activePermissions: [
        {
          name: 'Gestión de Usuarios',
          description: 'Crear, editar y eliminar usuarios del sistema',
          expiryDate: '2025-12-31',
        },
        {
          name: 'Gestión de Roles',
          description: 'Configurar permisos y roles',
        },
      ],
    },
    securityData: {
      twoFactorEnabled: false,
      activeSessions: [
        {
          device: 'Chrome en Windows 10',
          ipAddress: '192.168.1.100',
          lastActivity: new Date().toISOString(),
          location: 'Lima, Perú',
        },
      ],
      recentAccessLog: [
        {
          timestamp: new Date().toISOString(),
          ipAddress: '192.168.1.100',
          device: 'Chrome - Windows',
          action: 'Login',
        },
        {
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          ipAddress: '192.168.1.100',
          device: 'Chrome - Windows',
          action: 'View Users',
        },
      ],
    },
    institutionalData: {
      employeeNumber: 'ADM-001',
      institutionalEmails: [
        email,
        'alt@upeu.edu.pe',
      ],
      notificationPreferences: [
        { channel: 'email', enabled: true },
        { channel: 'sms', enabled: false },
        { channel: 'in_app', enabled: true },
      ],
    },
    // Para staff/admin
    staffPositionData: {
      position: 'Administrador de Sistema',
      department: 'Tecnología e Innovación',
      hierarchyLevel: 1,
      designationPeriod: {
        startDate: '2024-01-01',
        endDate: '2025-12-31',
      },
      hierarchicalDependency: 'Dirección General',
      isTemporary: false,
      canDelegatePermissions: true,
      subordinates: ['2', '3', '4'],
    },
  };

  return mockProfile;
}
