import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Business } from '../data/businesses';

// Default center: Jamundí approx
const DEFAULT_CENTER = { lat: 3.2612, lng: -76.5398 };

interface MapSectionProps {
  businesses: Business[];
  onSelectBusiness: (b: Business) => void;
}

export default function MapSection({ businesses, onSelectBusiness }: MapSectionProps) {
  const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
  const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

  if (!hasValidKey) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 p-8 text-center text-stone-600">
        <h3 className="font-bold text-xl mb-2 text-stone-800">Mapa no disponible</h3>
        <p className="max-w-md">
          Se requiere una API Key de Google Maps Platform para visualizar el mapa interactivo. 
          Agrega tu clave secreta `GOOGLE_MAPS_PLATFORM_KEY` en AI Studio.
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <Map
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={15}
        mapId="JAMUNDI_SOLIDARIO_MAP"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
        disableDefaultUI={true}
        zoomControl={true}
      >
        {businesses.map((business) => {
          const isDonation = business.needType === 'donation';
          return (
            <AdvancedMarker 
              key={business.id} 
              position={business.location} 
              title={business.name}
              onClick={() => onSelectBusiness(business)}
            >
              <Pin 
                background={isDonation ? '#e11d48' : '#10b981'} 
                borderColor={isDonation ? '#be123c' : '#059669'} 
                glyphColor="#fff" 
              />
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  );
}
