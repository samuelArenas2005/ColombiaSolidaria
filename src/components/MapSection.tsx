import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { Business } from '../data/businesses';
import { Navigation, Eye, MapPin, Compass, ExternalLink, X, Bug, Check, Locate, Loader2 } from 'lucide-react';

// Default center: Cali / Jamundí region (Fallback point)
const DEFAULT_CENTER: [number, number] = [3.3746, -76.5336]; // Univalle Melendez / Cali-Jamundi corridor
const DEFAULT_ZOOM = 13;

// 35 Test points across Cali & Jamundí for debugging cluster bubbles
const DEBUG_CALI_POINTS: Business[] = [
  // San Antonio & Centro Cali (Cluster A)
  { id: 'dbg-1', name: 'Punto de Prueba San Antonio 1', category: 'Alimentos', needType: 'donation', description: '', fullDescription: '', location: { lat: 3.4485, lng: -76.5415, placeName: 'San Antonio', address: 'Carrera 10 # 2-30', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-2', name: 'Punto de Prueba San Antonio 2', category: 'Servicios', needType: 'sale', description: '', fullDescription: '', location: { lat: 3.4470, lng: -76.5425, placeName: 'Colina San Antonio', address: 'Calle 1 # 11-10', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-3', name: 'Punto de Prueba La Merced', category: 'Ropa', needType: 'donation', description: '', fullDescription: '', location: { lat: 3.4512, lng: -76.5360, placeName: 'La Merced', address: 'Calle 7 # 3-40', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-4', name: 'Punto de Prueba Centro 1', category: 'Hogar', needType: 'sale', description: '', fullDescription: '', location: { lat: 3.4490, lng: -76.5310, placeName: 'Centro', address: 'Carrera 5 # 11-20', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-5', name: 'Punto de Prueba San Cayetano', category: 'Alimentos', needType: 'donation', description: '', fullDescription: '', location: { lat: 3.4435, lng: -76.5430, placeName: 'San Cayetano', address: 'Carrera 12 # 4-50', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  
  // Granada & Versalles (Cluster B)
  { id: 'dbg-6', name: 'Punto de Prueba Granada 1', category: 'Alimentos', needType: 'sale', description: '', fullDescription: '', location: { lat: 3.4610, lng: -76.5345, placeName: 'Granada', address: 'Avenida 9N # 12-40', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-7', name: 'Punto de Prueba Granada 2', category: 'Servicios', needType: 'donation', description: '', fullDescription: '', location: { lat: 3.4625, lng: -76.5330, placeName: 'Granada Norte', address: 'Avenida 9AN # 14-22', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-8', name: 'Punto de Prueba Versalles', category: 'Salud', needType: 'sale', description: '', fullDescription: '', location: { lat: 3.4650, lng: -76.5290, placeName: 'Versalles', address: 'Calle 21N # 5N-15', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-9', name: 'Punto de Prueba Santa Mónica', category: 'Ropa', needType: 'donation', description: '', fullDescription: '', location: { lat: 3.4690, lng: -76.5270, placeName: 'Santa Mónica', address: 'Calle 28N # 6-30', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  
  // Tequendama & San Fernando (Cluster C)
  { id: 'dbg-10', name: 'Punto de Prueba Tequendama 1', category: 'Salud', needType: 'sale', description: '', fullDescription: '', location: { lat: 3.4210, lng: -76.5410, placeName: 'Tequendama', address: 'Calle 5B5 # 42-10', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-11', name: 'Punto de Prueba Tequendama 2', category: 'Alimentos', needType: 'donation', description: '', fullDescription: '', location: { lat: 3.4190, lng: -76.5395, placeName: 'Tequendama Sur', address: 'Carrera 44 # 5-20', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-12', name: 'Punto de Prueba San Fernando', category: 'Servicios', needType: 'sale', description: '', fullDescription: '', location: { lat: 3.4290, lng: -76.5450, placeName: 'San Fernando', address: 'Calle 4B # 36-00', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-13', name: 'Punto de Prueba Eucarístico', category: 'Hogar', needType: 'donation', description: '', fullDescription: '', location: { lat: 3.4250, lng: -76.5360, placeName: 'El Templete', address: 'Calle 9 # 38-12', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },

  // Meléndez, Univalle & Pasoancho (Cluster D)
  { id: 'dbg-14', name: 'Punto de Prueba Univalle Norte', category: 'Alimentos', needType: 'donation', description: '', fullDescription: '', location: { lat: 3.3760, lng: -76.5340, placeName: 'Univalle Portería Peatonal', address: 'Calle 13 # 100-00', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-15', name: 'Punto de Prueba Meléndez Alto', category: 'Ropa', needType: 'donation', description: '', fullDescription: '', location: { lat: 3.3710, lng: -76.5420, placeName: 'Meléndez', address: 'Carrera 94 # 4-20', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-16', name: 'Punto de Prueba Mayapán Las Vegas', category: 'Servicios', needType: 'sale', description: '', fullDescription: '', location: { lat: 3.3820, lng: -76.5380, placeName: 'Mayapán', address: 'Calle 10 # 85-30', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-17', name: 'Punto de Prueba Pasoancho 100', category: 'Alimentos', needType: 'sale', description: '', fullDescription: '', location: { lat: 3.3790, lng: -76.5300, placeName: 'Pasoancho', address: 'Calle 13 # 98-40', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-18', name: 'Punto de Prueba Capri', category: 'Hogar', needType: 'donation', description: '', fullDescription: '', location: { lat: 3.3900, lng: -76.5410, placeName: 'Capri', address: 'Carrera 78 # 10-15', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },

  // Ciudad Jardín & Pance (Cluster E)
  { id: 'dbg-19', name: 'Punto de Prueba Ciudad Jardín 1', category: 'Alimentos', needType: 'sale', description: '', fullDescription: '', location: { lat: 3.3600, lng: -76.5310, placeName: 'Ciudad Jardín', address: 'Avenida San Joaquín # 14-20', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-20', name: 'Punto de Prueba Ciudad Jardín 2', category: 'Servicios', needType: 'donation', description: '', fullDescription: '', location: { lat: 3.3570, lng: -76.5280, placeName: 'Ciudad Jardín Sur', address: 'Calle 16 # 105-30', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-21', name: 'Punto de Prueba Pance Entrada', category: 'Agro', needType: 'sale', description: '', fullDescription: '', location: { lat: 3.3450, lng: -76.5350, placeName: 'Pance', address: 'Vía La Vorágine Km 2', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },

  // Jamundí (Cluster F - 10 puntos concentrados)
  { id: 'dbg-22', name: 'Punto de Prueba Jamundí Centro 1', category: 'Alimentos', needType: 'donation', description: '', fullDescription: '', location: { lat: 3.2620, lng: -76.5400, placeName: 'Parque Principal Jamundí', address: 'Calle 10 con Carrera 10', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-23', name: 'Punto de Prueba Jamundí Centro 2', category: 'Ropa', needType: 'donation', description: '', fullDescription: '', location: { lat: 3.2610, lng: -76.5385, placeName: 'Alcaldía Jamundí', address: 'Calle 11 # 9-40', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-24', name: 'Punto de Prueba Jamundí Galería', category: 'Alimentos', needType: 'sale', description: '', fullDescription: '', location: { lat: 3.2635, lng: -76.5420, placeName: 'Galería Central', address: 'Carrera 12 # 8-20', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-25', name: 'Punto de Prueba Alfaguara 1', category: 'Servicios', needType: 'sale', description: '', fullDescription: '', location: { lat: 3.2760, lng: -76.5440, placeName: 'CC Alfaguara', address: 'Av. Cañasgordas # 12-00', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-26', name: 'Punto de Prueba Alfaguara 2', category: 'Hogar', needType: 'donation', description: '', fullDescription: '', location: { lat: 3.2780, lng: -76.5460, placeName: 'Sector Alfaguara', address: 'Carrera 2 Oeste # 14-50', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-27', name: 'Punto de Prueba Terranova Jamundí', category: 'Alimentos', needType: 'donation', description: '', fullDescription: '', location: { lat: 3.2510, lng: -76.5330, placeName: 'Terranova', address: 'Manzana B Casa 12', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-28', name: 'Punto de Prueba Sachamate', category: 'Agro', needType: 'sale', description: '', fullDescription: '', location: { lat: 3.2840, lng: -76.5390, placeName: 'Sachamate', address: 'Vía Panamericana Km 14', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-29', name: 'Punto de Prueba Bonanza Jamundí', category: 'Salud', needType: 'donation', description: '', fullDescription: '', location: { lat: 3.2560, lng: -76.5460, placeName: 'Bonanza', address: 'Carrera 15 # 5-18', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] },
  { id: 'dbg-30', name: 'Punto de Prueba El Rodeo Jamundí', category: 'Ropa', needType: 'sale', description: '', fullDescription: '', location: { lat: 3.2670, lng: -76.5360, placeName: 'El Rodeo', address: 'Calle 15 # 8-05', googleMapsUrl: '' }, image: '', contact: { phone: '' }, socials: {}, products: [] }
];

interface MapSectionProps {
  businesses: Business[];
  onSelectBusiness: (b: Business) => void;
  focusedBusiness?: Business | null;
  onClearFocus?: () => void;
  isModalOpen?: boolean;
}

export default function MapSection({
  businesses,
  onSelectBusiness,
  focusedBusiness,
  onClearFocus,
  isModalOpen
}: MapSectionProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<any>(null);
  const markersMapRef = useRef<{ [id: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const hasInitialLocatedRef = useRef<boolean>(false);
  
  const [activePopupBusiness, setActivePopupBusiness] = useState<Business | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Close floating map card when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setActivePopupBusiness(null);
    }
  }, [isModalOpen]);

  // Helper to render or update the user's location pulsing marker
  const renderOrUpdateUserMarker = useCallback((coords: [number, number], map: L.Map) => {
    if (!map || !(map as any)._container) return;

    if (userMarkerRef.current) {
      try {
        userMarkerRef.current.setLatLng(coords);
      } catch (e) {
        console.warn('Error setting marker position:', e);
      }
      return;
    }

    const userIconHtml = `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group select-none">
        <div class="absolute w-10 h-10 rounded-full bg-blue-500/25 animate-ping"></div>
        <div class="absolute w-8 h-8 rounded-full bg-blue-500/35 animate-pulse"></div>
        <div class="relative w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center">
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userIconHtml,
      className: 'custom-user-location-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    try {
      const marker = L.marker(coords, {
        icon: userIcon,
        zIndexOffset: 2000
      }).addTo(map);

      marker.bindTooltip('Tu ubicación actual', {
        direction: 'top',
        offset: [0, -12],
        className: 'px-2.5 py-1 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-lg border border-stone-700'
      });

      marker.on('click', () => {
        if ((map as any)._container) {
          map.setView(coords, Math.max(map.getZoom(), 15), { animate: true });
        }
      });

      userMarkerRef.current = marker;
    } catch (e) {
      console.warn('Error adding user marker:', e);
    }
  }, []);

  // Detect dark mode
  useEffect(() => {
    const checkDark = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                     document.documentElement.classList.contains('a11y-dark');
      setIsDarkMode(isDark);
    };

    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const container = mapContainerRef.current;
      if ((container as any)._leaflet_id) {
        delete (container as any)._leaflet_id;
      }

      const map = L.map(container, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.control.attribution({ position: 'bottomleft', prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/" target="_blank">CARTO</a>')
        .addTo(map);

      mapInstanceRef.current = map;

      // Attempt to obtain user's initial GPS location
      if (!hasInitialLocatedRef.current && navigator.geolocation) {
        hasInitialLocatedRef.current = true;
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setIsLocating(false);
            const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
            setUserLocation(coords);
            if (mapInstanceRef.current && (mapInstanceRef.current as any)._container) {
              renderOrUpdateUserMarker(coords, mapInstanceRef.current);
              mapInstanceRef.current.setView(coords, 14, { animate: true });
            }
          },
          (err) => {
            setIsLocating(false);
            console.warn('Permiso de ubicación no concedido o no disponible, usando Cali por defecto:', err);
            if (mapInstanceRef.current && (mapInstanceRef.current as any)._container) {
              mapInstanceRef.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
            }
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      }
    }

    return () => {
      if (userMarkerRef.current && mapInstanceRef.current) {
        try {
          mapInstanceRef.current.removeLayer(userMarkerRef.current);
        } catch (e) { /* ignore */ }
        userMarkerRef.current = null;
      }
      if (clusterGroupRef.current && mapInstanceRef.current) {
        try {
          mapInstanceRef.current.removeLayer(clusterGroupRef.current);
        } catch (e) { /* ignore */ }
        clusterGroupRef.current = null;
      }
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) { /* ignore */ }
        mapInstanceRef.current = null;
      }
    };
  }, [renderOrUpdateUserMarker]);

  // Update Tile Layer on Dark Mode Change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !(map as any)._container) return;

    if (tileLayerRef.current) {
      try {
        map.removeLayer(tileLayerRef.current);
      } catch (e) { /* ignore */ }
    }

    const tileUrl = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd'
    });

    try {
      tileLayer.addTo(map);
      tileLayerRef.current = tileLayer;
      map.invalidateSize();
    } catch (e) {
      console.warn('Tile layer error:', e);
    }
  }, [isDarkMode]);

  // Handle focusedBusiness changes separately
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !(map as any)._container) return;

    if (focusedBusiness && focusedBusiness.location) {
      setActivePopupBusiness(focusedBusiness);
      try {
        map.setView(
          [focusedBusiness.location.lat, focusedBusiness.location.lng], 
          16, 
          { animate: true, duration: 0.8 }
        );
      } catch (e) { /* ignore */ }
    }
  }, [focusedBusiness]);

  // Compute total businesses to display (including debug points if enabled)
  const allDisplayBusinesses = useMemo(() => {
    const validReal = businesses.filter(
      b => b.location && typeof b.location.lat === 'number' && typeof b.location.lng === 'number'
    );
    if (debugMode) {
      return [...validReal, ...DEBUG_CALI_POINTS];
    }
    return validReal;
  }, [businesses, debugMode]);

  // Update Markers with MarkerCluster
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old cluster group if exists
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
      clusterGroupRef.current = null;
    }
    markersMapRef.current = {};

    // Create MarkerClusterGroup with custom bubble styling
    const clusterGroup = (L as any).markerClusterGroup({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyOnMaxZoom: true,
      removeOutsideVisibleBounds: true,
      maxClusterRadius: 55,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        const childMarkers = cluster.getAllChildMarkers();

        let hasDonation = false;
        let hasSale = false;

        childMarkers.forEach((m: any) => {
          const nType = m?.options?.needType || m?.needType;
          if (nType === 'donation') hasDonation = true;
          if (nType === 'sale') hasSale = true;
        });

        let size = 42;
        if (count >= 15) {
          size = 52;
        } else if (count >= 5) {
          size = 46;
        }

        let clusterBg = 'bg-stone-900 text-white';
        let ringBg = 'ring-8 ring-stone-900/20 bg-stone-900/10';

        if (hasDonation && hasSale) {
          // Mixed: Warm light brown / cafe claro beige tone with strong contrast
          clusterBg = 'bg-[#cba175] text-stone-950 font-extrabold';
          ringBg = 'ring-8 ring-[#cba175]/35 bg-[#cba175]/25';
        } else if (hasDonation) {
          // Pure donation
          clusterBg = 'bg-rose-500 text-white';
          ringBg = 'ring-8 ring-rose-500/20 bg-rose-500/10';
        } else if (hasSale) {
          // Pure sale
          clusterBg = 'bg-teal-600 text-white';
          ringBg = 'ring-8 ring-teal-600/20 bg-teal-600/10';
        }

        return L.divIcon({
          html: `
            <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 select-none">
              <div class="absolute inset-0 rounded-full ${ringBg} animate-pulse"></div>
              <div class="flex items-center justify-center rounded-full border-2 border-white dark:border-stone-800 shadow-xl ${clusterBg} font-bold text-xs sm:text-sm tracking-tight" style="width: ${size}px; height: ${size}px;">
                ${count}
              </div>
            </div>
          `,
          className: 'custom-cluster-icon',
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2]
        });
      }
    });

    // Populate cluster group with individual markers
    allDisplayBusinesses.forEach(b => {
      if (!b.location) return;

      const isDonation = b.needType === 'donation';
      const isFocused = focusedBusiness?.id === b.id || activePopupBusiness?.id === b.id;

      const markerColorClass = isDonation 
        ? 'bg-rose-500 border-white text-white' 
        : 'bg-teal-600 border-white text-white';

      const pointerColorClass = isDonation ? 'bg-rose-500' : 'bg-teal-600';

      const customIconHtml = `
        <div class="relative group cursor-pointer flex items-center justify-center -translate-x-1/2 -translate-y-full">
          ${isFocused ? '<div class="absolute -inset-2 rounded-full bg-stone-900/20 animate-ping"></div>' : ''}
          <div class="relative flex items-center justify-center w-10 h-10 rounded-2xl shadow-lg border-2 ${
            isFocused 
              ? `${markerColorClass} scale-110 ring-4 ${isDonation ? 'ring-rose-300' : 'ring-teal-300'}` 
              : markerColorClass
          } transition-transform duration-200 hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 ${pointerColorClass} rotate-45"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customIconHtml,
        className: 'custom-map-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      const marker = L.marker([b.location.lat, b.location.lng], { 
        icon: customIcon,
        needType: b.needType
      } as any);

      (marker as any).needType = b.needType;

      marker.on('click', () => {
        setActivePopupBusiness(b);
        map.setView([b.location!.lat, b.location!.lng], Math.max(map.getZoom(), 15), {
          animate: true,
          duration: 0.8
        });
      });

      clusterGroup.addLayer(marker);
      markersMapRef.current[b.id] = marker;
    });

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    // Pan to focused business if changed
    if (focusedBusiness && focusedBusiness.location) {
      setActivePopupBusiness(focusedBusiness);
      map.setView(
        [focusedBusiness.location.lat, focusedBusiness.location.lng], 
        16, 
        { animate: true, duration: 1 }
      );
    }
  }, [allDisplayBusinesses, focusedBusiness, isDarkMode]);

  const handleDirections = (b: Business) => {
    if (!b.location) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${b.location.lat},${b.location.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleResetView = () => {
    setActivePopupBusiness(null);
    onClearFocus?.();

    const map = mapInstanceRef.current;
    if (!map) return;

    // If we already have the user's GPS coordinates, fly directly to them
    if (userLocation) {
      map.flyTo(userLocation, 15, { animate: true, duration: 0.8 });
      return;
    }

    // If not known yet, request geolocation
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
          renderOrUpdateUserMarker(coords, map);
          map.flyTo(coords, 15, { animate: true, duration: 0.8 });
        },
        (err) => {
          setIsLocating(false);
          console.warn('Ubicación no disponible o denegada. Centrando en punto de prueba Cali:', err);
          map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true, duration: 0.8 });
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true, duration: 0.8 });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[480px] bg-stone-100 dark:bg-stone-900 rounded-3xl overflow-hidden shadow-inner select-none">
      {/* Map DOM target */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Controls Header Badge & Debug Switch */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto z-10 flex flex-wrap items-center gap-2">
        <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{allDisplayBusinesses.length} ubicaciones {debugMode ? '(+30 prueba)' : ''}</span>
        </div>

        <button
          type="button"
          onClick={handleResetView}
          disabled={isLocating}
          className={`backdrop-blur-md px-3 py-1.5 rounded-full border shadow-sm flex items-center gap-1.5 text-xs font-semibold transition-all ${
            userLocation
              ? 'bg-white/95 dark:bg-stone-900/95 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40'
              : 'bg-white/95 dark:bg-stone-900/95 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:text-stone-900 dark:hover:text-white'
          }`}
          title={userLocation ? 'Centrar en mi ubicación actual' : 'Centrar en mi ubicación actual (o Cali)'}
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
          ) : (
            <Locate className="w-3.5 h-3.5" />
          )}
          <span>{userLocation ? 'Mi ubicación' : 'Centrar'}</span>
        </button>
      </div>

      {/* Floating Selected Business Marker Card Popup */}
      {!isModalOpen && activePopupBusiness && activePopupBusiness.location && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white dark:bg-[#181920] rounded-2xl p-5 shadow-2xl border border-stone-200 dark:border-[#272832] text-stone-900 dark:text-stone-100 relative">
            <button
              onClick={() => {
                setActivePopupBusiness(null);
                onClearFocus?.();
              }}
              className="absolute top-3.5 right-3.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3.5 pr-6">
              <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 overflow-hidden flex-shrink-0 border border-stone-200 dark:border-stone-700">
                {activePopupBusiness.image && activePopupBusiness.image.trim() !== '' ? (
                  <img
                    src={activePopupBusiness.image}
                    alt={activePopupBusiness.name || 'Negocio'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <MapPin className="w-5 h-5 text-stone-600 dark:text-stone-300" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium inline-flex items-center gap-1 ${
                    activePopupBusiness.needType === 'donation'
                      ? 'bg-rose-50/80 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40'
                      : 'bg-teal-50/80 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/40'
                  }`}>
                    {activePopupBusiness.needType === 'donation' ? 'Solo Donaciones' : 'Venta Activa'}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-medium truncate">
                    {activePopupBusiness.category}
                  </span>
                </div>

                <h4 className="font-bold text-base text-stone-900 dark:text-white truncate">
                  {activePopupBusiness.name}
                </h4>

                <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-stone-500 flex-shrink-0" />
                  <span className="truncate">
                    {activePopupBusiness.location.placeName || activePopupBusiness.location.address || 'Ubicación verificada'}
                  </span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center gap-2.5">
              <button
                onClick={() => handleDirections(activePopupBusiness)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-colors shadow-sm"
              >
                <Navigation className="w-4 h-4" />
                <span>Cómo llegar</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>

              <button
                onClick={() => {
                  const target = activePopupBusiness;
                  setActivePopupBusiness(null);
                  onClearFocus?.();
                  onSelectBusiness(target);
                }}
                className="inline-flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold py-2.5 px-3.5 rounded-xl text-xs sm:text-sm transition-colors border border-stone-200 dark:border-stone-700"
                title="Ver perfil completo"
              >
                <Eye className="w-4 h-4" />
                <span>Detalles</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
