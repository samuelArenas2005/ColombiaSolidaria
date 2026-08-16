import React, { useState } from 'react';
import { HeartHandshake, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'admin' | 'admin-login' | 'legal' | 'google-form';
  onNavigate: (view: 'home' | 'admin' | 'admin-login' | 'legal' | 'google-form') => void;
}

export default function Navbar({ currentView, onNavigate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          <div 
            className="flex items-center gap-2.5 cursor-pointer flex-shrink-0"
            onClick={() => onNavigate('home')}
          >
            <HeartHandshake className="h-8 w-8 text-rose-600 transition-transform hover:scale-105" />
            <span className="font-bold text-xl sm:text-2xl tracking-tight text-gray-900">
              Colombia<span className="text-rose-600">Solidario</span>
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex ml-auto items-center space-x-6 lg:space-x-8 xl:space-x-10 text-sm lg:text-base font-medium">
            {currentView === 'home' ? (
              <>
                <a href="#inicio" className="text-gray-600 hover:text-gray-900 transition-colors py-1">Inicio</a>
                <a href="#mapa" className="text-gray-600 hover:text-gray-900 transition-colors py-1">Mapa</a>
                <a href="#directorio" className="text-gray-600 hover:text-gray-900 transition-colors py-1">Negocios</a>
                <a href="#familias" className="text-gray-600 hover:text-gray-900 transition-colors py-1">Ayuda a Familias</a>
                <a href="#transparencia" className="text-gray-600 hover:text-gray-900 transition-colors py-1">Cómo funciona</a>
              </>
            ) : (
              <button 
                onClick={() => onNavigate('home')}
                className="text-gray-600 hover:text-gray-900 transition-colors py-1 font-semibold cursor-pointer"
              >
                Volver al Inicio
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg absolute w-full left-0 top-16 sm:top-20 z-50">
          <div className="px-4 pt-3 pb-6 space-y-2 flex flex-col">
            {currentView === 'home' && (
              <>
                <a href="#inicio" onClick={() => handleNavClick('#inicio')} className="block px-3 py-3 rounded-xl text-base font-medium text-gray-900 hover:bg-stone-50 transition-colors">Inicio</a>
                <a href="#mapa" onClick={() => handleNavClick('#mapa')} className="block px-3 py-3 rounded-xl text-base font-medium text-gray-900 hover:bg-stone-50 transition-colors">Mapa</a>
                <a href="#directorio" onClick={() => handleNavClick('#directorio')} className="block px-3 py-3 rounded-xl text-base font-medium text-gray-900 hover:bg-stone-50 transition-colors">Negocios</a>
                <a href="#familias" onClick={() => handleNavClick('#familias')} className="block px-3 py-3 rounded-xl text-base font-medium text-gray-900 hover:bg-stone-50 transition-colors">Ayuda a Familias</a>
                <a href="#transparencia" onClick={() => handleNavClick('#transparencia')} className="block px-3 py-3 rounded-xl text-base font-medium text-gray-900 hover:bg-stone-50 transition-colors">Cómo funciona</a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
