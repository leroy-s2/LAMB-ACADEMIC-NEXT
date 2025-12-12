'use client';

import { useThemeEffect } from '@/shared/hooks/useThemeEffect';
import { ReactNode } from 'react';

export function ThemeProvider({ children }: { children: ReactNode }) {
  useThemeEffect();
  return <>{children}</>;
}
