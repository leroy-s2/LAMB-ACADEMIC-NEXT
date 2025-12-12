import React from 'react';
import { ChevronRight } from 'lucide-react';

const ExploreSection: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 relative overflow-hidden group">
              <img
                src="https://upeu.edu.pe/wp-content/uploads/2023/10/SAVE_20231014_143826-1080x675.jpg"
                alt="Campus UPeU"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white font-semibold text-lg bg-yellow-400 px-4 py-2 rounded-lg">
                explore
              </div>
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Explore UPeU</h2>
              <p className="text-cyan-600 mb-6">Conoce nuestras instalaciones</p>
              <button className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold group">
                <span>Nueva fecha</span>
                <div className="bg-cyan-600 text-white rounded-full p-1 group-hover:translate-x-1 transition-transform">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;