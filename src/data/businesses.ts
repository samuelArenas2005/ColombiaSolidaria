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
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    website?: string;
  };
  products: Product[];
}

export const businesses: Business[] = [];
