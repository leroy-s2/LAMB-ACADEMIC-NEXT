import React from 'react';
import { Button } from '@/shared/components';

const FooterCTA: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-slate-900 text-center">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-3xl font-bold text-white mb-4">
          Únete a la comunidad UPeU
        </h3>
        <p className="text-slate-300 mb-8">
          Formamos líderes con principios para transformar el mundo
        </p>
        <Button variant="secondary" size="lg">
          Más información
        </Button>
      </div>
    </section>
  );
};

export default FooterCTA;