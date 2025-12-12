import React from 'react';
import { MapPin } from 'lucide-react';

const CampusSection: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Lima Campus */}
            <div className="relative group overflow-hidden h-80">
              <img
                src="https://files.adventistas.org/noticias/es/2016/03/30223025/aniversario1.jpg"
                alt="Sede Lima"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              <div className="absolute top-6 left-6 flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold text-lg">Sede LIMA</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-6xl font-bold opacity-30">UPeU</div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-16 flex overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-red-600 to-transparent opacity-20"></div>
                ))}
              </div>
            </div>

            {/* Tarapoto Campus */}
            <div className="relative group overflow-hidden h-80">
              <img
                src="https://upeu.edu.pe/wp-content/uploads/2023/06/campus-tarapoto.webp"
                alt="Filial Tarapoto"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              <div className="absolute top-6 right-6 flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold text-lg">Filial TARAPOTO</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-6xl font-bold opacity-30">UPeU</div>
              </div>
              <div className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                UNIVERSIDAD PERUANA UNIÓN
              </div>
            </div>

            {/* Juliaca Campus */}
            <div className="relative group overflow-hidden h-80 md:col-span-2">
              <img
                src="https://upeu.edu.pe/wp-content/uploads/2022/04/campus-juliaca.jpeg"
                alt="Filial Juliaca"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              <div className="absolute top-6 right-6 flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold text-lg">Filial JULIACA</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-6xl font-bold opacity-30">UPeU</div>
              </div>
              <div className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                UNIVERSIDAD PERUANA UNIÓN
              </div>
            </div>
          </div>

          {/* Center Logo Overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl px-12 py-6 rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              UPeU
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampusSection;