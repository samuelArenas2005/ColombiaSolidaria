export interface CategoryDefinition {
  id: string;
  name: string;
  description: string;
  iconName: string;
  subcategories: string[];
}

export const CATEGORIES_DATA: CategoryDefinition[] = [
  {
    id: 'alimentacion-gastronomia',
    name: 'Alimentación y Gastronomía',
    description: 'Establecimientos de preparación y consumo de alimentos y bebidas en el sitio o para llevar.',
    iconName: 'Utensils',
    subcategories: [
      'Panadería / Pastelería',
      'Restaurante / Comedor',
      'Comidas Rápidas / Pizzería',
      'Cafetería / Heladería'
    ]
  },
  {
    id: 'abastecimiento-tiendas',
    name: 'Abastecimiento y Tiendas',
    description: 'Comercio de productos de primera necesidad, víveres frescos y despensa del hogar.',
    iconName: 'ShoppingBag',
    subcategories: [
      'Tienda de Barrio / Abarrotes',
      'Minimarket / Supermercado local',
      'Fruver / Verdulería',
      'Carnicería / Salsamentaria'
    ]
  },
  {
    id: 'construccion-reparacion-vehiculos',
    name: 'Construcción, Reparación y Vehículos',
    description: 'Herramientas, materiales, talleres de mantenimiento mecánico y servicios técnicos.',
    iconName: 'Wrench',
    subcategories: [
      'Ferretería / Materiales de construcción',
      'Venta de Pinturas y Acabados',
      'Taller Mecánico / Repuestos de Motos y Autos',
      'Cerrajería / Vidriería / Carpintería'
    ]
  },
  {
    id: 'belleza-cuidado-salud',
    name: 'Belleza, Cuidado y Salud',
    description: 'Servicios de cuidado personal, bienestar, medicamentos y estética integral.',
    iconName: 'Sparkles',
    subcategories: [
      'Peluquería / Salón de Belleza',
      'Barbería',
      'Farmacia / Droguería',
      'Spa / Centro de Estética / Uñas'
    ]
  },
  {
    id: 'comercio-general-ropa',
    name: 'Comercio General y Ropa',
    description: 'Venta de prendas, calzado, útiles, papelería y artículos de uso diario.',
    iconName: 'Store',
    subcategories: [
      'Tienda de Ropa / Boutique',
      'Zapatería / Calzado',
      'Papelería / Miscelánea / Internet',
      'Veterinaria / Tienda de Mascotas'
    ]
  },
  {
    id: 'servicios-varios',
    name: 'Servicios Varios',
    description: 'Arreglos de prendas, mantenimiento textil, lavanderías y oficios especializados.',
    iconName: 'Briefcase',
    subcategories: [
      'Lavandería / Tintorería',
      'Modistería / Confección y Arreglos',
      'Otro (Especificar en la descripción)'
    ]
  },
  {
    id: 'artesanias-manualidades',
    name: 'Artesanías y Manualidades',
    description: 'Piezas hechas a mano, técnicas tradicionales, trabajo en fibras, madera, resina y modelado.',
    iconName: 'Palette',
    subcategories: [
      'Artesanías tradicionales / Manualidades en general',
      'Tejidos (Crochet, Macramé, Dos agujas, Bordado)',
      'Cerámica, Alfarería y Modelado',
      'Trabajo en madera / Carpintería artesanal',
      'Arte en Resina y Arcilla polimérica'
    ]
  },
  {
    id: 'moda-artesanal-accesorios',
    name: 'Moda Artesanal y Accesorios',
    description: 'Joyería y orfebrería de autor, marroquinería artesanal y complementos de moda.',
    iconName: 'Gem',
    subcategories: [
      'Bisutería y Joyería artesanal (Pulseras, collares, aretes)',
      'Elaboración de bolsos, telares y marroquinería',
      'Accesorios para el cabello (Moños, diademas, balacas)'
    ]
  },
  {
    id: 'decoracion-bienestar-hogar',
    name: 'Decoración y Bienestar (Hogar)',
    description: 'Elementos decorativos para el hogar, bienestar aromático, cosmética artesanal y plantas.',
    iconName: 'Home',
    subcategories: [
      'Velas artesanales y Aromaterapia',
      'Decoración para el hogar (Cuadros, espejos, adornos caseros)',
      'Cosmética natural y Jabones artesanales',
      'Vivero casero / Venta de plantas y macetas decoradas'
    ]
  },
  {
    id: 'regalos-eventos',
    name: 'Regalos y Eventos',
    description: 'Detalles personalizados, anchetas, papelería especial y elementos para celebraciones.',
    iconName: 'Gift',
    subcategories: [
      'Desayunos sorpresa, Anchetas y Regalos personalizados',
      'Papelería creativa, Encuadernación y Empaques',
      'Piñatería artesanal y Decoración para fiestas'
    ]
  },
  {
    id: 'alimentos-caseros',
    name: 'Alimentos Caseros (Por encargo / No restaurante)',
    description: 'Preparaciones culinarias caseras elaboradas bajo pedido o venta artesanal empacada.',
    iconName: 'Cookie',
    subcategories: [
      'Repostería y Postres caseros por encargo',
      'Salsas, Mermeladas, Dips y Conservas artesanales',
      'Snacks y pasabocas caseros'
    ]
  },
  {
    id: 'alojamiento-turismo',
    name: 'Alojamiento y Turismo',
    description: 'Servicios de hospedaje, turismo y descanso para viajeros y visitantes.',
    iconName: 'Map',
    subcategories: [
      'Hotel / Hostal',
      'Hospedaje familiar / Posada',
      'Finca Turística / Zona de Camping'
    ]
  },
  {
    id: 'transporte-logistica',
    name: 'Transporte y Logística (Vehículos de trabajo)',
    description: 'Servicios de movilización de pasajeros, carga, trasteos y domicilios.',
    iconName: 'Truck',
    subcategories: [
      'Transporte de Pasajeros (Taxi, plataformas, transporte escolar)',
      'Transporte de Carga / Fletes / Mudanzas',
      'Mensajería y Domicilios (Motos y bicicletas de trabajo)'
    ]
  }
];

export const MAIN_CATEGORY_NAMES = CATEGORIES_DATA.map(cat => cat.name);
