import React from 'react';
import { Search, Menu } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm z-50 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src="https://res.cloudinary.com/df6m46xxz/image/upload/v1759970308/Captura_de_pantalla_2025-10-08_184715-removebg-preview_tkekck.png"
                  alt="Logo"
                  className="object-cover w-8 h-8"
                />
              </div>
              <span className="text-slate-900 font-bold text-xl">UPeU</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white hover:text-cyan-400 transition-colors">Admisión</a>
            <a href="#" className="text-white hover:text-cyan-400 transition-colors">Plan académico</a>
            <a href="#" className="text-white hover:text-cyan-400 transition-colors">Consultas</a>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="text-white hover:text-cyan-400 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-white hover:text-cyan-400 transition-colors md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;