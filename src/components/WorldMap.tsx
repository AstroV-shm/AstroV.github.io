import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

interface WorldMapProps {
  impactLocation: { lat: number; lng: number };
  onLocationSelect: (lat: number, lng: number) => void;
  affectedRadius: number;
  fireballRadius: number;
  thermalRadius: number;
}

export default function WorldMap({
  impactLocation,
  onLocationSelect,
  affectedRadius,
  fireballRadius,
  thermalRadius,
}: WorldMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{
    circles: L.Circle[];
    marker: L.Marker | null;
  }>({ circles: [], marker: null });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [impactLocation.lat, impactLocation.lng],
      zoom: 4,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.circles.forEach(circle => circle.remove());
    if (markersRef.current.marker) {
      markersRef.current.marker.remove();
    }

    const fireballCircle = L.circle([impactLocation.lat, impactLocation.lng], {
      radius: fireballRadius,
      color: '#ef4444',
      fillColor: '#ef4444',
      fillOpacity: 0.5,
      weight: 2,
    }).addTo(mapRef.current);

    const thermalCircle = L.circle([impactLocation.lat, impactLocation.lng], {
      radius: thermalRadius,
      color: '#f97316',
      fillColor: '#f97316',
      fillOpacity: 0.3,
      weight: 2,
    }).addTo(mapRef.current);

    const affectedCircle = L.circle([impactLocation.lat, impactLocation.lng], {
      radius: affectedRadius * 1000,
      color: '#eab308',
      fillColor: '#eab308',
      fillOpacity: 0.15,
      weight: 2,
    }).addTo(mapRef.current);

    const customIcon = L.divIcon({
      html: `<div style="color: #ef4444; filter: drop-shadow(0 0 4px rgba(0,0,0,0.8));">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const marker = L.marker([impactLocation.lat, impactLocation.lng], {
      icon: customIcon,
    })
      .addTo(mapRef.current)
      .bindPopup(`
        <div style="font-family: sans-serif;">
          <strong>Impact Site</strong><br/>
          Lat: ${impactLocation.lat.toFixed(4)}<br/>
          Lng: ${impactLocation.lng.toFixed(4)}
        </div>
      `);

    markersRef.current = {
      circles: [fireballCircle, thermalCircle, affectedCircle],
      marker,
    };

    mapRef.current.setView([impactLocation.lat, impactLocation.lng], mapRef.current.getZoom());
  }, [impactLocation, affectedRadius, fireballRadius, thermalRadius]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden" />

      <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg max-w-xs">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={20} className="text-blue-400" />
          <h3 className="font-bold">Impact Location</h3>
        </div>
        <p className="text-sm text-gray-300 mb-3">
          Click anywhere on the map to select impact site
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Fireball zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span>Thermal radiation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span>Blast damage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
