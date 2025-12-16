'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLogin } from '../hooks';
import { useRouter } from 'next/navigation';

type SnackbarType = 'success' | 'error';

// Sin fondo por defecto - se carga desde la API
const DEFAULT_BACKGROUND = '';

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, loading } = useLogin();
  const [backgroundUrl, setBackgroundUrl] = useState(DEFAULT_BACKGROUND);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; type: SnackbarType }>(
    { open: false, message: '', type: 'success' }
  );
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const router = useRouter();

  // Cargar URL de fondo desde la API pública
  useEffect(() => {
    const loadBackgroundConfig = async () => {
      try {
        const response = await fetch('/api/v1/public/universidad/configuracion/elemento/log_url');
        const data = await response.json();

        if (data.success && data.data?.url) {
          setBackgroundUrl(data.data.url);
          console.log('✅ Fondo del login cargado:', data.data.url);
        }
      } catch (error) {
        console.log('ℹ️ Usando fondo por defecto para login');
      }
    };

    loadBackgroundConfig();
  }, []);

  const triggerSnackbar = (message: string, type: SnackbarType = 'success') => {
    setSnackbar({ open: true, message, type });
    setTimeout(() => setSnackbar(s => ({ ...s, open: false })), 3500);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await login(
      { username: formData.email, password: formData.password },
      () => {
        triggerSnackbar('¡Inicio de sesión exitoso!', 'success');
        setShowLoadingOverlay(true);
        router.push('/portal');
      },
      (error: string) => {
        triggerSnackbar(error, 'error');
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBack = () => { window.location.href = '/'; };

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Loading Overlay */}
      {showLoadingOverlay && (
        <div className="fixed inset-0 bg-[#0d1740] z-[100] flex flex-col items-center justify-center">
          <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-white text-xl font-semibold mt-6 animate-pulse">Cargando...</p>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div
          className={`fixed top-8 right-8 z-50 min-w-[260px] max-w-xs px-6 py-4 rounded-md shadow-lg font-semibold text-base transition-all duration-500
            ${snackbar.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'}
            animate-slideInRight`}
          style={{ animation: 'slideInRight 0.5s, fadeOut 0.5s 3s' }}
        >
          {snackbar.message}
        </div>
      )}

      <style>{`
        @keyframes slideInRight { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeOut { to { opacity: 0; } }
        .animate-slideInRight { animation: slideInRight 0.5s, fadeOut 0.5s 3s; }
      `}</style>

      <div className="absolute inset-0 bg-[#173a6b]/80 pointer-events-none" />

      {/* Top Navigation */}
      <div className="absolute left-0 top-0 w-full z-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <Image
              src="https://res.cloudinary.com/df6m46xxz/image/upload/v1759692970/descarga_poy9qy.png"
              alt="LAMB University"
              width={100}
              height={35}
              className="h-10 w-auto"
            />
            <div className="hidden md:flex gap-8 text-white font-medium text-base">
              <a href="#" className="hover:text-yellow-300 transition-colors">Admisión</a>
              <a href="#" className="hover:text-yellow-300 transition-colors">Plan académico</a>
              <a href="#" className="hover:text-yellow-300 transition-colors">Consultas</a>
            </div>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/25 backdrop-blur-xl rounded-3xl shadow-2xl mx-4 px-10 py-12 border border-white/30">
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="absolute right-0 top-0 bg-[#1a3d5c] hover:bg-[#2c5270] w-16 h-16 flex items-center justify-center rounded-tr-3xl transition-colors"
          aria-label="Volver"
        >
          <svg width={32} height={32} viewBox="0 0 36 36" fill="none">
            <path d="M25 18H11" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 13L11 18L16 23" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h2 className="text-4xl font-bold text-white mb-10 text-center">Iniciar sesión</h2>

        <form className="w-full flex flex-col gap-6" autoComplete="off">
          {/* Email Input */}
          <input
            type="email"
            name="email"
            value={formData.email}
            autoComplete="username"
            onChange={handleChange}
            className="px-6 py-4 rounded-full border-2 border-white/50 bg-transparent focus:bg-white/20 focus:border-white text-white placeholder-white/70 font-medium outline-none transition-all text-base"
            placeholder="Correo electrónico"
          />

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              autoComplete="current-password"
              onChange={handleChange}
              className="px-6 py-4 rounded-full border-2 border-white/50 bg-transparent focus:bg-white/20 focus:border-white text-white placeholder-white/70 font-medium outline-none transition-all w-full text-base"
              placeholder="Contraseña"
            />
            <button
              type="button"
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              tabIndex={-1}
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? (
                <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeWidth="2" d="M2 12C2 12 5.636 5 12 5s10 7 10 7-3.636 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
              ) : (
                <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeWidth="2" d="M17.94 17.94C16.13 19.05 14.16 19.66 12 19.66c-6.364 0-10-7.66-10-7.66s1.615-3.032 4.06-5.06M7.06 7.06C8.87 5.95 10.84 5.34 13 5.34c6.364 0 10 7.66 10 7.66s-1.615 3.032-4.06 5.06M1 1l22 22" />
                </svg>
              )}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-center w-full -mt-2">
            <button
              type="button"
              className="text-white/80 hover:text-white hover:underline text-sm font-medium transition-all"
              onClick={() => alert('Funcionalidad de recuperación de contraseña')}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-4 rounded-full bg-[#1a3d5c] hover:bg-[#2c5270] text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Log in'}
          </button>

          {/* Microsoft Button */}
          <button
            type="button"
            className="w-full py-4 rounded-full bg-[#4a6cf7] hover:bg-[#3b57d8] text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95"
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <rect fill="#f25022" x="1" y="1" width="10" height="10" />
              <rect fill="#7fba00" x="13" y="1" width="10" height="10" />
              <rect fill="#00a4ef" x="1" y="13" width="10" height="10" />
              <rect fill="#ffb900" x="13" y="13" width="10" height="10" />
            </svg>
            Iniciar sesión con Microsoft
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
