import React from 'react';
import { ShieldCheck, HeartHandshake, AlertTriangle, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'admin' | 'legal') => void;
}

export default function TransparencyAndFooter({ onNavigate }: FooterProps) {
  return (
    <>
      {/* Transparency Section */}
      <section id="transparencia" className="bg-stone-900 text-stone-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Transparencia y Verificación</h2>
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
              <button className="flex items-center gap-2 text-rose-400 hover:text-rose-300 font-bold text-sm uppercase tracking-wider transition-colors">
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
          <h2 className="text-3xl font-extrabold mb-4">¿Tu negocio fue afectado por el sismo?</h2>
          <p className="text-rose-100 mb-8 text-lg">
            Regístrate en nuestro directorio para recibir apoyo de la comunidad. Es completamente gratis y solo tomará unos minutos verificar tus datos.
          </p>
          <button onClick={() => onNavigate('admin')} className="inline-flex items-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-full font-bold hover:bg-stone-100 transition-colors shadow-lg">
            LLENAR FORMULARIO DE REGISTRO
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-500 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <HeartHandshake className="h-6 w-6 text-stone-700" />
            <span className="font-bold text-lg tracking-tight text-stone-400">
              Colombia<span className="text-stone-600">Solidario</span>
            </span>
          </div>
          
          <p className="text-sm font-medium text-center md:text-left uppercase tracking-wider">
            Proyecto solidario gratuito para Colombia. Desarrollado por voluntarios.
          </p>

          <div className="flex gap-4 text-sm font-medium">
            <button onClick={() => onNavigate('legal')} className="hover:text-stone-300 transition-colors">Términos y Privacidad</button>
            <button onClick={() => onNavigate('legal')} className="hover:text-stone-300 transition-colors">Contacto</button>
          </div>
        </div>
      </footer>
    </>
  );
}
