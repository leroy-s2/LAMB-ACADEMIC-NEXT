import type { BaseEntity } from './api.types';

export interface User extends BaseEntity {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: string;
}

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'STAFF';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';