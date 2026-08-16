import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, AlertCircle, CheckCircle, Loader2, HeartHandshake, ShieldAlert } from 'lucide-react';
import { useBusinesses } from '../context/BusinessContext';
import { sanitizeInput, isValidEmail, checkLoginRateLimit, recordFailedLoginAttempt, clearLoginAttempts } from '../utils/security';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const { login, isFirebaseConnected, user } = useBusinesses();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  // If already logged in, allow instant entry
  React.useEffect(() => {
    if (user) {
      onLogin();
    }
  }, [user, onLogin]);

  // Countdown timer for lockout
  React.useEffect(() => {
    if (lockoutSeconds > 0) {
      const timer = setInterval(() => {
        setLockoutSeconds(prev => (prev > 1 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Sanitize inputs against XSS / script injections
    const sanitizedEmail = sanitizeInput(email.trim());
    const sanitizedPassword = sanitizeInput(password); // password can contain special characters, but we prevent script injection payloads

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      setErrorMessage('Por favor ingresa un correo electrónico válido.');
      return;
    }

    // Check rate limit (Anti-DoS / Anti-Brute Force)
    const rateCheck = checkLoginRateLimit(sanitizedEmail);
    if (!rateCheck.allowed) {
      setLockoutSeconds(rateCheck.remainingSeconds);
      setErrorMessage(`Demasiados intentos fallidos. Por seguridad, espera ${rateCheck.remainingSeconds} segundos antes de volver a intentar.`);
      return;
    }

    setLoading(true);

    try {
      await login(sanitizedEmail, sanitizedPassword);
      clearLoginAttempts(sanitizedEmail);
      setSuccessMessage('¡Acceso concedido! Redirigiendo...');
      setTimeout(() => {
        onLogin();
      }, 600);
    } catch (err: any) {
      console.error('Auth error:', err);
      recordFailedLoginAttempt(sanitizedEmail);
      
      const newRateCheck = checkLoginRateLimit(sanitizedEmail);
      if (!newRateCheck.allowed) {
        setLockoutSeconds(newRateCheck.remainingSeconds);
      }

      let message = 'Correo o contraseña incorrectos. Verifica tus credenciales.';
      const code = err?.code || '';

      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        message = 'Correo o contraseña incorrectos. Verifica tus credenciales.';
      } else if (code === 'auth/invalid-email') {
        message = 'El formato del correo electrónico no es válido.';
      } else if (err?.message) {
        message = err.message;
      }
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 font-medium text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </button>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 border border-rose-100">
              <HeartHandshake className="w-8 h-8 text-rose-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-stone-900">Panel de Administración</h2>
            <p className="mt-1 text-xs text-stone-500">
              Inicia sesión para gestionar y registrar iniciativas solidarias verificadas
            </p>
          </div>

          {!isFirebaseConnected && (
            <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold block">Firebase no conectado aún</span>
                Puedes iniciar sesión en modo local de prueba. Para conectar tu base de datos de Firebase, agrega los secrets en la configuración.
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-shadow"
                  placeholder="admin@jamundisolidario.org"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-shadow"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || lockoutSeconds > 0}
              className="w-full mt-2 flex justify-center items-center gap-2 bg-stone-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-stone-800 transition-colors shadow-sm disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verificando...</span>
                </>
              ) : lockoutSeconds > 0 ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Bloqueado ({lockoutSeconds}s)</span>
                </>
              ) : (
                <span>INICIAR SESIÓN</span>
              )}
            </button>
          </form>

          {/* Volunteer recommendation & contact message */}
          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-500 leading-relaxed">
              ¿Deseas registrar un negocio o unirte como voluntario? Contáctanos a través de nuestros canales oficiales o comunícate con el equipo organizador en Jamundí para obtener tus credenciales de acceso administrativo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
