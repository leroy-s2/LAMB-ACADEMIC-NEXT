'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Menu, ArrowRight, MapPin } from 'lucide-react';

export default function UPeULanding() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1a3d5c] font-sans text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#2c5270]/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-white rounded-full px-5 py-2 shadow-lg flex items-center gap-2">
                <Image
                  src="https://res.cloudinary.com/df6m46xxz/image/upload/v1759692970/descarga_poy9qy.png"
                  alt="UPeU Logo"
                  width={100}
                  height={35}
                  className="h-8 w-auto object-contain"
                  priority
                />
              </div>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-10 text-base font-medium text-white">
              <a href="#" className="hover:text-yellow-300 transition-colors">Admisión</a>
              <a href="#" className="hover:text-yellow-300 transition-colors">Plan académico</a>
              <a href="#" className="hover:text-yellow-300 transition-colors">Consultas</a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="hover:bg-white/10 p-2.5 rounded-full transition-colors">
                <Search className="w-5 h-5 text-white" />
              </button>
              <button className="hover:bg-white/10 p-2.5 rounded-full transition-colors">
                <Menu className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://img.freepik.com/premium-photo/global-network-connection-world-map-point-line-composition-concept-global-business_11304-1628.jpg"
            alt="Background"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a3d5c]/95 via-[#1a3d5c]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a3d5c]/50 via-transparent to-[#1a3d5c]" />
        </div>

        <div className="relative z-20 container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="relative">
              {/* Giant Background Text */}
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none whitespace-nowrap">
                <h1 className="text-[clamp(5rem,15vw,12rem)] font-black leading-none tracking-tighter">
                  DEL MUNDO
                </h1>
              </div>

              <div className="relative z-10 space-y-6">
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    Se parte de este cambio
                  </h2>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-200">
                    Lideres con principios
                  </p>
                  <p className="text-3xl md:text-4xl lg:text-5xl font-black tracking-wider">
                    UPEU
                  </p>
                </div>

                {/* Subtitle with accent bar */}
                <div className="flex items-start gap-4 mt-8">
                  <div className="w-1 h-20 bg-yellow-400 rounded-full flex-shrink-0"></div>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-lg">
                    <span className="font-semibold">SOSTENIBLE</span> - Formando profesionales íntegros y comprometidos
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content - Button */}
            <div className="flex justify-center lg:justify-end">
              <button
                onClick={() => router.push('/log')}
                className="group relative bg-yellow-400 hover:bg-yellow-300 text-[#1a3d5c] font-bold py-5 px-12 rounded-full text-xl transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">Iniciar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Section (Floating Card) */}
      <div className="relative z-30 -mt-20 container mx-auto px-6 lg:px-12 mb-20">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-stretch">
            {/* Image Section */}
            <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden group">
              <Image
                src="https://upeu.edu.pe/wp-content/uploads/2024/03/C-Lima.jpg"
                alt="Campus"
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute bottom-6 left-6">
                <span className="bg-yellow-400 text-[#1a3d5c] text-sm font-bold px-4 py-2 rounded-full shadow-lg inline-block">
                  explore <span className="font-black">UPeU</span>
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-[#1a3d5c] mb-3">Explore UPeU</h3>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  Conoce nuestras instalaciones
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-6">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs uppercase tracking-wide font-semibold mb-1">Nueva fecha</span>
                  <span className="text-[#1a3d5c] font-bold text-lg">→</span>
                </div>
                <button className="bg-[#1a3d5c] hover:bg-[#2c5270] text-white p-3.5 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-110">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Locations Section */}
      <section className="relative pb-16 pt-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="relative rounded-3xl overflow-hidden h-[500px] md:h-[600px] shadow-2xl">
            <Image
              src="https://upeu.edu.pe/wp-content/uploads/2022/04/DJI_0196-scaled.jpg"
              alt="Locations"
              fill
              className="object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a3d5c]/90 via-[#1a3d5c]/60 to-transparent" />

            {/* Giant UPeU Text Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <h2 className="text-[clamp(8rem,25vw,20rem)] font-black text-white/5 -rotate-12 whitespace-nowrap select-none">
                UPeU
              </h2>
            </div>

            {/* Location Labels */}
            <div className="absolute top-10 left-6 md:left-12 flex items-center gap-4">
              <div className="bg-white/15 backdrop-blur-md p-3 rounded-full border border-white/30 shadow-lg">
                <MapPin className="w-7 h-7 text-yellow-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-4xl font-bold text-white drop-shadow-2xl">Sede LIMA</span>
                <span className="text-gray-200 text-sm md:text-base">Campus principal</span>
              </div>
            </div>

            <div className="absolute bottom-10 right-6 md:right-12 flex items-center gap-4">
              <div className="flex flex-col text-right">
                <span className="text-xl md:text-3xl font-bold text-white drop-shadow-2xl">Filial TARAPOTO</span>
                <span className="text-gray-200 text-sm md:text-base">Región Selva</span>
              </div>
              <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-full border border-white/30 shadow-lg">
                <MapPin className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}