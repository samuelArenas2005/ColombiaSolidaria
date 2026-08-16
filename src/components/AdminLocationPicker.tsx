import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { Search, MapPin, Navigation, ExternalLink, Locate, Loader2, Check } from 'lucide-react';
import { BusinessLocation } from '../data/businesses';

interface AdminLocationPickerProps {
  location?: BusinessLocation;
  onChange: (loc: BusinessLocation | undefined) => void;
  businessName?: string;
}

export default function AdminLocationPicker({
  location,
  onChange,
  businessName
}: AdminLocationPickerProps) {
  const [hasLocation, setHasLocation] = useState<boolean>(Boolean(location));
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ name: string; address?: string; lat: number; lng: number }>>([]);
  const [customAddress, setCustomAddress] = useState(location?.address || '');
  const [customPlaceName, setCustomPlaceName] = useState(location?.placeName || '');

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerInstance = useRef<L.Marker | null>(null);

  // Sync internal state when external location prop changes
  useEffect(() => {
    if (location) {
      setHasLocation(true);
      setCustomAddress(location.address || '');
      setCustomPlaceName(location.placeName || '');
    }
  }, [location]);

  const updateLocationCoords = useCallback((lat: number, lng: number, placeName?: string, address?: string) => {
    const pName = placeName ?? customPlaceName ?? (businessName || 'Negocio Local');
    const addr = address ?? customAddress;
    const roundedLat = Number(lat.toFixed(6));
    const roundedLng = Number(lng.toFixed(6));

    const updated: BusinessLocation = {
      lat: roundedLat,
      lng: roundedLng,
      placeName: pName,
      address: addr,
      googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${roundedLat},${roundedLng}`
    };
    onChange(updated);
  }, [customPlaceName, businessName, customAddress, onChange]);

  // Robust Map Initialization & Resize handling
  useEffect(() => {
    if (!hasLocation) {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerInstance.current = null;
      }
      return;
    }

    let isMounted = true;
    let resizeObserver: ResizeObserver | null = null;

    const initMap = () => {
      if (!isMounted || !mapContainerRef.current) return;

      const container = mapContainerRef.current;

      // Clear any stale Leaflet id if leftover
      if ((container as any)._leaflet_id && !mapInstance.current) {
        delete (container as any)._leaflet_id;
      }

      const initialLat = location?.lat ?? 3.3746;
      const initialLng = location?.lng ?? -76.5336;

      if (!mapInstance.current) {
        const map = L.map(container, {
          center: [initialLat, initialLng],
          zoom: 15,
          zoomControl: true,
          attributionControl: false
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd'
        }).addTo(map);

        const customIcon = L.divIcon({
          html: `
            <div class="flex items-center justify-center -translate-x-1/2 -translate-y-full cursor-grab active:cursor-grabbing">
              <div class="flex items-center justify-center w-9 h-9 rounded-2xl bg-stone-900 border-2 border-white shadow-xl text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            </div>
          `,
          className: 'custom-admin-picker-pin',
          iconSize: [36, 36],
          iconAnchor: [18, 36]
        });

        const marker = L.marker([initialLat, initialLng], {
          icon: customIcon,
          draggable: true
        }).addTo(map);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          updateLocationCoords(pos.lat, pos.lng);
        });

        map.on('click', (e: L.LeafletMouseEvent) => {
          marker.setLatLng(e.latlng);
          updateLocationCoords(e.latlng.lat, e.latlng.lng);
        });

        mapInstance.current = map;
        markerInstance.current = marker;
      } else {
        mapInstance.current.setView([initialLat, initialLng], 15);
        if (markerInstance.current) {
          markerInstance.current.setLatLng([initialLat, initialLng]);
        }
      }

      // Invalidate size immediately and after layout settles
      mapInstance.current.invalidateSize();
      setTimeout(() => {
        if (isMounted && mapInstance.current) {
          mapInstance.current.invalidateSize();
        }
      }, 150);

      // Watch container resize
      if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          if (mapInstance.current) {
            mapInstance.current.invalidateSize();
          }
        });
        resizeObserver.observe(container);
      }
    };

    // Execute in next animation frame to guarantee DOM layout is ready
    const frameId = requestAnimationFrame(initMap);

    return () => {
      isMounted = false;
      cancelAnimationFrame(frameId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstance.current) {
        try {
          mapInstance.current.remove();
        } catch (e) {
          console.warn('Leaflet cleanup notice:', e);
        }
        mapInstance.current = null;
        markerInstance.current = null;
      }
    };
  }, [hasLocation, location?.lat, location?.lng, updateLocationCoords]);

  // Handle GPS location
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }
    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingGPS(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setHasLocation(true);
        updateLocationCoords(lat, lng, customPlaceName || businessName || 'Mi Negocio', customAddress || 'Ubicación actual');
        if (mapInstance.current && markerInstance.current) {
          mapInstance.current.setView([lat, lng], 16, { animate: true });
          markerInstance.current.setLatLng([lat, lng]);
          mapInstance.current.invalidateSize();
        }
      },
      (err) => {
        setIsLocatingGPS(false);
        console.warn('GPS error:', err);
        alert('No se pudo obtener la ubicación GPS automáticamente. Puedes buscar la dirección o hacer clic en el mapa.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSearchPlaces = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults([]);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', Colombia')}&limit=5`
      );
      if (res.ok) {
        const data = await res.json();
        const results = data.map((item: any) => ({
          name: item.display_name.split(',')[0],
          address: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }));
        setSearchResults(results);
      }
    } catch (err) {
      console.error('Error searching place:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectPlace = (place: { name: string; lat: number; lng: number; address?: string }) => {
    setHasLocation(true);
    const shortName = place.name;
    const fullAddr = place.address || place.name;

    setCustomPlaceName(shortName);
    setCustomAddress(fullAddr);
    setSearchResults([]);
    setSearchQuery('');

    updateLocationCoords(place.lat, place.lng, shortName, fullAddr);

    if (mapInstance.current && markerInstance.current) {
      mapInstance.current.setView([place.lat, place.lng], 16, { animate: true });
      markerInstance.current.setLatLng([place.lat, place.lng]);
      mapInstance.current.invalidateSize();
    }
  };

  const handleToggleEnable = (enable: boolean) => {
    setHasLocation(enable);
    if (!enable) {
      onChange(undefined);
    } else {
      const defLat = 3.3746;
      const defLng = -76.5336;
      const defName = businessName || 'Universidad del Valle - Sede Meléndez, Cali';
      const defAddr = 'Calle 13 # 100-00, Meléndez, Cali, Valle del Cauca';
      setCustomPlaceName(defName);
      setCustomAddress(defAddr);
      updateLocationCoords(defLat, defLng, defName, defAddr);
    }
  };

  const currentLat = location?.lat ?? 3.3746;
  const currentLng = location?.lng ?? -76.5336;
  const directMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${currentLat},${currentLng}`;

  return (
    <div className="space-y-4">
      {/* Header & Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-stone-800">
            Ubicación en el Mapa (Opcional)
          </label>
          <p className="text-xs text-stone-500 mt-0.5">
            Permite a las personas ubicar tu negocio y trazar la ruta en Google Maps.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleToggleEnable(!hasLocation)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm ${
            hasLocation 
              ? 'bg-rose-600 text-white hover:bg-rose-700' 
              : 'bg-stone-100 text-stone-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border border-stone-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          {hasLocation ? (
            <>
              <Check className="w-3.5 h-3.5 text-rose-200" />
              <span>Ubicación Activada</span>
            </>
          ) : (
            <span>+ Agregar Ubicación</span>
          )}
        </button>
      </div>

      {hasLocation && (
        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
          
          {/* Top Actions: Search + GPS */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-stone-700">
                Buscar dirección, negocio o punto de referencia
              </label>
              
              <button
                type="button"
                onClick={handleUseGPS}
                disabled={isLocatingGPS}
                className="text-[11px] font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1.5 bg-white hover:bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200 transition-colors shadow-sm"
              >
                {isLocatingGPS ? <Loader2 className="w-3 h-3 animate-spin text-stone-600" /> : <Locate className="w-3 h-3 text-stone-600" />}
                <span>Usar mi ubicación GPS</span>
              </button>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleSearchPlaces())}
                  placeholder="Ej. Barrio San Antonio Cali, Carrera 10 Jamundí, Calle 13 # 100-00..."
                  className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
              <button
                type="button"
                onClick={handleSearchPlaces}
                disabled={isSearching || !searchQuery.trim()}
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Buscar'}
              </button>
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white rounded-xl border border-stone-200 shadow-lg divide-y divide-stone-100 overflow-hidden max-h-48 overflow-y-auto">
                {searchResults.map((res, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectPlace(res)}
                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-stone-50 text-stone-700 transition-colors flex items-start gap-2"
                  >
                    <MapPin className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-stone-900">{res.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">{res.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Form Fields for Place Name and Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nombre del Punto de Referencia
              </label>
              <input
                type="text"
                value={customPlaceName}
                onChange={e => {
                  setCustomPlaceName(e.target.value);
                  updateLocationCoords(currentLat, currentLng, e.target.value, customAddress);
                }}
                placeholder="Ej. Universidad del Valle - Sede Meléndez"
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Dirección / Barrio
              </label>
              <input
                type="text"
                value={customAddress}
                onChange={e => {
                  setCustomAddress(e.target.value);
                  updateLocationCoords(currentLat, currentLng, customPlaceName, e.target.value);
                }}
                placeholder="Ej. Calle 13 # 100-00, Meléndez, Cali"
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
          </div>

          {/* Interactive Map Container */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-normal text-stone-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                Haz clic en el mapa o arrastra el marcador para fijar la posición exacta
              </span>
              <span className="text-[11px] text-stone-500 font-mono">
                {currentLat.toFixed(4)}, {currentLng.toFixed(4)}
              </span>
            </div>
            
            <div
              ref={mapContainerRef}
              id="admin-leaflet-picker-map"
              className="w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-stone-200 bg-stone-200 shadow-inner relative z-0"
              style={{ minHeight: '260px' }}
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200/60">
            <a
              href={directMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-stone-700 font-medium hover:text-stone-900 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm hover:bg-stone-50 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-stone-600" />
              <span>Verificar ruta en Google Maps</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>

            <button
              type="button"
              onClick={() => handleToggleEnable(false)}
              className="text-xs text-stone-500 hover:text-red-600 font-medium px-2 py-1 transition-colors"
            >
              Quitar ubicación
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
