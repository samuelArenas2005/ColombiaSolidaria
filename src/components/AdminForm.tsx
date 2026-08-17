import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessCard from './BusinessCard';
import QuickViewModal from './QuickViewModal';
import AdminLocationPicker from './AdminLocationPicker';
import { Business, NeedType } from '../data/businesses';
import { CATEGORIES_DATA } from '../data/categories';
import { 
  Save, 
  ArrowLeft, 
  UploadCloud, 
  X, 
  HandHeart, 
  ShoppingBag, 
  Plus, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  LogOut, 
  User as UserIcon,
  AlertCircle,
  Database,
  Info
} from 'lucide-react';
import { uploadImageToCloudinary } from '../utils/cloudinaryUploader';
import { useBusinesses } from '../context/BusinessContext';

const MAX_IMAGES = 5;

export default function AdminForm() {
  const navigate = useNavigate();
  const { addBusiness, isFirebaseConnected, user, logout } = useBusinesses();

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activePaymentMethods, setActivePaymentMethods] = useState<string[]>([]);
  const [activeSocialLinks, setActiveSocialLinks] = useState<string[]>([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [newSocialLink, setNewSocialLink] = useState('');
  const [pendingFiles, setPendingFiles] = useState<{id: string, file: File}[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<Business>({
    id: 'new',
    name: '',
    category: '',
    needType: 'donation',
    description: '',
    fullDescription: '',
    location: undefined,
    image: '',
    contact: {
      phone: '',
    },
    socials: {},
    products: []
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files) as File[];
    const currentCount = formData.products.length;
    const remainingSlots = MAX_IMAGES - currentCount;

    if (remainingSlots <= 0) {
      alert(`Has alcanzado el límite máximo de ${MAX_IMAGES} imágenes por negocio.`);
      e.target.value = '';
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      alert(`Se procesarán solo ${remainingSlots} imagen(es) para no superar el límite de ${MAX_IMAGES}.`);
    }

    const newPendingItems = filesToProcess.map((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      return { id, file };
    });

    const newProducts = newPendingItems.map(item => ({
      id: item.id,
      image: URL.createObjectURL(item.file),
      name: item.file.name
    }));

    setPendingFiles(prev => [...prev, ...newPendingItems]);
    setFormData(prev => {
      const updatedProducts = [...prev.products, ...newProducts].slice(0, MAX_IMAGES);
      return {
        ...prev,
        products: updatedProducts,
        image: prev.image && prev.image.trim() !== '' ? prev.image : (updatedProducts[0]?.image || '')
      };
    });

    e.target.value = '';
  };

  const handleRemoveImage = (id: string) => {
    const productToRemove = formData.products.find(p => p.id === id);
    if (productToRemove && productToRemove.image.startsWith('blob:')) {
      URL.revokeObjectURL(productToRemove.image);
    }

    setPendingFiles(prev => prev.filter(f => f.id !== id));
    const updatedProducts = formData.products.filter(p => p.id !== id);
    setFormData(prev => ({
      ...prev,
      products: updatedProducts,
      image: prev.image === productToRemove?.image ? (updatedProducts[0]?.image || '') : prev.image
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

  const handleSocialChange = (field: keyof NonNullable<Business['socials']>, value: string) => {
    setFormData(prev => ({
      ...prev,
      socials: { ...prev.socials, [field]: value }
    }));
  };

  const addPaymentMethod = () => {
    if (newPaymentMethod && !activePaymentMethods.includes(newPaymentMethod)) {
      setActivePaymentMethods([...activePaymentMethods, newPaymentMethod]);
      setNewPaymentMethod('');
    }
  };

  const removePaymentMethod = (method: string) => {
    setActivePaymentMethods(activePaymentMethods.filter(m => m !== method));
    setFormData(prev => {
      const updatedContact = { ...prev.contact };
      delete updatedContact[method as keyof typeof updatedContact];
      delete updatedContact[`${method}Name` as keyof typeof updatedContact];
      return { ...prev, contact: updatedContact };
    });
  };

  const addSocialLink = () => {
    if (newSocialLink && !activeSocialLinks.includes(newSocialLink)) {
      setActiveSocialLinks([...activeSocialLinks, newSocialLink]);
      setNewSocialLink('');
    }
  };

  const removeSocialLink = (network: string) => {
    setActiveSocialLinks(activeSocialLinks.filter(n => n !== network));
    setFormData(prev => {
      const updatedSocials = { ...prev.socials };
      delete updatedSocials[network as keyof typeof updatedSocials];
      return { ...prev, socials: updatedSocials };
    });
  };

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    if (!formData.name.trim()) {
      setSaveErrorMsg('Por favor ingresa el nombre del negocio.');
      return;
    }

    if (!formData.category) {
      setSaveErrorMsg('Por favor selecciona una categoría.');
      return;
    }

    if (!formData.description.trim()) {
      setSaveErrorMsg('Por favor incluye una descripción corta.');
      return;
    }

    setIsSaving(true);

    try {
      let finalProducts = [...formData.products];
      let mainImageUrl = formData.image;

      // 1. Process pending images (Upload to Cloudinary)
      if (pendingFiles.length > 0) {
        try {
          const uploadPromises = pendingFiles.map(async (item) => {
            const cloudinaryUrl = await uploadImageToCloudinary(item.file);
            return { id: item.id, url: cloudinaryUrl };
          });

          const uploadedResults = await Promise.all(uploadPromises);

          // Update finalProducts with real Cloudinary URLs
          finalProducts = finalProducts.map(product => {
            const upload = uploadedResults.find(r => r.id === product.id);
            return upload ? { ...product, image: upload.url } : product;
          });

          // Check if main image needs update
          const mainImagePending = uploadedResults.find(r => {
            const product = formData.products.find(p => p.id === r.id);
            return product?.image === formData.image;
          });
          
          if (mainImagePending) {
            mainImageUrl = mainImagePending.url;
          } else if (!mainImageUrl || mainImageUrl.startsWith('blob:')) {
            mainImageUrl = finalProducts[0]?.image || '';
          }
        } catch (uploadErr: any) {
          console.error('Error al subir imágenes a Cloudinary:', uploadErr);
          throw new Error('Hubo un error al guardar la imagen, por favor intenta de nuevo o contacta a soporte.');
        }
      }

      // 2. Prepare final data object
      const businessDataToSave = {
        ...formData,
        image: mainImageUrl,
        products: finalProducts
      };

      // 3. Save to database
      await addBusiness(businessDataToSave);
      
      setSaveSuccessMsg(`¡Negocio "${formData.name}" guardado exitosamente en la base de datos!`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Revoke blob URLs to free memory
      formData.products.forEach(p => {
        if (p.image.startsWith('blob:')) URL.revokeObjectURL(p.image);
      });

      // Reset form
      setFormData({
        id: 'new',
        name: '',
        category: '',
        needType: 'donation',
        description: '',
        fullDescription: '',
        location: undefined,
        image: '',
        contact: {
          phone: '',
        },
        socials: {},
        products: []
      });
      setPendingFiles([]);
      setActivePaymentMethods([]);
      setActiveSocialLinks([]);

      setTimeout(() => {
        setSaveSuccessMsg(null);
      }, 5000);
    } catch (err: any) {
      console.error('Error guardando negocio:', err);
      setSaveErrorMsg(err?.message || 'Error al guardar el negocio. Revisa la conexión o las reglas.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="animate-fadeIn">
      {saveSuccessMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-medium text-emerald-900 flex items-center gap-3 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {saveErrorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-medium text-rose-900 flex items-center gap-3 animate-fadeIn shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{saveErrorMsg}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full lg:w-2/3 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold mb-6 border-b border-stone-100 pb-4 text-stone-900">Información del Negocio</h2>
            
            <form onSubmit={handleSaveBusiness} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Nombre del Negocio *</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-400 transition-shadow text-stone-900"
                    placeholder="Ej. Panadería La Esperanza"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                    <label className="block text-sm font-medium text-stone-700">Categoría *</label>
                    <button
                      type="button"
                      onClick={() => navigate('/categorias')}
                      className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 underline underline-offset-2 transition-colors cursor-pointer"
                      title="Ver guía y subcategorías disponibles"
                    >
                      <Info className="w-3.5 h-3.5 text-stone-400" />
                      <span>Ver guía de categorías</span>
                    </button>
                  </div>
                  <select 
                    required
                    value={formData.category}
                    onChange={e => handleChange('category', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-400 transition-shadow cursor-pointer text-stone-800 font-normal"
                  >
                    <option value="">Seleccione una categoría</option>
                    {CATEGORIES_DATA.map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Need Type Selector */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Tipo de Necesidad</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange('needType', 'donation')}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                      formData.needType === 'donation'
                        ? 'border-rose-500 bg-rose-500 text-white shadow-sm'
                        : 'border-stone-200 bg-stone-50 hover:bg-rose-50/50 hover:border-rose-200 text-stone-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${formData.needType === 'donation' ? 'bg-white/20 text-white' : 'bg-white text-rose-600 border border-stone-200'}`}>
                      <HandHeart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold">Solo Donaciones</p>
                      <p className={`text-[11px] font-normal ${formData.needType === 'donation' ? 'text-rose-100' : 'text-stone-500'}`}>
                        Para reconstrucción y pérdidas totales
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('needType', 'sale')}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                      formData.needType === 'sale'
                        ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                        : 'border-stone-200 bg-stone-50 hover:bg-teal-50/50 hover:border-teal-200 text-stone-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${formData.needType === 'sale' ? 'bg-white/20 text-white' : 'bg-white text-teal-600 border border-stone-200'}`}>
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold">Venta Activa</p>
                      <p className={`text-[11px] font-normal ${formData.needType === 'sale' ? 'text-teal-100' : 'text-stone-500'}`}>
                        Productos y servicios disponibles
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Image Gallery with 5 images maximum constraint */}
              <div className="flex items-center justify-between mb-2 mt-8 border-b border-stone-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">Galería de Imágenes</h2>
                  <p className="text-xs text-stone-500 mt-0.5">Máximo {MAX_IMAGES} fotos por negocio alojadas en Cloudinary</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    formData.products.length >= MAX_IMAGES 
                      ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                      : 'bg-stone-100 text-stone-700 border border-stone-200'
                  }`}>
                    {formData.products.length}/{MAX_IMAGES}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {formData.products.length < MAX_IMAGES ? (
                  <div 
                    className="flex flex-col gap-4 items-center border-2 border-dashed rounded-2xl p-8 justify-center transition-all cursor-pointer border-stone-300 bg-stone-50 hover:bg-stone-100 hover:border-stone-400"
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
                      <span className="text-sm font-medium text-stone-700">Haz clic para añadir hasta {MAX_IMAGES - formData.products.length} fotos</span>
                      <p className="text-xs text-stone-400 mt-1">Las fotos se subirán al servidor al momento de guardar el negocio</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-stone-100 border border-stone-200 rounded-2xl text-xs text-stone-600 flex items-center justify-between">
                    <span className="font-semibold">Límite alcanzado: {MAX_IMAGES} de {MAX_IMAGES} fotos añadidas</span>
                    <span className="text-[11px] text-stone-500">Elimina una foto si deseas añadir otra diferente</span>
                  </div>
                )}
                
                {formData.products.length > 0 && (
                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x mt-4">
                    {formData.products.map(p => (
                      <div key={p.id} className={`snap-start flex-shrink-0 w-48 relative rounded-xl overflow-hidden border-2 ${formData.image === p.image ? 'border-stone-900' : 'border-stone-200'}`}>
                        {p.image && p.image.trim() !== '' ? (
                          <img src={p.image} className="w-full h-32 object-cover" alt="preview" />
                        ) : (
                          <div className="w-full h-32 bg-stone-100 flex items-center justify-center text-xs text-stone-400">Sin foto</div>
                        )}
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs rounded px-2 py-1 text-xs shadow-sm">
                          <label className="flex items-center gap-1 cursor-pointer font-medium text-stone-700">
                            <input type="radio" name="mainImage" checked={formData.image === p.image} onChange={() => handleSetMainImage(p.image)} className="text-stone-900 focus:ring-stone-400" />
                            Principal
                          </label>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs text-stone-100 rounded px-1.5 py-0.5 text-[10px] font-mono font-medium shadow-xs">
                          WEBP
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveImage(p.id); }} className="absolute top-2 right-2 bg-stone-900/80 hover:bg-red-600 text-white p-1 rounded-full shadow transition-colors"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Descripción Corta *</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                  rows={2}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-400 transition-shadow resize-none text-stone-900"
                  placeholder="Perdimos el horno por daños estructurales. Necesitamos fondos para repararlo."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Historia Completa</label>
                <textarea 
                  value={formData.fullDescription}
                  onChange={e => handleChange('fullDescription', e.target.value)}
                  rows={4}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-400 transition-shadow resize-none text-stone-900"
                  placeholder="Cuéntanos con detalle la situación del negocio, cuántas familias dependen de él y cómo se utilizarán los fondos..."
                />
              </div>

              {/* Location Picker with GPS & Autocomplete */}
              <div className="mt-8">
                <AdminLocationPicker 
                  location={formData.location}
                  onChange={(loc) => handleChange('location', loc)}
                />
              </div>

              {/* Verified Contact & Banking Details */}
              <h2 className="text-xl font-bold mb-6 mt-8 border-b border-stone-100 pb-4 text-stone-900">Contacto y Métodos de Pago</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Teléfono / WhatsApp *</label>
                  <input 
                    type="tel"
                    required
                    value={formData.contact.phone}
                    onChange={e => handleContactChange('phone', e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-400 transition-shadow text-stone-900"
                    placeholder="300 123 4567"
                  />
                </div>
              </div>

              {/* Dynamic Payment Gateways */}
              <div className="space-y-4 mt-6">
                {activePaymentMethods.map(method => (
                  <div key={method} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 relative">
                    <button 
                      type="button" 
                      onClick={() => removePaymentMethod(method)}
                      className="absolute top-4 right-4 text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h4 className="font-semibold text-stone-800 text-sm mb-3 capitalize">{method}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">Número / Llave</label>
                        <input 
                          type="text" 
                          value={(formData.contact as any)[method] || ''} 
                          onChange={e => handleContactChange(method as any, e.target.value)}
                          className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-stone-400 outline-none"
                          placeholder="Número o llave"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">Titular de la cuenta</label>
                        <input 
                          type="text" 
                          value={(formData.contact as any)[`${method}Name`] || ''} 
                          onChange={e => handleContactChange(`${method}Name` as any, e.target.value)}
                          className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 focus:ring-2 focus:ring-stone-400 outline-none"
                          placeholder="Nombre del titular"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <select 
                    value={newPaymentMethod}
                    onChange={e => setNewPaymentMethod(e.target.value)}
                    className="w-full sm:flex-1 sm:w-auto bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-400 transition-shadow cursor-pointer text-stone-800 font-normal"
                  >
                    <option value="">Añadir método de pago...</option>
                    {!activePaymentMethods.includes('nequi') && <option value="nequi">Nequi</option>}
                    {!activePaymentMethods.includes('daviplata') && <option value="daviplata">Daviplata</option>}
                    {!activePaymentMethods.includes('bancolombia') && <option value="bancolombia">Bancolombia</option>}
                    {!activePaymentMethods.includes('llaveBreB') && <option value="llaveBreB">Bre-B (Llave Banco)</option>}
                  </select>
                  <button 
                    type="button" 
                    onClick={addPaymentMethod}
                    disabled={!newPaymentMethod}
                    className="bg-stone-900 text-white font-medium py-3 px-6 rounded-xl hover:bg-stone-800 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir</span>
                  </button>
                </div>
              </div>

              {/* Social Networks */}
              <h2 className="text-xl font-bold mb-6 mt-8 border-b border-stone-100 pb-4 text-stone-900">Redes Sociales y Web</h2>
              
              <div className="space-y-4 mb-6">
                {activeSocialLinks.map(network => (
                  <div key={network} className="relative flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-stone-700 mb-1">{network.charAt(0).toUpperCase() + network.slice(1)}</label>
                      <input 
                        type="text" 
                        value={(formData.socials as any)[network] || ''} 
                        onChange={e => handleSocialChange(network as any, e.target.value)} 
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-stone-400 transition-shadow text-stone-900" 
                        placeholder={network === 'website' ? 'https://...' : '@usuario'} 
                      />
                    </div>
                    <button type="button" onClick={() => removeSocialLink(network)} className="mt-5 text-stone-400 hover:text-red-500 transition-colors bg-stone-100 hover:bg-red-50 p-3 rounded-xl"><X className="w-5 h-5" /></button>
                  </div>
                ))}
                
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <select 
                    value={newSocialLink} 
                    onChange={e => setNewSocialLink(e.target.value)}
                    className="w-full sm:flex-1 sm:w-auto bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-400 transition-shadow cursor-pointer text-stone-800 font-normal"
                  >
                    <option value="">Añadir red social...</option>
                    {!activeSocialLinks.includes('instagram') && <option value="instagram">Instagram</option>}
                    {!activeSocialLinks.includes('facebook') && <option value="facebook">Facebook</option>}
                    {!activeSocialLinks.includes('tiktok') && <option value="tiktok">TikTok</option>}
                    {!activeSocialLinks.includes('website') && <option value="website">Sitio Web</option>}
                  </select>
                  <button 
                    type="button" 
                    onClick={addSocialLink}
                    disabled={!newSocialLink}
                    className="bg-stone-900 text-white font-medium py-3 px-6 rounded-xl hover:bg-stone-800 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir</span>
                  </button>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-stone-900 text-white font-medium py-2 px-5 rounded-lg hover:bg-stone-800 transition-colors shadow-sm disabled:opacity-60 text-sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Crear y guardar negocio</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Preview Section */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-8">
              <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">Previsualización de Tarjeta</h3>
              <div className="max-w-sm">
                <BusinessCard 
                  business={formData} 
                  onOpen={() => setShowPreviewModal(true)} 
                />
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
