'use client';

import React from 'react';
import { useAppSelector } from '@/libs/redux/hooks';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const theme = useAppSelector((state) => state.theme?.current);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {children}
    </div>
  );
};

export default PublicLayout;
