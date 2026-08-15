import React from 'react';
import { Heart, HeartHandshake, MapPin, PhoneCall } from 'lucide-react';

export default function OrganizationsSection() {
  return (
    <section id="familias" className="bg-stone-50 text-gray-900 py-20 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <HeartHandshake className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ayuda a Familias Afectadas</h2>
          <p className="text-stone-600 text-lg">
            Para garantizar que la ayuda de emergencia (refugio, alimentos, reubicación) llegue de forma segura y sin riesgo de fraude, hemos centralizado las donaciones a hogares a través de organizaciones oficiales y verificadas en terreno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Org 1 */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              Cruz Roja Colombiana
            </h3>
            <p className="text-stone-600 text-sm mb-6 flex-grow">
              Coordinación de rescate, atención médica de emergencia y distribución de kits de supervivencia para familias damnificadas.
            </p>
            <a 
              href="https://www.cruzrojacolombiana.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex justify-center items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold py-3 rounded-xl transition-colors"
            >
              <Heart className="w-4 h-4" />
              DONAR AHORA
            </a>
          </div>

          {/* Org 2 */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              Defensa Civil
            </h3>
            <p className="text-stone-600 text-sm mb-6 flex-grow">
              Apoyo logístico en la remoción de escombros y reubicación temporal de familias que perdieron su hogar.
            </p>
            <a 
              href="https://www.defensacivil.gov.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex justify-center items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold py-3 rounded-xl transition-colors"
            >
              <Heart className="w-4 h-4" />
              SITIO OFICIAL
            </a>
          </div>

          {/* Acopio */}
          <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-emerald-900">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Centros de Acopio
            </h3>
            <p className="text-emerald-800 text-sm mb-6 flex-grow">
              Lleva alimentos no perecederos, agua, cobijas y artículos de aseo a los puntos oficiales:
            </p>
            <ul className="space-y-3 mb-6 text-sm text-emerald-700 font-medium">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-500">•</span>
                Sedes de la Cruz Roja (Principales Ciudades)
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-500">•</span>
                Alcaldías Municipales (Zonas Afectadas)
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency Info */}
        <div className="bg-rose-50 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left border border-rose-100">
          <PhoneCall className="w-10 h-10 text-rose-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-lg text-rose-900">Líneas de Emergencia Nacionales</h4>
            <p className="text-rose-700 text-sm mt-1">Línea Única de Emergencias: <strong className="text-rose-900">123</strong> | Cruz Roja: <strong className="text-rose-900">132</strong> | Defensa Civil: <strong className="text-rose-900">144</strong></p>
          </div>
        </div>

      </div>
    </section>
  );
}
