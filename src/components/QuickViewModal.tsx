import React, { useState } from 'react';
import { Business } from '../data/businesses';
import { X, HandHeart, ShoppingBag, Phone, Copy, CheckCircle2, ShieldCheck, ZoomIn, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
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
}

export default function QuickViewModal({ business, onClose }: QuickViewModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<{ type: 'main' } | { type: 'gallery', index: number } | null>(null);
  const [revealedNames, setRevealedNames] = useState<Record<string, boolean>>({});
  
  const isDonation = business.needType === 'donation';

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleNameReveal = (key: string) => {
    setRevealedNames(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
            className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-stone-100">
              <h2 className="text-lg font-bold text-gray-900 truncate pr-4">
                VISTA RÁPIDA: {business.name.toUpperCase()}
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
                    onClick={() => setExpandedImage({ type: 'main' })}
                  >
                    <img 
                      src={business.image} 
                      alt={business.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                    </div>
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
                    <p>Iniciativa verificada. JamundíSolidario no cobra comisiones. Tu ayuda va 100% al emprendedor.</p>
                  </a>
                </div>

                {/* Right Column: Details & Actions */}
                <div className="w-full md:w-1/2 flex flex-col">
                  <span className="text-sm font-bold text-stone-400 tracking-wider uppercase mb-1">
                    {business.category}
                  </span>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-4 leading-tight">
                    {business.name}
                  </h3>
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
                        {business.products.map((p, idx) => (
                          <div 
                            key={p.id} 
                            className="w-20 flex-shrink-0 group cursor-pointer"
                            onClick={() => setExpandedImage({ type: 'gallery', index: idx })}
                          >
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden mb-1 border border-stone-100 bg-stone-50">
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                            <p className="text-[10px] font-medium text-stone-600 text-center truncate">{p.name}</p>
                          </div>
                        ))}
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
                            <div className="flex items-center gap-2 font-bold">
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
                            <div className="flex items-center gap-2 font-bold">
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
                            <div className="flex items-center gap-2 font-bold">
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

                    <a 
                      href={`https://wa.me/57${business.contact.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-sm"
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
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stone-950/95 backdrop-blur-md"
            onClick={() => setExpandedImage(null)}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setExpandedImage(null);
              }} 
              className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-[210]"
            >
              <X className="w-6 h-6" />
            </button>
            
            {expandedImage.type === 'main' ? (
              <img 
                src={business.image} 
                alt={business.name} 
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" 
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?auto=format&fit=crop&w=600&q=80';
                }}
              />
            ) : (
              <div className="relative flex items-center justify-center w-full h-full" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={(e) => {
                     e.stopPropagation();
                     setExpandedImage({ type: 'gallery', index: Math.max(0, expandedImage.index - 1) });
                  }}
                  disabled={expandedImage.index === 0}
                  className="absolute left-4 sm:left-8 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-[210]"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <div className="flex flex-col items-center">
                  <img 
                    src={business.products[expandedImage.index].image} 
                    alt={business.products[expandedImage.index].name} 
                    className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl mb-6" 
                  />
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
                  className="absolute right-4 sm:right-8 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-[210]"
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
