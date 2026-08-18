import React, { useState } from 'react';
import { Business } from '../data/businesses';
import { X, HandHeart, ShoppingBag, Phone, Copy, CheckCircle2, ShieldCheck, ZoomIn, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Instagram, Facebook, Globe, MapPin, Navigation, Store, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const obfuscateName = (name?: string) => {
  if (!name) return '';
  return name.split(' ').map(word => {
    if (word.length <= 1) return word;
    return word.charAt(0) + '*'.repeat(word.length - 1);
  }).join(' ');
};

interface QuickViewModalProps {
  business: Business;
  onClose: () => void;
  onViewOnMap?: (b: Business) => void;
}

export default function QuickViewModal({ business, onClose, onViewOnMap }: QuickViewModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<{ type: 'main' } | { type: 'gallery', index: number } | null>(null);
  const [revealedNames, setRevealedNames] = useState<Record<string, boolean>>({});
  
  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const isDonation = business.needType === 'donation';
  const hasLocation = Boolean(business.location && typeof business.location.lat === 'number');
  const hasMainImage = Boolean(business.image && business.image.trim() !== '');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleNameReveal = (key: string) => {
    setRevealedNames(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getDirectionsUrl = () => {
    if (!business.location) return '#';
    return `https://www.google.com/maps/dir/?api=1&destination=${business.location.lat},${business.location.lng}`;
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-stone-100">
              <h2 className="text-lg font-bold text-gray-900 truncate pr-4">
                VISTA RÁPIDA: {business.name ? business.name.toUpperCase() : 'NEGOCIO'}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-4 sm:p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column: Image & Status */}
                <div className="w-full md:w-1/2 space-y-4">
                  <div 
                    className="relative rounded-2xl overflow-hidden aspect-video md:aspect-square group cursor-pointer bg-stone-100"
                    onClick={() => hasMainImage && setExpandedImage({ type: 'main' })}
                  >
                    {hasMainImage ? (
                      <img 
                        src={business.image} 
                        alt={business.name || 'Negocio'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-6 text-center">
                        <Store className="w-12 h-12 mb-2 text-stone-300" />
                        <span className="text-xs font-semibold text-stone-500">Sin foto principal</span>
                      </div>
                    )}

                    {hasMainImage && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                      </div>
                    )}

                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${
                        isDonation 
                          ? 'bg-rose-500 text-white' 
                          : 'bg-emerald-500 text-white'
                      }`}>
                        {isDonation ? <HandHeart className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                        {isDonation ? 'SOLO DONACIONES' : 'VENTA ACTIVA'}
                      </span>
                    </div>
                  </div>

                  {/* Transparency Link */}
                  <a href="#transparencia" onClick={onClose} className="flex items-start gap-2 bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs text-stone-600 hover:bg-stone-100 transition-colors">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p>ColombiaSolidario no cobra comisiones. Tu ayuda va 100% al emprendedor.</p>
                  </a>
                </div>

                {/* Right Column: Details & Actions */}
                <div className="w-full md:w-1/2 flex flex-col">
                  <span className="text-sm font-bold text-stone-400 tracking-wider uppercase mb-1">
                    {business.category}
                  </span>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
                    {business.name}
                  </h3>

                  {hasLocation && (
                    <div className="mb-4 flex items-center justify-between gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-rose-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-800 truncate">
                            {business.location?.placeName || 'Ubicación registrada'}
                          </p>
                          <p className="text-[11px] text-stone-500 truncate">
                            {business.location?.address || 'Ver en el mapa interactivo'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {onViewOnMap && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onViewOnMap(business);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-all shadow-sm"
                            title="Ver en mapa de la app"
                          >
                            <MapPin className="w-3 h-3 text-rose-500" />
                            <span>Mapa</span>
                          </button>
                        )}
                        
                        <a
                          href={getDirectionsUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm"
                          title="Trazar ruta exacta en Google Maps"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Ruta</span>
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {business.socials && Object.keys(business.socials).length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      {business.socials.instagram && (
                        <a href={business.socials.instagram.startsWith('http') ? business.socials.instagram : `https://instagram.com/${business.socials.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-rose-500 transition-colors bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-md">
                          <Instagram className="w-3.5 h-3.5" />
                          {business.socials.instagram.startsWith('http') ? 'Instagram' : business.socials.instagram}
                        </a>
                      )}
                      {business.socials.facebook && (
                        <a href={business.socials.facebook.startsWith('http') ? business.socials.facebook : `https://facebook.com/${business.socials.facebook.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-blue-600 transition-colors bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-md">
                          <Facebook className="w-3.5 h-3.5" />
                          Facebook
                        </a>
                      )}
                      {business.socials.tiktok && (
                        <a href={business.socials.tiktok.startsWith('http') ? business.socials.tiktok : `https://tiktok.com/${business.socials.tiktok.startsWith('@') ? '' : '@'}${business.socials.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-black transition-colors bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                          {business.socials.tiktok.startsWith('http') ? 'TikTok' : business.socials.tiktok}
                        </a>
                      )}
                      {business.socials.website && (
                        <a href={business.socials.website.startsWith('http') ? business.socials.website : `https://${business.socials.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-emerald-600 transition-colors bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-md">
                          <Globe className="w-3.5 h-3.5" />
                          Sitio Web
                        </a>
                      )}
                    </div>
                  )}

                  <p className="text-stone-600 mb-6 leading-relaxed">
                    {business.fullDescription}
                  </p>

                  {/* Products Gallery */}
                  {business.products && business.products.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-sm font-bold text-gray-900 mb-3">
                        {isDonation ? 'Inventario/Catálogo (Para referencia):' : 'Productos disponibles:'}
                      </h4>
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {business.products.map((p, idx) => {
                          const hasProdImage = Boolean(p.image && p.image.trim() !== '');
                          return (
                            <div 
                              key={p.id || idx} 
                              className="w-20 flex-shrink-0 group cursor-pointer"
                              onClick={() => hasProdImage && setExpandedImage({ type: 'gallery', index: idx })}
                            >
                              <div className="relative w-20 h-20 rounded-xl overflow-hidden mb-1 border border-stone-100 bg-stone-50 flex items-center justify-center">
                                {hasProdImage ? (
                                  <img 
                                    src={p.image} 
                                    alt="Producto" 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                                  />
                                ) : (
                                  <Store className="w-6 h-6 text-stone-300" />
                                )}
                                {hasProdImage && (
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-auto space-y-3">
                    {business.contact.nequi && (
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleCopy(business.contact.nequi!, 'nequi')}
                            className="flex-1 flex items-center justify-between px-4 py-3 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors text-left"
                          >
                            <div className="flex items-center gap-2 font-semibold">
                              <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">Nequi</span>
                              {business.contact.nequi}
                            </div>
                            {copiedKey === 'nequi' ? <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" /> : <Copy className="w-5 h-5 opacity-50 flex-shrink-0" />}
                          </button>
                          {business.contact.nequiName && (
                            <button
                              onClick={() => toggleNameReveal('nequi')}
                              className="px-3 bg-stone-100 border border-stone-200 text-stone-500 hover:bg-stone-200 rounded-xl transition-colors flex items-center justify-center flex-shrink-0"
                              title="Ver nombre del titular"
                            >
                              {revealedNames['nequi'] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                          )}
                        </div>
                        {revealedNames['nequi'] && business.contact.nequiName && (
                          <div className="px-4 py-1 text-xs text-stone-500 flex items-center gap-2">
                            <span>Titular:</span>
                            <span className="font-medium text-stone-700">{obfuscateName(business.contact.nequiName)}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {business.contact.daviplata && (
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleCopy(business.contact.daviplata!, 'daviplata')}
                            className="flex-1 flex items-center justify-between px-4 py-3 bg-orange-50 border border-orange-100 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors text-left"
                          >
                            <div className="flex items-center gap-2 font-semibold">
                              <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">Daviplata</span>
                              {business.contact.daviplata}
                            </div>
                            {copiedKey === 'daviplata' ? <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0" /> : <Copy className="w-5 h-5 opacity-50 flex-shrink-0" />}
                          </button>
                          {business.contact.daviplataName && (
                            <button
                              onClick={() => toggleNameReveal('daviplata')}
                              className="px-3 bg-stone-100 border border-stone-200 text-stone-500 hover:bg-stone-200 rounded-xl transition-colors flex items-center justify-center flex-shrink-0"
                              title="Ver nombre del titular"
                            >
                              {revealedNames['daviplata'] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                          )}
                        </div>
                        {revealedNames['daviplata'] && business.contact.daviplataName && (
                          <div className="px-4 py-1 text-xs text-stone-500 flex items-center gap-2">
                            <span>Titular:</span>
                            <span className="font-medium text-stone-700">{obfuscateName(business.contact.daviplataName)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {business.contact.bancolombia && (
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleCopy(business.contact.bancolombia!, 'bancolombia')}
                            className="flex-1 flex items-center justify-between px-4 py-3 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl hover:bg-amber-100 transition-colors text-left"
                          >
                            <div className="flex items-center gap-2 font-semibold">
                              <span className="bg-amber-400 text-stone-900 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">Bancolombia</span>
                              {business.contact.bancolombia}
                            </div>
                            {copiedKey === 'bancolombia' ? <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" /> : <Copy className="w-5 h-5 opacity-50 flex-shrink-0" />}
                          </button>
                          {business.contact.bancolombiaName && (
                            <button
                              onClick={() => toggleNameReveal('bancolombia')}
                              className="px-3 bg-stone-100 border border-stone-200 text-stone-500 hover:bg-stone-200 rounded-xl transition-colors flex items-center justify-center flex-shrink-0"
                              title="Ver nombre del titular"
                            >
                              {revealedNames['bancolombia'] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                          )}
                        </div>
                        {revealedNames['bancolombia'] && business.contact.bancolombiaName && (
                          <div className="px-4 py-1 text-xs text-stone-500 flex items-center gap-2">
                            <span>Titular:</span>
                            <span className="font-medium text-stone-700">{obfuscateName(business.contact.bancolombiaName)}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {business.contact.llaveBreB && (
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleCopy(business.contact.llaveBreB!, 'llaveBreB')}
                            className="flex-1 flex items-center justify-between px-4 py-3 bg-fuchsia-50 border border-fuchsia-100 text-fuchsia-700 rounded-xl hover:bg-fuchsia-100 transition-colors text-left"
                          >
                            <div className="flex items-center gap-2 font-semibold">
                              <span className="bg-fuchsia-600 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">Llave Bre B</span>
                              {business.contact.llaveBreB}
                            </div>
                            {copiedKey === 'llaveBreB' ? <CheckCircle2 className="w-5 h-5 text-fuchsia-600 flex-shrink-0" /> : <Copy className="w-5 h-5 opacity-50 flex-shrink-0" />}
                          </button>
                          {business.contact.llaveBreBName && (
                            <button
                              onClick={() => toggleNameReveal('llaveBreB')}
                              className="px-3 bg-stone-100 border border-stone-200 text-stone-500 hover:bg-stone-200 rounded-xl transition-colors flex items-center justify-center flex-shrink-0"
                              title="Ver nombre del titular"
                            >
                              {revealedNames['llaveBreB'] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                          )}
                        </div>
                        {revealedNames['llaveBreB'] && business.contact.llaveBreBName && (
                          <div className="px-4 py-1 text-xs text-stone-500 flex items-center gap-2">
                            <span>Titular:</span>
                            <span className="font-medium text-stone-700">{obfuscateName(business.contact.llaveBreBName)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <a 
                      href={`https://wa.me/57${business.contact.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors shadow-sm"
                    >
                      <Phone className="w-5 h-5" />
                      CONTACTAR POR WHATSAPP
                    </a>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Expanded Image Overlay */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-stone-950/95 backdrop-blur-md"
            onClick={() => setExpandedImage(null)}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setExpandedImage(null);
              }} 
              className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-[1110]"
            >
              <X className="w-6 h-6" />
            </button>
            
            {expandedImage.type === 'main' ? (
              hasMainImage ? (
                <img 
                  src={business.image} 
                  alt={business.name || 'Negocio'} 
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" 
                  onClick={(e) => e.stopPropagation()}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              ) : null
            ) : (
              <div className="relative flex items-center justify-center w-full h-full" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={(e) => {
                     e.stopPropagation();
                     setExpandedImage({ type: 'gallery', index: Math.max(0, expandedImage.index - 1) });
                  }}
                  disabled={expandedImage.index === 0}
                  className="absolute left-4 sm:left-8 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-[1110]"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <div className="flex flex-col items-center">
                  {business.products[expandedImage.index]?.image ? (
                    <img 
                      src={business.products[expandedImage.index].image} 
                      alt={business.products[expandedImage.index].name || 'Producto'} 
                      className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl mb-6" 
                    />
                  ) : (
                    <div className="w-64 h-64 bg-stone-800 rounded-xl flex items-center justify-center text-white mb-6">
                      Sin foto
                    </div>
                  )}
                  <div className="text-center text-white font-bold tracking-widest bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                    {expandedImage.index + 1} / {business.products.length}
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                     e.stopPropagation();
                     setExpandedImage({ type: 'gallery', index: Math.min(business.products.length - 1, expandedImage.index + 1) });
                  }}
                  disabled={expandedImage.index === business.products.length - 1}
                  className="absolute right-4 sm:right-8 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-[1110]"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
