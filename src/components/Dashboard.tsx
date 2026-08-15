import React, { useState, useMemo, useEffect } from 'react';
import { businesses, Business, NeedType } from '../data/businesses';
import MapSection from './MapSection';
import Directory from './Directory';
import QuickViewModal from './QuickViewModal';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 3;

export default function Dashboard() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [needFilter, setNeedFilter] = useState<'all' | NeedType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [minHeight, setMinHeight] = useState<number | undefined>(undefined);
  const directoryRef = React.useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const cats = new Set(businesses.map(b => b.category));
    return ['all', ...Array.from(cats)];
  }, []);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => {
      const matchNeed = needFilter === 'all' || b.needType === needFilter;
      const matchCategory = categoryFilter === 'all' || b.category === categoryFilter;
      return matchNeed && matchCategory;
    });
  }, [needFilter, categoryFilter]);

  // Reset to first page and reset min-height when filters change
  useEffect(() => {
    setCurrentPage(1);
    setMinHeight(undefined);
  }, [needFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE);
  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (directoryRef.current) {
      setMinHeight(directoryRef.current.offsetHeight);
    }
    setCurrentPage(newPage);
  };

  const clearNeedFilter = () => setNeedFilter('all');
  const clearCategoryFilter = () => setCategoryFilter('all');

  return (
    <div id="mapa" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Mapa de Ayuda</h2>
          <p className="text-gray-600 mt-2">Encuentra negocios locales. Usa los filtros para enfocar tu ayuda.</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-2 px-2 text-stone-500">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filtros:</span>
          </div>
          
          <select 
            className="bg-white border-none rounded-xl px-4 py-2 font-medium text-gray-700 shadow-sm focus:ring-2 focus:ring-rose-500 outline-none cursor-pointer"
            value={needFilter}
            onChange={(e) => setNeedFilter(e.target.value as any)}
          >
            <option value="all">Todo tipo de apoyo</option>
            <option value="donation">🔴 Solo Donaciones</option>
            <option value="sale">🟢 Venta Activa</option>
          </select>
          
          <select 
            className="bg-white border-none rounded-xl px-4 py-2 font-medium text-gray-700 shadow-sm focus:ring-2 focus:ring-rose-500 outline-none cursor-pointer"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.filter(c => c !== 'all').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applied Filters Display */}
      {(needFilter !== 'all' || categoryFilter !== 'all') && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm font-medium text-stone-500">Filtros aplicados:</span>
          {needFilter !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-rose-100 text-rose-800">
              {needFilter === 'donation' ? '🔴 Solo Donaciones' : '🟢 Venta Activa'}
              <button onClick={clearNeedFilter} className="hover:bg-rose-200 p-0.5 rounded-full transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {categoryFilter !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 text-indigo-800">
              Categoría: {categoryFilter}
              <button onClick={clearCategoryFilter} className="hover:bg-indigo-200 p-0.5 rounded-full transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 h-[500px] rounded-3xl overflow-hidden shadow-sm border border-stone-200">
          <MapSection 
            businesses={filteredBusinesses} 
            onSelectBusiness={setSelectedBusiness} 
          />
        </div>
      </div>

      <div id="directorio" className="mt-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Directorio de Negocios</h2>
            <p className="text-gray-600">Conoce sus historias y bríndales tu apoyo directo. Mostrando {filteredBusinesses.length} resultados.</p>
          </div>
        </div>
        
        <div 
          ref={directoryRef} 
          style={{ minHeight: minHeight ? `${minHeight}px` : 'auto' }}
        >
          <Directory 
            businesses={paginatedBusinesses}
            onSelectBusiness={setSelectedBusiness}
          />
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <button 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-stone-600">
              Página {currentPage} de {totalPages}
            </span>
            <button 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {selectedBusiness && (
        <QuickViewModal 
          business={selectedBusiness} 
          onClose={() => setSelectedBusiness(null)} 
        />
      )}
    </div>
  );
}
