// Profile types for universal use across all roles

export interface PersonalData {
  firstName: string;
  lastName: string;
  documentType: string; // DNI, Pasaporte, etc.
  documentNumber: string;
  dateOfBirth: string; // ISO format
  gender: string; // M, F, O
  phone: string;
  cellphone: string;
  address: string;
  email: string;
  alternativeEmail?: string;
}

export interface AccountData {
  username: string;
  email: string;
  status: 'active' | 'blocked' | 'inactive' | 'password_change_required';
  lastAccessDate: string; // ISO format
  createdAt: string;
  twoFactorEnabled: boolean;
}

export interface StudentAcademicData {
  program: string; // Carrera/Máster/Doctorado
  faculty: string; // Facultad/Escuela
  currentYear: number;
  currentCycle: string;
  academicStatus: 'active' | 'graduated' | 'at_risk' | 'licensed' | 'expelled';
  cumulativeAverage: number;
  approvedCredits: number;
  totalCredits: number;
  creditsPerCycle: number;
}

export interface TeacherAcademicData {
  dedication: 'full_time' | 'partial';
  category: 'principal' | 'associate' | 'auxiliary' | 'instructor';
  assignedCourses: string[];
  orcid?: string;
  externalIdentifiers?: Record<string, string>;
}

export interface StaffPositionData {
  position: string; // Cargo
  department: string; // Dependencia
  hierarchyLevel: number;
  designationPeriod: {
    startDate: string;
    endDate?: string;
  };
  hierarchicalDependency: string;
  isTemporary: boolean;
  canDelegatePermissions: boolean;
  subordinates?: string[]; // IDs de subordinados
}

export interface RoleData {
  primaryRole: string; // STUDENT, TEACHER, ADMIN, etc.
  secondaryRoles?: string[];
  permissions: string[];
  activePermissions: {
    name: string;
    description: string;
    expiryDate?: string;
  }[];
  permissionHistory?: {
    name: string;
    grantedDate: string;
    revokedDate?: string;
  }[];
}

export interface SecurityData {
  twoFactorEnabled: boolean;
  activeSessions: {
    device: string;
    ipAddress: string;
    lastActivity: string;
    location?: string;
  }[];
  recentAccessLog: {
    timestamp: string;
    ipAddress: string;
    device: string;
    action: string;
  }[];
}

export interface InstitutionalData {
  employeeNumber?: string;
  legajoNumber?: string;
  institutionalEmails: string[];
  notificationPreferences: {
    channel: 'email' | 'sms' | 'in_app';
    enabled: boolean;
  }[];
  notes?: string;
}

// Main profile interface - universal for all roles
export interface UniversalProfile {
  id: string;
  avatar?: string;
  personalData: PersonalData;
  accountData: AccountData;
  roleData: RoleData;
  securityData?: SecurityData;
  institutionalData?: InstitutionalData;
  // Conditional data based on role
  studentAcademicData?: StudentAcademicData;
  teacherAcademicData?: TeacherAcademicData;
  staffPositionData?: StaffPositionData;
}
