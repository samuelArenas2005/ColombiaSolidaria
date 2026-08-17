import React, { useState } from 'react';
import { useBusinesses } from '../context/BusinessContext';
import { Business } from '../data/businesses';
import { Search, Trash2, X, AlertTriangle } from 'lucide-react';

export default function AdminManage() {
  const { businesses, deleteBusiness } = useBusinesses();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const [deleteCandidate, setDeleteCandidate] = useState<Business | null>(null);
  const [confirmText, setConfirmText] = useState('');

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async () => {
    if (deleteCandidate && confirmText === 'ColombiaSolidaria') {
      await deleteBusiness(deleteCandidate.id, deleteCandidate.name);
      setDeleteCandidate(null);
      setConfirmText('');
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Gestionar Negocios</h2>
          <p className="text-sm text-stone-500 mt-1">Administra o elimina los negocios registrados.</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input 
            type="text" 
            placeholder="Buscar negocio..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="pb-3 text-xs font-semibold text-stone-500 uppercase">Negocio</th>
              <th className="pb-3 text-xs font-semibold text-stone-500 uppercase">Categoría</th>
              <th className="pb-3 text-xs font-semibold text-stone-500 uppercase">Necesidad</th>
              <th className="pb-3 text-xs font-semibold text-stone-500 uppercase text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {paginatedBusinesses.map(b => (
              <tr key={b.id} className="hover:bg-stone-50 transition-colors">
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    {b.image ? (
                      <img src={b.image} alt={b.name} className="w-10 h-10 rounded-lg object-cover bg-stone-200 flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-stone-200 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold text-stone-900 text-sm line-clamp-1">{b.name}</p>
                      <p className="text-xs text-stone-500 line-clamp-1">{b.description}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm text-stone-700">{b.category}</td>
                <td className="py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    b.needType === 'donation' ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-700'
                  }`}>
                    {b.needType === 'donation' ? 'Donación' : 'Venta'}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button 
                    onClick={() => setDeleteCandidate(b)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Eliminar negocio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedBusinesses.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-stone-500 text-sm">
                  No se encontraron negocios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-stone-100">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 rounded-lg hover:bg-stone-200 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-xs font-medium text-stone-500">Página {currentPage} de {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 rounded-lg hover:bg-stone-200 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl animate-scaleIn">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <button onClick={() => setDeleteCandidate(null)} className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Eliminar Negocio</h3>
            <p className="text-sm text-stone-600 mb-4">
              Estás a punto de eliminar <strong className="text-stone-900">{deleteCandidate.name}</strong>. Esta acción no se puede deshacer y quedará registrada en auditoría.
            </p>
            <div className="mb-6">
              <label className="block text-xs font-medium text-stone-700 mb-2">
                Para confirmar, escribe <strong>ColombiaSolidaria</strong>
              </label>
              <input 
                type="text" 
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-400 transition-shadow text-stone-900"
                placeholder="Escribe ColombiaSolidaria"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => { setDeleteCandidate(null); setConfirmText(''); }}
                className="flex-1 px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-sm transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                disabled={confirmText !== 'ColombiaSolidaria'}
                className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                Eliminar Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
