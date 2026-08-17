export type NeedType = 'donation' | 'sale';

export interface Product {
  id: string;
  image: string;
  name: string;
}

export interface BusinessLocation {
  lat: number;
  lng: number;
  address?: string;
  placeName?: string;
  googleMapsUrl?: string;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  needType: NeedType;
  description: string;
  fullDescription: string;
  location?: BusinessLocation;
  image: string;
  contact: {
    phone: string;
    nequi?: string;
    nequiName?: string;
    daviplata?: string;
    daviplataName?: string;
    bancolombia?: string;
    bancolombiaName?: string;
    llaveBreB?: string;
    llaveBreBName?: string;
  };
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    website?: string;
  };
  products: Product[];
}

export interface AuditLog {
  id: string;
  businessName: string;
  action: 'CREATE' | 'DELETE';
  userEmail: string;
  timestamp: string;
}

export const businesses: Business[] = [];
