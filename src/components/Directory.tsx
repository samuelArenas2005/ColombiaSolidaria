import React, { useState } from 'react';
import { Business } from '../data/businesses';
import BusinessCard from './BusinessCard';
import { Store, Eye, EyeOff } from 'lucide-react';

interface DirectoryProps {
  businesses: Business[];
  onSelectBusiness: (b: Business) => void;
}

const EXAMPLE_BUSINESS: Business = {
  id: 'example-1',
  name: 'Ejemplo: Panadería La Esperanza',
  category: 'Alimentos',
  needType: 'donation',
  description: 'Perdimos el horno por daños estructurales. Necesitamos fondos para repararlo.',
  fullDescription: 'Nuestra panadería ha estado en el centro de la ciudad por más de 15 años. El sismo agrietó las paredes y destruyó nuestro horno principal, dejando a 5 familias sin su principal fuente de ingreso. Cualquier aporte suma a reconstruir nuestro sueño.',
  location: { lat: 3.2612, lng: -76.5398 },
  image: 'https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?auto=format&fit=crop&w=600&q=80',
  contact: {
    phone: '3001234567',
    nequi: '3001234567',
    nequiName: 'Maria Esperanza Diaz',
    daviplata: '3001234567',
    daviplataName: 'Carlos Arturo Sanchez',
  },
  socials: {
    instagram: '@panlaesperanza',
    facebook: 'https://facebook.com/panlaesperanza',
  },
  products: [
    { id: 'ep1', name: 'Pan Aliñado', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80' },
    { id: 'ep2', name: 'Buñuelos', image: 'https://images.unsplash.com/photo-1579618218206-a831e79cb5f1?auto=format&fit=crop&w=300&q=80' },
  ]
};

export default function Directory({ businesses, onSelectBusiness }: DirectoryProps) {
  const [showExample, setShowExample] = useState(false);

  if (businesses.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center px-4 bg-stone-50 rounded-3xl border border-stone-200">
        <div className="text-center flex flex-col items-center max-w-xl mx-auto">
          <div className="bg-white p-6 rounded-full shadow-sm mb-6 border border-stone-100">
            <Store className="w-12 h-12 text-stone-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Aún no hay iniciativas registradas</h3>
          <p className="text-stone-500 mb-8 max-w-md mx-auto leading-relaxed">
            Sé el primero en registrar un negocio o caso de ayuda. Si quieres apoyar, vuelve pronto mientras nuestra comunidad inscribe nuevas iniciativas.
          </p>
          
          <button 
            onClick={() => setShowExample(!showExample)}
            className="flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors px-5 py-2.5 rounded-full border border-stone-200 hover:border-stone-300 bg-white shadow-sm"
          >
            {showExample ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showExample ? 'Ocultar ejemplo' : 'Ver un ejemplo'}
          </button>
        </div>

        {showExample && (
          <div className="mt-12 w-full max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BusinessCard 
              business={EXAMPLE_BUSINESS} 
              onOpen={() => onSelectBusiness(EXAMPLE_BUSINESS)} 
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <BusinessCard 
          key={business.id} 
          business={business} 
          onOpen={() => onSelectBusiness(business)} 
        />
      ))}
    </div>
  );
}
