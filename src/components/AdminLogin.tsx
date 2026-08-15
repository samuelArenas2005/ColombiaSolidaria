import React, { useState } from 'react';
import { Shield, ArrowLeft, Mail } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Provisional login: always allow passing for testing purposes
    onLogin();
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <button 
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio
        </button>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4 border border-stone-200">
              <Shield className="w-8 h-8 text-stone-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Acceso Administrativo</h2>
            <p className="mt-2 text-sm text-stone-600">
              Esta sección es exclusiva para añadir y gestionar negocios verificados que necesitan ayuda.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-8">
            <h3 className="text-sm font-bold text-emerald-900 mb-1 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              ¿Quieres registrar una iniciativa?
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Si conoces un negocio afectado o eres un voluntario que desea ayudar a añadir nuevos casos, por favor comunícate a través de la sección de <strong>Contacto</strong> en la página principal para brindarte acceso.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Correo Electrónico</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-shadow"
                placeholder="admin@jamundisolidario.org"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Contraseña</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-shadow"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-gray-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
            >
              ENTRAR AL PANEL
            </button>
            <p className="text-center text-xs text-stone-400 mt-4">
              * El inicio de sesión es provisional para pruebas
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
