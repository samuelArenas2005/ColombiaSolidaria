import React, { useState } from 'react';
import BusinessCard from './BusinessCard';
import QuickViewModal from './QuickViewModal';
import { Business, NeedType } from '../data/businesses';
import { Save, ArrowLeft, UploadCloud, X } from 'lucide-react';

interface AdminViewProps {
  onBack: () => void;
}

export default function AdminView({ onBack }: AdminViewProps) {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [formData, setFormData] = useState<Business>({
    id: 'new',
    name: '',
    category: '',
    needType: 'donation',
    description: '',
    fullDescription: '',
    location: { lat: 3.2612, lng: -76.5398 },
    image: '',
    contact: {
      phone: '',
      nequi: '',
      nequiName: '',
      daviplata: '',
      daviplataName: '',
      bancolombia: '',
      bancolombiaName: ''
    },
    products: []
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newProducts = files.map(file => ({
        id: Date.now().toString() + Math.random().toString(),
        image: URL.createObjectURL(file),
        name: 'Foto'
      }));
      setFormData(prev => {
        const updatedProducts = [...prev.products, ...newProducts];
        return {
          ...prev,
          products: updatedProducts,
          image: prev.image ? prev.image : (updatedProducts[0]?.image || '')
        };
      });
    }
  };

  const handleRemoveImage = (id: string) => {
    const updatedProducts = formData.products.filter(p => p.id !== id);
    setFormData(prev => ({
      ...prev,
      products: updatedProducts,
      image: prev.image === prev.products.find(p => p.id === id)?.image ? (updatedProducts[0]?.image || '') : prev.image
    }));
  };

  const handleSetMainImage = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleChange = (field: keyof Business, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field: keyof Business['contact'], value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a la plataforma
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Panel de Administración</h1>
          <p className="text-stone-600 mt-2">Crea un nuevo perfil de negocio afectado. Los cambios se previsualizarán en tiempo real a la derecha.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full lg:w-2/3 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold mb-6 border-b border-stone-100 pb-4 text-gray-900">Información del Negocio</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Nombre del Negocio</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow"
                    placeholder="Ej. Panadería La Esperanza"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Categoría</label>
                  <select 
                    value={formData.category}
                    onChange={e => handleChange('category', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow cursor-pointer"
                  >
                    <option value="">Seleccione una categoría</option>
                    <option value="Alimentos">Alimentos y Víveres</option>
                    <option value="Ropa">Ropa y Textiles</option>
                    <option value="Hogar">Hogar y Construcción</option>
                    <option value="Servicios">Servicios Generales</option>
                    <option value="Salud">Salud y Cuidado</option>
                    <option value="Agro">Agro y Mascotas</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Tipo de Necesidad</label>
                  <select 
                    value={formData.needType}
                    onChange={e => handleChange('needType', e.target.value as NeedType)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow cursor-pointer"
                  >
                    <option value="donation">🔴 Solo Donaciones</option>
                    <option value="sale">🟢 Venta Activa</option>
                  </select>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4 mt-8 border-b border-stone-100 pb-4 text-gray-900">Galería de Imágenes</h2>
              <div className="space-y-4 mb-6">
                <div 
                  className="flex flex-col gap-4 items-center border-2 border-dashed border-stone-300 rounded-2xl p-8 justify-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer" 
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input 
                    id="file-upload" 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileUpload} 
                  />
                  <div className="text-center">
                    <UploadCloud className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                    <span className="text-sm font-bold text-stone-600">Haz clic para subir imágenes</span>
                    <p className="text-xs text-stone-400 mt-1">PNG, JPG, WEBP</p>
                  </div>
                </div>
                
                {formData.products.length > 0 && (
                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x mt-4">
                    {formData.products.map(p => (
                      <div key={p.id} className={`snap-start flex-shrink-0 w-48 relative rounded-xl overflow-hidden border-2 ${formData.image === p.image ? 'border-rose-500' : 'border-stone-200'}`}>
                        <img src={p.image} className="w-full h-32 object-cover" alt="preview" />
                        <div className="absolute top-2 left-2 bg-white/90 rounded px-2 py-1 text-xs shadow-sm">
                          <label className="flex items-center gap-1 cursor-pointer font-bold text-stone-700">
                            <input type="radio" name="mainImage" checked={formData.image === p.image} onChange={() => handleSetMainImage(p.image)} className="text-rose-500 focus:ring-rose-500" />
                            Principal
                          </label>
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveImage(p.id); }} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Descripción Corta (Mostrada en la tarjeta)</label>
                <textarea 
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                  rows={2}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow resize-none"
                  placeholder="Perdimos el horno por daños estructurales. Necesitamos fondos para repararlo."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Historia Completa (Mostrada en Vista Rápida)</label>
                <textarea 
                  value={formData.fullDescription}
                  onChange={e => handleChange('fullDescription', e.target.value)}
                  rows={4}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-shadow resize-none"
                  placeholder="Nuestra panadería ha estado en el centro de Jamundí por más de 15 años..."
                />
              </div>

              <h2 className="text-xl font-bold mb-6 mt-8 border-b border-stone-100 pb-4 text-gray-900">Contacto y Donaciones</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-stone-700 mb-2">WhatsApp de Contacto</label>
                <input 
                  type="text"
                  value={formData.contact.phone}
                  onChange={e => handleContactChange('phone', e.target.value)}
                  className="w-full md:w-1/2 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                  placeholder="3001234567"
                />
              </div>

              <div className="space-y-6">
                {/* Nequi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-stone-100">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Número Nequi</label>
                    <input type="text" value={formData.contact.nequi || ''} onChange={e => handleContactChange('nequi', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500 transition-shadow" placeholder="3001234567" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Titular Nequi</label>
                    <input type="text" value={formData.contact.nequiName || ''} onChange={e => handleContactChange('nequiName', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500 transition-shadow" placeholder="Ej. Juan Perez" />
                  </div>
                </div>

                {/* Daviplata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-stone-100">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Número Daviplata</label>
                    <input type="text" value={formData.contact.daviplata || ''} onChange={e => handleContactChange('daviplata', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500 transition-shadow" placeholder="3001234567" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Titular Daviplata</label>
                    <input type="text" value={formData.contact.daviplataName || ''} onChange={e => handleContactChange('daviplataName', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500 transition-shadow" placeholder="Ej. Maria Lopez" />
                  </div>
                </div>

                {/* Bancolombia */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Cuenta Bancolombia</label>
                    <input type="text" value={formData.contact.bancolombia || ''} onChange={e => handleContactChange('bancolombia', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500 transition-shadow" placeholder="000-000000-00" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Titular Bancolombia</label>
                    <input type="text" value={formData.contact.bancolombiaName || ''} onChange={e => handleContactChange('bancolombiaName', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500 transition-shadow" placeholder="Ej. Carlos Ruiz" />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-gray-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-gray-800 transition-colors shadow-md"
                >
                  <Save className="w-5 h-5" />
                  GUARDAR NEGOCIO
                </button>
              </div>

            </div>
          </div>

          {/* Preview Section */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-8">
              <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">Previsualización de Tarjeta</h3>
              <div className="max-w-sm">
                <BusinessCard 
                  business={formData} 
                  onOpen={() => setShowPreviewModal(true)} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showPreviewModal && (
        <QuickViewModal business={formData} onClose={() => setShowPreviewModal(false)} />
      )}
    </div>
  );
}
