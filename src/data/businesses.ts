export type NeedType = 'donation' | 'sale';

export interface Product {
  id: string;
  image: string;
  name: string;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  needType: NeedType;
  description: string;
  fullDescription: string;
  location: { lat: number; lng: number };
  image: string;
  contact: {
    phone: string;
    nequi?: string;
    nequiName?: string;
    daviplata?: string;
    daviplataName?: string;
    bancolombia?: string;
    bancolombiaName?: string;
  };
  products: Product[];
}

export const businesses: Business[] = [
  {
    id: 'b1',
    name: 'Panadería La Esperanza',
    category: 'Alimentos',
    needType: 'donation',
    description: 'Perdimos el horno por daños estructurales. Necesitamos fondos para repararlo.',
    fullDescription: 'Nuestra panadería ha estado en el centro de Jamundí por más de 15 años. El sismo agrietó las paredes y destruyó nuestro horno principal, dejando a 5 familias sin su principal fuente de ingreso. Cualquier aporte suma a reconstruir nuestro sueño.',
    location: { lat: 3.2612, lng: -76.5398 }, // Jamundí center approx
    image: 'https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?auto=format&fit=crop&w=600&q=80',
    contact: {
      phone: '3001234567',
      nequi: '3001234567',
      nequiName: 'Maria Esperanza Diaz',
      daviplata: '3001234567',
      daviplataName: 'Carlos Arturo Sanchez',
    },
    products: [
      { id: 'p1', name: 'Pan Aliñado', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80' },
      { id: 'p2', name: 'Buñuelos', image: 'https://images.unsplash.com/photo-1579618218206-a831e79cb5f1?auto=format&fit=crop&w=300&q=80' },
      { id: 'p3', name: 'Pandebonos', image: 'https://images.unsplash.com/photo-1616421946859-99e52c8b8bf3?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'b2',
    name: 'Tienda de Ropa Marta',
    category: 'Ropa y Textiles',
    needType: 'donation',
    description: 'Paredes agrietadas y mercancía sepultada. Ayúdanos a asegurar el local.',
    fullDescription: 'El techo colapsó parcialmente sobre la zona de bodega. Aunque rescatamos parte del inventario, necesitamos asegurar la estructura para poder volver a vender y recuperar nuestro sustento.',
    location: { lat: 3.2650, lng: -76.5410 },
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=600&q=80',
    contact: {
      phone: '3109876543',
      nequi: '3109876543',
      nequiName: 'Marta Elena Restrepo',
    },
    products: [
      { id: 'p4', name: 'Camiseta Básica', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80' },
      { id: 'p5', name: 'Vestido Floral', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80' },
      { id: 'p6', name: 'Jeans Clásicos', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'b3',
    name: 'Peluquería Estilo',
    category: 'Belleza',
    needType: 'sale',
    description: 'Estamos atendiendo a domicilio y vendiendo nuestros productos de cuidado capilar online.',
    fullDescription: 'Aunque nuestro local no puede recibir clientes temporalmente, hemos movilizado nuestro inventario de shampoos, tratamientos y equipos. Apóyanos comprando nuestros kits para seguir trabajando.',
    location: { lat: 3.2580, lng: -76.5360 },
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    contact: {
      phone: '3151122334',
      daviplata: '3151122334',
      daviplataName: 'Rosa Castillo Jimenez',
    },
    products: [
      { id: 'p7', name: 'Kit Hidratación', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80' },
      { id: 'p8', name: 'Plancha Profesional', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'b4',
    name: 'Ferretería El Maestro',
    category: 'Hogar y Construcción',
    needType: 'sale',
    description: 'Punto físico abierto con precauciones. Tenemos materiales para tu reconstrucción.',
    fullDescription: 'Nuestra estructura resistió bien. Estamos operando y ofreciendo materiales de construcción a precios justos para ayudar a la comunidad a reparar sus hogares.',
    location: { lat: 3.2680, lng: -76.5330 },
    image: 'https://images.unsplash.com/photo-1517646287270-a569ca31e6c3?auto=format&fit=crop&w=600&q=80',
    contact: {
      phone: '3205554433',
      bancolombia: '987-654321-00',
      bancolombiaName: 'Ferreteria El Maestro SAS',
    },
    products: [
      { id: 'p9', name: 'Cemento 50kg', image: 'https://images.unsplash.com/photo-1605330882650-51a44fec058b?auto=format&fit=crop&w=300&q=80' },
      { id: 'p10', name: 'Herramientas', image: 'https://images.unsplash.com/photo-1581147036324-c1724cc1e5b1?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  {
    id: 'b5',
    name: 'Café del Parque',
    category: 'Alimentos',
    needType: 'donation',
    description: 'Nuestra máquina de espresso sufrió daños irreversibles. Necesitamos ayuda para reabrir.',
    fullDescription: 'El corazón de nuestro café se apagó con el sismo al caer el estante sobre la máquina principal. Somos el sustento de 3 madres cabeza de familia. Queremos volver a servir los mejores cafés de Jamundí.',
    location: { lat: 3.2625, lng: -76.5385 },
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80',
    contact: {
      phone: '3009998877',
      nequi: '3009998877',
      daviplata: '3009998877'
    },
    products: [
      { id: 'p11', name: 'Café en Grano', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=300&q=80' }
    ]
  }
];
