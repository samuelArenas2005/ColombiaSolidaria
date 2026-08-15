import React, { useState } from 'react';
import { HeartHandshake, Menu, X, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'admin';
  onNavigate: (view: 'home' | 'admin') => void;
}

export default function Navbar({ currentView, onNavigate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        window.location.hash = href;
      }, 100);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <HeartHandshake className="h-8 w-8 text-rose-600" />
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Colombia<span className="text-rose-600">Solidario</span>
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {currentView === 'home' && (
              <>
                <a href="#inicio" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Inicio</a>
                <a href="#mapa" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Mapa</a>
                <a href="#directorio" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Directorio</a>
                <a href="#familias" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Ayuda a Familias</a>
                <a href="#transparencia" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Transparencia</a>
              </>
            )}
            
            <button 
              onClick={() => onNavigate(currentView === 'home' ? 'admin' : 'home')}
              className="flex items-center gap-1.5 bg-stone-100 text-stone-700 border border-stone-200 px-4 py-2 rounded-full font-bold text-sm hover:bg-stone-200 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              {currentView === 'home' ? 'Admin' : 'Volver'}
            </button>
            <a 
              href="#registrar" 
              onClick={() => handleNavClick('#registrar')}
              className="bg-gray-900 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Registrar Negocio
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => onNavigate(currentView === 'home' ? 'admin' : 'home')}
              className="flex items-center justify-center bg-stone-100 text-stone-700 border border-stone-200 w-9 h-9 rounded-full hover:bg-stone-200 transition-colors"
              title={currentView === 'home' ? 'Admin' : 'Volver'}
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg absolute w-full left-0 top-16">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            {currentView === 'home' && (
              <>
                <a href="#inicio" onClick={() => handleNavClick('#inicio')} className="block px-3 py-3 rounded-xl text-base font-medium text-gray-900 hover:bg-stone-50">Inicio</a>
                <a href="#mapa" onClick={() => handleNavClick('#mapa')} className="block px-3 py-3 rounded-xl text-base font-medium text-gray-900 hover:bg-stone-50">Mapa</a>
                <a href="#directorio" onClick={() => handleNavClick('#directorio')} className="block px-3 py-3 rounded-xl text-base font-medium text-gray-900 hover:bg-stone-50">Directorio</a>
                <a href="#familias" onClick={() => handleNavClick('#familias')} className="block px-3 py-3 rounded-xl text-base font-medium text-gray-900 hover:bg-stone-50">Ayuda a Familias</a>
                <a href="#transparencia" onClick={() => handleNavClick('#transparencia')} className="block px-3 py-3 rounded-xl text-base font-medium text-gray-900 hover:bg-stone-50">Transparencia</a>
              </>
            )}
            <a 
              href="#registrar" 
              onClick={() => handleNavClick('#registrar')}
              className="block mt-4 text-center bg-gray-900 text-white px-4 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Registrar Negocio
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
