'use client';

import { useInitializeAuth } from '@/hooks/useInitializeAuth';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';
import { ReactNode } from 'react';

export function AuthInitializer({ children }: { children: ReactNode }) {
  useInitializeAuth();
  useTokenRefresh();
  return <>{children}</>;
}
