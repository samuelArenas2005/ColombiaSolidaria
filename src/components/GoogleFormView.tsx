import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface GoogleFormViewProps {
  onBack: () => void;
}

export default function GoogleFormView({ onBack }: GoogleFormViewProps) {
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 font-medium text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </button>

        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-stone-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Formulario Oficial de Registro y Solicitud de Ayuda</h1>
            <p className="mt-2 text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Diligencia este formulario oficial para registrar tu iniciativa, negocio o solicitud de apoyo solidario. Nuestro equipo revisará la información para verificarla y publicarla en la plataforma.
            </p>

            {/* Official Google Form Link Button with minimalist white landing design */}
            <div className="mt-6">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeZOYoSLKH1ZGvajW3XX9yPBZDU1gEjzbwB2gDWuDVB5nafRg/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 border-2 border-gray-200 px-6 py-3 rounded-full font-semibold text-sm hover:border-gray-900 hover:bg-gray-50 transition-all cursor-pointer shadow-sm"
              >
                <span>Abrir formulario en pestaña nueva</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Embedded Google Form Container */}
          <div className="w-full flex justify-center bg-stone-50 rounded-2xl p-2 sm:p-4 border border-stone-200 overflow-hidden">
            <iframe 
              src="https://docs.google.com/forms/d/e/1FAIpQLSeZOYoSLKH1ZGvajW3XX9yPBZDU1gEjzbwB2gDWuDVB5nafRg/viewform?embedded=true" 
              width="100%" 
              height="800" 
              frameBorder="0" 
              marginHeight={0} 
              marginWidth={0}
              className="w-full rounded-xl bg-white shadow-inner"
              title="Formulario Google Forms - Registro Solidario"
            >
              Cargando formulario...
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
