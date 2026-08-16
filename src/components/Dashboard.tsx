import React, { useState, useMemo, useEffect } from 'react';
import { Business, NeedType } from '../data/businesses';
import { useBusinesses } from '../context/BusinessContext';
import MapSection from './MapSection';
import Directory, { EXAMPLE_BUSINESS } from './Directory';
import QuickViewModal from './QuickViewModal';
import { Filter, X, ChevronLeft, ChevronRight, HandHeart, ShoppingBag, Layers, Loader2 } from 'lucide-react';

const ITEMS_PER_PAGE = 3;

export default function Dashboard() {
  const { businesses, isLoading } = useBusinesses();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [focusedBusiness, setFocusedBusiness] = useState<Business | null>(null);
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

  const handleViewOnMap = (b: Business) => {
    setSelectedBusiness(null);
    setFocusedBusiness(b);
    const mapElement = document.getElementById('mapa');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const clearNeedFilter = () => setNeedFilter('all');
  const clearCategoryFilter = () => setCategoryFilter('all');

  // Businesses to show on map (includes EXAMPLE_BUSINESS if directory is empty)
  const mapBusinesses = useMemo(() => {
    if (filteredBusinesses.length > 0) {
      return filteredBusinesses;
    }
    return [EXAMPLE_BUSINESS];
  }, [filteredBusinesses]);

  return (
    <div id="mapa" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-stone-900 dark:text-white">Mapa de Ayuda y Directorio</h2>
          <p className="text-stone-600 dark:text-stone-400 mt-2">Encuentra negocios e iniciativas locales. Explora las agrupaciones en el mapa interactivo.</p>
        </div>
        
        {/* Minimalist Filters */}
        <div className="flex flex-wrap items-center gap-2.5 bg-stone-50 dark:bg-stone-900 p-2.5 rounded-2xl border border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-1.5 px-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <Filter className="w-4 h-4" />
            <span>Filtrar</span>
          </div>

          {/* Need Type Filter Segmented Buttons / Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
            <button
              type="button"
              onClick={() => setNeedFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                needFilter === 'all'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setNeedFilter('donation')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                needFilter === 'donation'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400'
              }`}
            >
              <HandHeart className={`w-3.5 h-3.5 ${needFilter === 'donation' ? 'text-white' : 'text-rose-500'}`} />
              <span>Solo Donaciones</span>
            </button>
            <button
              type="button"
              onClick={() => setNeedFilter('sale')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                needFilter === 'sale'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-teal-600 dark:hover:text-teal-400'
              }`}
            >
              <ShoppingBag className={`w-3.5 h-3.5 ${needFilter === 'sale' ? 'text-white' : 'text-teal-600'}`} />
              <span>Venta Activa</span>
            </button>
          </div>
          
          {/* Category Dropdown */}
          <select 
            className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-200 shadow-sm focus:ring-2 focus:ring-stone-400 outline-none cursor-pointer"
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

      {/* Applied Filters Badges */}
      {(needFilter !== 'all' || categoryFilter !== 'all') && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-semibold text-stone-500">Filtros activos:</span>
          {needFilter !== 'all' && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              needFilter === 'donation'
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                : 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60'
            }`}>
              {needFilter === 'donation' ? (
                <>
                  <HandHeart className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Solo Donaciones</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Venta Activa</span>
                </>
              )}
              <button 
                onClick={clearNeedFilter} 
                className={`p-0.5 rounded-full transition-colors ${
                  needFilter === 'donation' ? 'hover:bg-rose-200 dark:hover:bg-rose-800' : 'hover:bg-teal-200 dark:hover:bg-teal-800'
                }`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {categoryFilter !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
              <span>Categoría: {categoryFilter}</span>
              <button onClick={clearCategoryFilter} className="hover:bg-stone-200 dark:hover:bg-stone-700 p-0.5 rounded-full transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Main Grid: Map & Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Section */}
        <div className="lg:col-span-3 h-[520px] rounded-3xl overflow-hidden shadow-sm border border-stone-200 dark:border-stone-800">
          <MapSection 
            businesses={mapBusinesses} 
            onSelectBusiness={(b) => {
              setFocusedBusiness(null);
              setSelectedBusiness(b);
            }}
            focusedBusiness={focusedBusiness}
            onClearFocus={() => setFocusedBusiness(null)}
            isModalOpen={Boolean(selectedBusiness)}
          />
        </div>
      </div>

      {/* Directory Section */}
      <div id="directorio" className="mt-16">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-stone-900 dark:text-white">Directorio de Negocios</h3>
            <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">Explora las iniciativas y casos de apoyo disponibles.</p>
          </div>
        </div>

        <div ref={directoryRef} style={{ minHeight: minHeight ? `${minHeight}px` : undefined }} className="transition-[min-height] duration-200">
          <Directory 
            businesses={paginatedBusinesses} 
            onSelectBusiness={setSelectedBusiness} 
            onViewOnMap={handleViewOnMap}
          />
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <div className="flex items-center gap-1.5 px-3">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
                    currentPage === pageNum
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {selectedBusiness && (
        <QuickViewModal 
          business={selectedBusiness} 
          onClose={() => setSelectedBusiness(null)} 
          onViewOnMap={handleViewOnMap}
        />
      )}
    </div>
  );
}
