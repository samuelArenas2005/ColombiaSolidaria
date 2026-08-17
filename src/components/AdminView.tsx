import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinesses } from '../context/BusinessContext';
import { ArrowLeft, Database, LogOut, User as UserIcon, PlusCircle, List, ShieldCheck } from 'lucide-react';
import AdminForm from './AdminForm';
import AdminManage from './AdminManage';
import AdminAudit from './AdminAudit';

export default function AdminView() {
  const navigate = useNavigate();
  const { isFirebaseConnected, user, logout } = useBusinesses();
  const [activeTab, setActiveTab] = useState<'add' | 'manage' | 'audit'>('add');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 font-medium text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la plataforma
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-stone-200 rounded-full text-xs text-stone-700 shadow-xs">
              <UserIcon className="w-3.5 h-3.5 text-stone-500" />
              <span className="font-semibold">{user?.email || 'Administrador'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-semibold transition-colors"
              title="Cerrar sesión administrativa"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Panel de Administración</h1>
          <p className="text-stone-600 mt-1 text-sm">Gestiona negocios, aprueba solicitudes y monitorea la plataforma.</p>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 snap-x">
          <button
            onClick={() => setActiveTab('add')}
            className={`snap-start flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'add' 
                ? 'bg-stone-900 text-white shadow-sm' 
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Añadir Negocio
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`snap-start flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'manage' 
                ? 'bg-stone-900 text-white shadow-sm' 
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <List className="w-4 h-4" />
            Gestionar Negocios
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`snap-start flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'audit' 
                ? 'bg-stone-900 text-white shadow-sm' 
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Auditoría
          </button>
        </div>

        {/* Render Active Tab Content */}
        {activeTab === 'add' && <AdminForm />}
        {activeTab === 'manage' && <AdminManage />}
        {activeTab === 'audit' && <AdminAudit />}
        
      </div>
    </div>
  );
}
