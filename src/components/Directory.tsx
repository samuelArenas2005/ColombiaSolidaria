import React from 'react';
import { Business } from '../data/businesses';
import BusinessCard from './BusinessCard';

interface DirectoryProps {
  businesses: Business[];
  onSelectBusiness: (b: Business) => void;
}

export default function Directory({ businesses, onSelectBusiness }: DirectoryProps) {
  if (businesses.length === 0) {
    return (
      <div className="py-20 text-center bg-stone-50 rounded-3xl border border-stone-200">
        <p className="text-xl text-stone-500 font-medium">No se encontraron negocios con esos filtros.</p>
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
