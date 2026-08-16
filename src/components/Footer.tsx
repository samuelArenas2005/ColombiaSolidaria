import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, AlertTriangle, ArrowRight } from 'lucide-react';

export default function TransparencyAndFooter() {
  const navigate = useNavigate();

  return (
    <>
      {/* SVG Transition Divider */}
      <div className="w-full overflow-hidden leading-none bg-stone-50">
        <svg 
          className="block w-full h-12 sm:h-24 md:h-32" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z" 
            className="fill-stone-900"
          ></path>
        </svg>
      </div>

      {/* Transparency Section */}
      <section id="transparencia" className="bg-stone-900 text-stone-100 py-16 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparencia y Verificación</h2>
            <p className="text-stone-400 text-lg">
              Sabemos que en tiempos de crisis la confianza es fundamental. Así es como aseguramos que tu ayuda llegue a quienes realmente la necesitan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-stone-800 p-8 rounded-3xl">
              <div className="w-10 h-10 bg-stone-700 rounded-full flex items-center justify-center text-xl font-bold mb-6 text-emerald-400">1</div>
              <h3 className="text-xl font-bold mb-3">Verificación de Afectación</h3>
              <p className="text-stone-400 leading-relaxed">
                Requerimos a cada emprendedor fotos de los daños estructurales, evidencia de su inventario, y comprobación de ubicación mediante geolocalización o recibos de servicios públicos.
              </p>
            </div>
            
            <div className="bg-stone-800 p-8 rounded-3xl">
              <div className="w-10 h-10 bg-stone-700 rounded-full flex items-center justify-center text-xl font-bold mb-6 text-emerald-400">2</div>
              <h3 className="text-xl font-bold mb-3">Cero Intermediarios</h3>
              <p className="text-stone-400 leading-relaxed">
                No recaudamos dinero. Somos un puente tecnológico gratuito. Todos los pagos, donaciones y compras se realizan directamente a las cuentas bancarias o billeteras (Nequi/Daviplata) del emprendedor.
              </p>
            </div>

            <div className="bg-stone-800 p-8 rounded-3xl">
              <div className="w-10 h-10 bg-stone-700 rounded-full flex items-center justify-center text-xl font-bold mb-6 text-emerald-400">3</div>
              <h3 className="text-xl font-bold mb-3">Reporte de Abusos</h3>
              <p className="text-stone-400 leading-relaxed mb-4">
                Si detectas inconsistencias con algún negocio publicado, puedes reportarlo inmediatamente para que nuestro equipo voluntario realice una segunda auditoría.
              </p>
              <button 
                onClick={() => {
                  navigate('/legal');
                  setTimeout(() => {
                    const el = document.getElementById('contacto');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="flex items-center gap-2 text-rose-400 hover:text-rose-300 font-semibold text-sm uppercase tracking-wider transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                Reportar Perfil
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section CTA */}
      <section id="registrar" className="bg-rose-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Tu negocio fue afectado por el sismo?</h2>
          <p className="text-rose-100 mb-8 text-lg">
            Regístrate en nuestro directorio para recibir apoyo de la comunidad. Es completamente gratis y solo tomará unos minutos verificar tus datos.
          </p>
          <button onClick={() => navigate('/formulario')} className="inline-flex items-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-full font-semibold hover:bg-stone-100 transition-colors shadow-lg cursor-pointer">
            LLENAR FORMULARIO DE REGISTRO
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-500 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <HeartHandshake className="h-6 w-6 text-stone-700" />
            <span className="font-bold text-lg tracking-tight text-stone-400">
              Colombia<span className="text-stone-600">Solidario</span>
            </span>
          </div>
          
          <p className="text-sm font-medium text-center md:text-left uppercase tracking-wider">
            Proyecto solidario gratuito para Colombia. Desarrollado por voluntarios.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
            <button onClick={() => navigate('/legal')} className="hover:text-stone-300 transition-colors cursor-pointer">Términos y Privacidad</button>
            <button onClick={() => navigate('/legal')} className="hover:text-stone-300 transition-colors cursor-pointer">Contacto</button>
            <button 
              onClick={() => navigate('/admin/login')} 
              className="text-stone-600 hover:text-stone-400 border border-stone-800 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer"
              title="Acceso administrativo provisional"
            >
              Admin
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
