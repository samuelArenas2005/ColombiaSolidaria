import React, { useState, useEffect } from 'react';
import { X, Moon, Sun, ZoomIn, ZoomOut, Contrast } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const UniversalAccessIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 100" 
    fill="none"
    className={className}
  >
    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"/>
    <circle cx="50" cy="28" r="8" fill="currentColor"/>
    <path d="M 22 43 L 78 43" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    <path d="M 50 43 L 50 65" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    <path d="M 50 63 L 35 88" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    <path d="M 50 63 L 65 88" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
  </svg>
);

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState(100);

  useEffect(() => {
    const root = document.documentElement;
    
    if (darkMode) {
      root.classList.add('dark');
      root.classList.add('a11y-dark');
    } else {
      root.classList.remove('dark');
      root.classList.remove('a11y-dark');
    }

    if (highContrast) {
      root.classList.add('a11y-high-contrast');
    } else {
      root.classList.remove('a11y-high-contrast');
    }

    root.style.fontSize = `${textSize}%`;
  }, [darkMode, highContrast, textSize]);

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] flex">
      {/* Main Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-stone-900 text-white p-3 rounded-l-xl shadow-xl hover:bg-stone-800 transition-colors flex items-center justify-center border border-r-0 border-stone-700"
        aria-label="Menú de Accesibilidad"
      >
        {isOpen ? <X className="w-6 h-6" /> : <UniversalAccessIcon className="w-6 h-6" />}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white border border-stone-200 shadow-2xl rounded-l-2xl p-5 w-72 absolute right-full mr-2 top-1/2 -translate-y-1/2"
          >
            <div className="mb-4 pb-3 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UniversalAccessIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900">Accesibilidad</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Theme Toggle */}
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">Apariencia</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setDarkMode(false)}
                    className={`flex-1 py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${!darkMode ? 'bg-stone-100 border-stone-300 text-stone-900' : 'border-stone-100 text-stone-400 hover:bg-stone-50'}`}
                  >
                    <Sun className="w-5 h-5" />
                    <span className="text-xs font-bold">Claro</span>
                  </button>
                  <button 
                    onClick={() => setDarkMode(true)}
                    className={`flex-1 py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${darkMode ? 'bg-stone-900 border-stone-700 text-white' : 'border-stone-100 text-stone-400 hover:bg-stone-50'}`}
                  >
                    <Moon className="w-5 h-5" />
                    <span className="text-xs font-bold">Oscuro</span>
                  </button>
                </div>
              </div>

              {/* High Contrast */}
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">Contraste</label>
                <button 
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-full py-3 px-4 rounded-xl border flex items-center justify-between transition-colors ${highContrast ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                >
                  <div className="flex items-center gap-2">
                    <Contrast className="w-5 h-5" />
                    <span className="text-sm font-bold">Alto Contraste</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${highContrast ? 'bg-emerald-500' : 'bg-stone-300'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${highContrast ? 'left-5' : 'left-1'}`}></div>
                  </div>
                </button>
              </div>

              {/* Text Size */}
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">Tamaño de Texto</label>
                <div className="flex items-center justify-between border border-stone-200 rounded-xl p-1.5 bg-stone-50">
                  <button 
                    onClick={() => setTextSize(Math.max(80, textSize - 10))}
                    className="p-2.5 hover:bg-white rounded-lg shadow-sm text-stone-600 transition-colors"
                    title="Reducir texto"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-bold text-stone-700">{textSize}%</span>
                  <button 
                    onClick={() => setTextSize(Math.min(150, textSize + 10))}
                    className="p-2.5 hover:bg-white rounded-lg shadow-sm text-stone-600 transition-colors"
                    title="Aumentar texto"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Reset */}
              <button 
                onClick={() => { setDarkMode(false); setHighContrast(false); setTextSize(100); }}
                className="w-full text-center text-sm text-stone-400 hover:text-stone-600 font-medium pt-2"
              >
                Restablecer valores
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
