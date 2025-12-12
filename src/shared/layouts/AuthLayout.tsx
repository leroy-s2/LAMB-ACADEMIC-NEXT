'use client';

import React from 'react';
import { useAppSelector } from '@/libs/redux/hooks';

interface AuthLayoutProps {
  children: React.ReactNode;
  backgroundUrl: string;
  showTopNav?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  backgroundUrl, 
  showTopNav = true 
}) => {
  const theme = useAppSelector((state) => state.theme?.current);

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay azul */}
      <div className={`absolute inset-0 pointer-events-none ${theme === 'dark' ? 'bg-black/60' : 'bg-[#173a6b]/80'}`} />

      {/* Top Navigation */}
      {showTopNav && (
        <div className="absolute left-0 top-0 w-full flex justify-between items-center px-12 py-6 z-10">
          <img
            src="https://res.cloudinary.com/df6m46xxz/image/upload/v1759692970/descarga_poy9qy.png"
            alt="LAMB University"
            className="h-10"
          />
          <div className="flex gap-8 text-white font-semibold text-base">
            <a href="#" className="hover:underline">Admisión</a>
            <a href="#" className="hover:underline">Plan académico</a>
            <a href="#" className="hover:underline">Consultas</a>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`relative z-10 w-full max-w-md backdrop-blur-md rounded-2xl shadow-xl mx-4 flex flex-col items-center px-8 py-10 border ${theme === 'dark' ? 'bg-gray-900/70 border-gray-700' : 'bg-white/30 border-white/40'}`}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
