import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import type { Place, PlaceType } from '../types';
import { createMarkerIcon, TYPE_COLORS, TYPE_LABELS, TYPE_ICONS } from '../utils/mapConfig';

interface MapViewProps {
  places: Place[];
  activeTypes: Set<PlaceType>;
  activeRegions: Set<string>;
  searchQuery: string;
  onSelectPlace: (place: Place) => void;
}

export default function MapView({
  places,
  activeTypes,
  activeRegions,
  searchQuery,
  onSelectPlace,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());

  // ── Initialise map once ────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [65.0, 15.0],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>-Mitwirkende',
      maxZoom: 19,
      crossOrigin: true,
    }).addTo(map);

    const cluster = (L as any).markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 60,
      showCoverageOnHover: false,
      iconCreateFunction: (c: any) => {
        const count = c.getChildCount();
        const size = count < 10 ? 36 : count < 100 ? 44 : 52;
        return L.divIcon({
          html: `<div style="
            background:rgba(29,40,34,0.9);color:#fff;
            width:${size}px;height:${size}px;border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-size:13px;font-weight:700;
            border:2px solid rgba(255,255,255,0.4);
            box-shadow:0 2px 8px rgba(0,0,0,0.5);
          ">${count}</div>`,
          className: '',
          iconSize: [size, size],
        });
      },
    });

    map.addLayer(cluster);
    mapRef.current = map;
    clusterRef.current = cluster;

    return () => {
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
    };
  }, []);

  // ── Re-render markers when filters / data change ───────────────────────────
  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;

    const q = searchQuery.toLowerCase().trim();

    const filtered = places.filter((p) => {
      if (!activeTypes.has(p.type)) return false;
      if (!activeRegions.has(p.region)) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.desc.toLowerCase().includes(q)) return false;
      return true;
    });

    // Remove markers not in filtered set
    markersRef.current.forEach((marker, id) => {
      if (!filtered.find((p) => p.id === id)) {
        cluster.removeLayer(marker);
        markersRef.current.delete(id);
      }
    });

    // Add new markers
    const toAdd: L.Marker[] = [];
    for (const place of filtered) {
      if (markersRef.current.has(place.id)) continue;

      const icon = createMarkerIcon(place.type);
      const marker = L.marker([place.lat, place.lng], { icon });

      const imgHtml = place.img
        ? `<img src="${place.img}" alt="${place.name}" loading="lazy"
             style="width:100%;height:130px;object-fit:cover;border-radius:6px 6px 0 0;display:block;" />`
        : `<div style="width:100%;height:60px;background:linear-gradient(135deg,#1d2822,#2d4a3e);
             border-radius:6px 6px 0 0;display:flex;align-items:center;justify-content:center;
             font-size:32px;">${TYPE_ICONS[place.type]}</div>`;

      marker.bindPopup(
        `<div style="min-width:200px;max-width:240px;font-family:system-ui,sans-serif;">
          ${imgHtml}
          <div style="padding:10px 12px 8px;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
              <span style="background:${TYPE_COLORS[place.type]};color:#fff;font-size:11px;
                padding:2px 7px;border-radius:20px;font-weight:600;white-space:nowrap;">
                ${TYPE_ICONS[place.type]} ${TYPE_LABELS[place.type]}
              </span>
              <span style="font-size:11px;color:#666;">${place.region}</span>
            </div>
            <h3 style="margin:0 0 5px;font-size:15px;font-weight:700;color:#1d2822;">${place.name}</h3>
            <p style="margin:0;font-size:12px;color:#444;line-height:1.5;">${place.desc}</p>
          </div>
        </div>`,
        { maxWidth: 260, className: 'norwy-popup' }
      );

      marker.on('click', () => onSelectPlace(place));
      markersRef.current.set(place.id, marker);
      toAdd.push(marker);
    }

    if (toAdd.length > 0) {
      cluster.addLayers(toAdd);
    }
  }, [places, activeTypes, activeRegions, searchQuery, onSelectPlace]);

  return <div ref={containerRef} className="w-full h-full" />;
}
