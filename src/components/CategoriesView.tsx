import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  HelpCircle
} from 'lucide-react';
import { CATEGORIES_DATA } from '../data/categories';

export default function CategoriesView() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredCategories = CATEGORIES_DATA.filter(category => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    
    const matchesCategoryName = category.name.toLowerCase().includes(term);
    const matchesDescription = category.description.toLowerCase().includes(term);
    const matchesSubcategory = category.subcategories.some(sub => sub.toLowerCase().includes(term));
    
    return matchesCategoryName || matchesDescription || matchesSubcategory;
  });

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0d0e12] py-8 sm:py-14 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Return Button */}
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white font-medium mb-6 transition-colors cursor-pointer bg-white dark:bg-[#181920] px-4 py-2.5 rounded-full border border-stone-200 dark:border-[#272832] shadow-xs text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la página principal</span>
        </button>

        {/* Document Container */}
        <div className="bg-white dark:bg-[#16171d] rounded-3xl border border-stone-200 dark:border-[#272832] shadow-sm p-6 sm:p-10 md:p-12">
          
          {/* Document Header */}
          <div className="border-b border-stone-200 dark:border-[#272832] pb-6 sm:pb-8 mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                  Estructura y Clasificación de Negocios
                </h1>
                <p className="text-stone-600 dark:text-stone-300 mt-2 text-sm leading-relaxed max-w-2xl">
                  Consulta las <strong>13 categorías principales</strong> de la plataforma y el desglose de productos, servicios y oficios que comprende cada una.
                </p>
              </div>

              {/* Quick Search */}
              <div className="w-full md:w-72 flex-shrink-0">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar actividad o producto..."
                    className="w-full pl-9 pr-8 py-2 bg-stone-50 dark:bg-[#1e1f28] border border-stone-200 dark:border-[#323442] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Document Content List */}
          {filteredCategories.length === 0 ? (
            <div className="py-12 text-center">
              <HelpCircle className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                No se encontraron categorías para "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-3 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                Restablecer búsqueda
              </button>
            </div>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-[#272832]">
              {filteredCategories.map((category) => (
                <article key={category.id} className="py-5 sm:py-6 first:pt-0 last:pb-0">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white leading-tight">
                      {category.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Subcategories (Tags) */}
                    <div className="mt-3 pt-3 border-t border-stone-100/80 dark:border-[#22232d]">
                      <div className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-2">
                        Incluye:
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {category.subcategories.map((sub, sIdx) => (
                          <span 
                            key={sIdx}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 dark:bg-[#1e1f28] text-stone-700 dark:text-stone-200 border border-stone-200/60 dark:border-[#2e303d]"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
