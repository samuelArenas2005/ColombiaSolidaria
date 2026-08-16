import React from 'react';
import { Heart, HeartHandshake, MapPin, Search, Plus } from 'lucide-react';

export default function OrganizationsSection() {
  return (
    <section id="familias" className="bg-stone-50 text-gray-900 py-20 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <HeartHandshake className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ayuda a Familias Afectadas</h2>
          <p className="text-stone-600 text-lg">
            Para garantizar que la ayuda de emergencia (refugio, alimentos, reubicación) llegue de forma segura y sin riesgo de fraude, hemos centralizado las donaciones a hogares a través de organizaciones oficiales y verificadas en terreno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Org 1 */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900">
              <Plus className="w-5 h-5 text-rose-500" />
              Cruz Roja Colombiana
            </h3>
            <p className="text-stone-600 text-sm mb-6 flex-grow">
              Coordinación de rescate, atención médica de emergencia y distribución de kits de supervivencia para familias damnificadas.
            </p>
            <a 
              href="https://www.cruzrojacolombiana.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex justify-center items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold py-3 rounded-xl transition-colors"
            >
              <Heart className="w-4 h-4" />
              DONAR AHORA
            </a>
          </div>

          {/* Org 2 */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Puntos Críticos y Ayuda
            </h3>
            <p className="text-stone-600 text-sm mb-6 flex-grow">
              Encuentra información sobre centros de acopio, rutas cerradas y líneas de telefonía de ayuda psicológica o jurídica.
            </p>
            <a 
              href="https://terremoto-cali-puntos-criticos.netlify.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm"
            >
              <MapPin className="w-4 h-4" />
              VER MAPA Y CONTACTOS
            </a>
          </div>

          {/* Org 3 */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900">
              <Search className="w-5 h-5 text-blue-600" />
              Haciendo Comunidad
            </h3>
            <p className="text-stone-600 text-sm mb-6 flex-grow">
              Información sobre las diferentes zonas de la ciudad que aún requieren ayuda voluntaria para remover escombros y limpieza.
            </p>
            <a 
              href="https://personnofound.github.io/HaciendoComunidad/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm"
            >
              <Search className="w-4 h-4" />
              VER ZONAS AFECTADAS
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
