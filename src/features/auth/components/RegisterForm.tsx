'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Lock, User, Phone, Eye, EyeOff, UserCheck } from 'lucide-react';
import { registerUser } from '../api/authApi';

const countryCodes = [
  { code: '+51', label: 'Perú' },
  { code: '+54', label: 'Argentina' },
  { code: '+52', label: 'México' },
  { code: '+1', label: 'EE.UU./Canadá' },
  { code: '+34', label: 'España' }
];

interface RegisterFormProps {
  onSwitch: () => void;
  backgroundUrl: string;
}

const initialForm = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phone: '',
};

type SnackbarType = 'success' | 'error';

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitch, backgroundUrl }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const [countryCode, setCountryCode] = useState(countryCodes[0].code);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; type: SnackbarType }>({
    open: false,
    message: '',
    type: 'success'
  });

  const phoneRegex = /^\d{7,15}$/;

  const triggerSnackbar = (message: string, type: SnackbarType = 'success') => {
    setSnackbar({ open: true, message, type });
    setTimeout(() => {
      setSnackbar(s => ({ ...s, open: false }));
    }, 3500);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      triggerSnackbar('Las contraseñas no coinciden', 'error');
      return;
    }
    if (formData.password.length < 8) {
      triggerSnackbar('La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }
    if (!phoneRegex.test(formData.phone)) {
      triggerSnackbar('El número de teléfono debe ser válido (solo números, sin espacios)', 'error');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, firstName, lastName, phone, ...rest } = formData;
      await registerUser({ 
        ...rest,
        nombre: firstName,
        apellido: lastName,
        telefono: countryCode + phone,
        codigoPais: countryCode
      });
      triggerSnackbar('Usuario registrado con éxito.', 'success');
      setFormData(initialForm);
      setCountryCode(countryCodes[0].code);
      // Redirige automáticamente al login
      window.location.href = '/log';
    } catch (error: any) {
      triggerSnackbar(error.message || 'Error al registrar usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBack = () => {
    window.location.href = '/';
  };

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay azul, igual que en Login */}
      <div className="absolute inset-0 bg-[#173a6b]/80 pointer-events-none" />

      {/* Snackbar */}
      {snackbar.open && (
        <div
          className={`fixed top-8 right-8 z-50 min-w-[260px] max-w-xs px-6 py-4 rounded-md shadow-lg font-semibold text-base transition-all duration-500
            ${snackbar.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'}
            animate-slideInRight
          `}
          style={{
            animation: 'slideInRight 0.5s, fadeOut 0.5s 3s',
          }}
        >
          {snackbar.message}
        </div>
      )}
      {/* Animaciones para el snackbar */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          to { opacity: 0; }
        }
        .animate-slideInRight {
          animation: slideInRight 0.5s, fadeOut 0.5s 3s;
        }
      `}</style>
      {/* Top nav */}
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
      
      {/* Register Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/25 backdrop-blur-xl rounded-3xl shadow-2xl mx-4 px-10 py-12 border border-white/30">
        <button
          type="button"
          onClick={handleBack}
          className="absolute right-0 top-0 rounded-tr-3xl bg-[#1a3d5c] hover:bg-[#2c5270] w-16 h-16 flex items-center justify-center z-20 transition-colors"
          aria-label="Volver"
        >
          <svg width={32} height={32} viewBox="0 0 36 36" fill="none">
            <path d="M25 18H11" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13L11 18L16 23" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="text-4xl font-bold text-white mb-8 text-center">Crear cuenta</h2>
        <form className="w-full flex flex-col gap-5" autoComplete="off" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="relative">
            <UserCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="pl-13 pr-5 py-4 w-full rounded-full border-2 border-white/50 bg-transparent focus:bg-white/20 focus:border-white text-white placeholder-white/70 font-medium outline-none transition-all text-base"
              placeholder="Nombre de usuario"
              required
            />
          </div>
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="pl-13 pr-5 py-4 w-full rounded-full border-2 border-white/50 bg-transparent focus:bg-white/20 focus:border-white text-white placeholder-white/70 font-medium outline-none transition-all text-base"
              placeholder="Correo electrónico"
              required
            />
          </div>
          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="pl-13 pr-12 py-4 w-full rounded-full border-2 border-white/50 bg-transparent focus:bg-white/20 focus:border-white text-white placeholder-white/70 font-medium outline-none transition-all text-base"
              placeholder="Contraseña"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pl-13 pr-5 py-4 w-full rounded-full border-2 border-white/50 bg-transparent focus:bg-white/20 focus:border-white text-white placeholder-white/70 font-medium outline-none transition-all text-base"
              placeholder="Confirmar contraseña"
              required
            />
          </div>
          {/* Nombres y Apellidos */}
          <div className="flex gap-3">
            <div className="relative w-1/2">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="pl-13 pr-5 py-4 w-full rounded-full border-2 border-white/50 bg-transparent focus:bg-white/20 focus:border-white text-white placeholder-white/70 font-medium outline-none transition-all text-base"
                placeholder="Nombres"
                required
              />
            </div>
            <div className="relative w-1/2">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="pl-13 pr-5 py-4 w-full rounded-full border-2 border-white/50 bg-transparent focus:bg-white/20 focus:border-white text-white placeholder-white/70 font-medium outline-none transition-all text-base"
                placeholder="Apellidos"
                required
              />
            </div>
          </div>
          {/* Teléfono con código de país */}
          <div className="flex gap-3">
            <div className="relative w-[120px]">
              <select
                name="countryCode"
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
                className="px-4 py-4 w-full rounded-full border-2 border-white/50 bg-transparent text-white font-medium outline-none focus:bg-white/20 focus:border-white transition-all text-base appearance-none cursor-pointer"
                required
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code} className="text-black bg-white">
                    {c.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative flex-1">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="pl-13 pr-5 py-4 w-full rounded-full border-2 border-white/50 bg-transparent focus:bg-white/20 focus:border-white text-white placeholder-white/70 font-medium outline-none transition-all text-base"
                placeholder="Número"
                required
                maxLength={15}
              />
            </div>
          </div>
          {/* Crear Cuenta */}
          <button
            type="submit"
            className="w-full py-4 rounded-full bg-[#1a3d5c] hover:bg-[#2c5270] text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>
        <div className="w-full text-center mt-8">
          <span className="text-white/90 text-base">
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              onClick={onSwitch}
              className="font-bold underline text-white hover:text-yellow-300 transition-colors"
            >
              Inicia sesión
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;