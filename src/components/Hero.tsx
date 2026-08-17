import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Store } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="inicio" className="relative bg-stone-50 overflow-hidden">
      {/* Decorative background blob */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="currentColor"></circle>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotPattern)"></rect>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-8 leading-tight">
            RECONSTRUYAMOS JUNTOS: <br/>
            <span className="text-rose-600">Apoya a las Familias y Comunidades</span> Afectadas
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            Miles de colombianos necesitan nuestra solidaridad tras el reciente sismo. Conecta directamente con las personas afectadas para brindar tu apoyo, donar insumos o ayudarles a recuperar su sustento diario. Cada aporte es una semilla de esperanza.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#directorio" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-rose-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Heart className="w-5 h-5" />
              QUIERO AYUDAR
            </a>
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSeZOYoSLKH1ZGvajW3XX9yPBZDU1gEjzbwB2gDWuDVB5nafRg/viewform?usp=header"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-full font-semibold text-lg hover:border-gray-900 hover:bg-gray-50 transition-all cursor-pointer"
            >
              <Store className="w-5 h-5" />
              REGISTRAR TU NEGOCIO
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
