import React, { useState } from 'react';
import { useBusinesses } from '../context/BusinessContext';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminAudit() {
  const { auditLogs } = useBusinesses();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(auditLogs.length / itemsPerPage));
  const paginatedLogs = auditLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            Auditoría de Acciones
          </h2>
          <p className="text-sm text-stone-500 mt-1">Registro inmutable de creación y eliminación de negocios.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="pb-3 text-xs font-semibold text-stone-500 uppercase">Fecha / Hora</th>
              <th className="pb-3 text-xs font-semibold text-stone-500 uppercase">Acción</th>
              <th className="pb-3 text-xs font-semibold text-stone-500 uppercase">Negocio</th>
              <th className="pb-3 text-xs font-semibold text-stone-500 uppercase">Usuario (Email)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {paginatedLogs.map(log => (
              <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                <td className="py-4 text-sm text-stone-600">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {log.action === 'CREATE' ? <Plus className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                    {log.action === 'CREATE' ? 'Creación' : 'Eliminación'}
                  </span>
                </td>
                <td className="py-4 text-sm font-semibold text-stone-900">{log.businessName}</td>
                <td className="py-4 text-sm text-stone-500">{log.userEmail}</td>
              </tr>
            ))}
            {paginatedLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-stone-500 text-sm">
                  No hay registros de auditoría disponibles.
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
    </div>
  );
}
