import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Scale, Mail, Phone } from 'lucide-react';

export default function LegalView() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8 md:p-12">
          
          {/* Términos de Uso */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="w-8 h-8 text-rose-500" />
              <h1 className="text-3xl font-extrabold text-gray-900">Términos de Uso</h1>
            </div>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                <strong>ColombiaSolidario</strong> es una iniciativa sin ánimo de lucro desarrollada por voluntarios. 
                Su propósito exclusivo es servir como puente de conexión tecnológica entre familias, comunidades y emprendedores afectados por desastres naturales en Colombia, y aquellos ciudadanos dispuestos a brindar ayuda.
              </p>
              <p>
                <strong>1. No somos intermediarios financieros:</strong> La plataforma no recauda, retiene ni transfiere dinero. Todas las donaciones o transacciones de compra se realizan de manera directa entre el donante/comprador y las cuentas bancarias o billeteras digitales (Nequi, Daviplata, Bancolombia) proporcionadas por los afectados.
              </p>
              <p>
                <strong>2. Verificación de Información:</strong> Aunque realizamos esfuerzos de buena fe y validación comunitaria para verificar la autenticidad de los casos (solicitando fotos de daños estructurales, inventario, etc.), no podemos garantizar de forma absoluta la veracidad de la información publicada por terceros. Instamos a los donantes a ejercer debida diligencia.
              </p>
              <p>
                <strong>3. Exención de Responsabilidad:</strong> ColombiaSolidario y sus desarrolladores voluntarios no se hacen responsables por posibles fraudes, incumplimientos en la entrega de productos o mal uso de los fondos transferidos directamente a los beneficiarios.
              </p>
            </div>
          </section>

          {/* Política de Privacidad */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              <h2 className="text-3xl font-extrabold text-gray-900">Política de Privacidad</h2>
            </div>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                En cumplimiento con la <strong>Ley 1581 de 2012</strong> (Ley de Protección de Datos Personales de Colombia) y el Decreto 1377 de 2013, informamos el tratamiento que le damos a sus datos:
              </p>
              <p>
                <strong>Uso de la Información:</strong> Los datos personales recolectados (nombres, números de teléfono, números de cuenta, geolocalización de negocios) se utilizan exclusivamente para los fines de esta iniciativa de ayuda comunitaria.
              </p>
              <p>
                <strong>Consentimiento:</strong> Al registrar un caso de ayuda, el usuario otorga su consentimiento expreso para que su información de contacto sea publicada en la plataforma con el objetivo de recibir donaciones.
              </p>
              <p>
                <strong>Protección (Ofuscación):</strong> Para proteger la identidad y privacidad de los titulares de las cuentas de donación, hemos implementado medidas de seguridad visual. Los nombres de los titulares se ofuscan en las vistas públicas (ej. mostrando solo las iniciales o asteriscos) para evitar el perfilamiento o uso indebido de datos por parte de terceros.
              </p>
              <p>
                <strong>Derechos del Titular (Habeas Data):</strong> Usted tiene derecho a conocer, actualizar, rectificar y solicitar la eliminación de sus datos en cualquier momento comunicándose a través de nuestros canales de contacto.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section id="contacto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Contacto y Soporte</h2>
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
              <p className="text-stone-600 mb-6">
                Si detectas alguna irregularidad, deseas dar de baja un perfil, o requieres soporte técnico, puedes contactarnos a través de los siguientes medios:
              </p>
              <div className="flex flex-col md:flex-row gap-6">
                <a href="mailto:colombiasolidariosoporte@gmail.com" className="flex items-center gap-3 bg-white px-4 py-4 rounded-xl border border-stone-200 hover:border-rose-300 hover:shadow-sm transition-all flex-1 min-w-0">
                  <Mail className="w-6 h-6 text-rose-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-stone-500">Correo Electrónico</p>
                    <p className="font-medium text-gray-900 break-all">colombiasolidariosoporte@gmail.com</p>
                  </div>
                </a>
                <a href="wa.link/2jrznk" className="flex items-center gap-3 bg-white px-4 py-4 rounded-xl border border-stone-200 hover:border-emerald-300 hover:shadow-sm transition-all flex-1 min-w-0">
                  <Phone className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-stone-500">Teléfono / WhatsApp</p>
                    <p className="font-medium text-gray-900 break-all">318 3109623</p>
                  </div>
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
