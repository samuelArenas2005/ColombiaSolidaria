import React from 'react';
import { Business } from '../data/businesses';
import { HandHeart, ShoppingBag, Eye, Instagram, Facebook, Globe, Link as LinkIcon } from 'lucide-react';

interface BusinessCardProps {
  business: Business;
  onOpen: () => void;
}

export default function BusinessCard({ business, onOpen }: BusinessCardProps) {
  const isDonation = business.needType === 'donation';
  
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-md transition-shadow flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden bg-stone-100">
        {business.image ? (
          <img 
            src={business.image} 
            alt={business.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?auto=format&fit=crop&w=600&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400">
            Sin imagen
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
            isDonation 
              ? 'bg-rose-500/90 text-white' 
              : 'bg-emerald-500/90 text-white'
          }`}>
            {isDonation ? <HandHeart className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            {isDonation ? 'SOLO DONACIONES' : 'VENTA ACTIVA'}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-stone-800 text-xs font-bold px-2.5 py-1 rounded-lg">
            {business.category || 'Categoría'}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-1.5 leading-tight">
          {business.name || 'Nombre del Negocio'}
        </h3>
        
        {business.socials && Object.keys(business.socials).length > 0 && (
          <div className="flex items-center gap-3 mb-3">
            {business.socials.instagram && <Instagram className="w-4 h-4 text-stone-400" />}
            {business.socials.facebook && <Facebook className="w-4 h-4 text-stone-400" />}
            {business.socials.tiktok && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>}
            {business.socials.website && <Globe className="w-4 h-4 text-stone-400" />}
          </div>
        )}

        <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
          {business.description || 'Descripción corta del negocio.'}
        </p>
        
        <button 
          onClick={onOpen}
          className="w-full flex items-center justify-center gap-2 bg-stone-100 text-stone-800 font-bold py-3 rounded-xl hover:bg-stone-200 transition-colors"
        >
          <Eye className="w-4 h-4" />
          VER DETALLES
        </button>
      </div>
    </div>
  );
}
