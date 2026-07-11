import { useState, useCallback, useEffect } from 'react';
import type { Place, PlaceType } from './types';
import { usePlaces } from './hooks/usePlaces';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import PlaceDetail from './components/PlaceDetail';
import AccessibleList from './components/AccessibleList';

const ALL_TYPES: PlaceType[] = [
  'city', 'fjord', 'mountain', 'island', 'village', 'landmark', 'nationalpark', 'valley',
];
const ALL_REGIONS = [
  'Østlandet', 'Vestlandet', 'Trøndelag', 'Nord-Norge', 'Sørlandet', 'Innlandet', 'Svalbard',
];

export default function App() {
  const { places, loading, error } = usePlaces();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTypes, setActiveTypes] = useState<Set<PlaceType>>(new Set(ALL_TYPES));
  const [activeRegions, setActiveRegions] = useState<Set<string>>(new Set(ALL_REGIONS));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showListView, setShowListView] = useState(false);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .catch((err) => console.warn('SW registration failed:', err));
    }
  }, []);

  const toggleType = useCallback((t: PlaceType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }, []);

  const toggleRegion = useCallback((r: string) => {
    setActiveRegions((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  }, []);

  const allTypes = useCallback(() => setActiveTypes(new Set(ALL_TYPES)), []);
  const clearTypes = useCallback(() => setActiveTypes(new Set()), []);

  const handleSelectPlace = useCallback((place: Place) => {
    setSelectedPlace(place);
    setShowListView(false);
  }, []);

  const visibleCount = places.filter((p) => {
    if (!activeTypes.has(p.type)) return false;
    if (!activeRegions.has(p.region)) return false;
    const q = searchQuery.toLowerCase().trim();
    if (q && !p.name.toLowerCase().includes(q) && !p.desc.toLowerCase().includes(q)) return false;
    return true;
  }).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-stone-100">

      {/* ── Sidebar ── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        places={places}
        activeTypes={activeTypes}
        activeRegions={activeRegions}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleType={toggleType}
        onToggleRegion={toggleRegion}
        onAllTypes={allTypes}
        onClearTypes={clearTypes}
        onSelectPlace={handleSelectPlace}
        selectedPlace={selectedPlace}
      />

      {/* ── Map area ── */}
      <div className="relative flex-1 flex flex-col min-w-0">

        {/* ── Top bar ── */}
        <header className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-3 py-2 pointer-events-none">

          {/* Hamburger / filter toggle */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="pointer-events-auto bg-[#1d2822] text-white rounded-xl px-3 py-2 shadow-lg hover:bg-[#2d4a3e] transition flex items-center gap-2 text-sm font-medium"
            aria-label="Seitenleiste umschalten"
            aria-expanded={sidebarOpen}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="hidden sm:inline">Filter</span>
          </button>

          {/* Stats pill */}
          <div className="pointer-events-none bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow text-xs text-stone-600 font-medium">
            {loading ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 animate-spin text-stone-400" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Lade Orte…
              </span>
            ) : error ? (
              <span className="text-red-500">⚠ Fehler</span>
            ) : (
              <span>🗺️ <strong>{visibleCount}</strong> / {places.length} Orte</span>
            )}
          </div>

          {/* Accessible list toggle */}
          <button
            onClick={() => setShowListView((v) => !v)}
            className="pointer-events-auto ml-auto bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow text-xs font-medium text-stone-600 hover:bg-white transition flex items-center gap-1.5"
            aria-label={showListView ? 'Kartenansicht anzeigen' : 'Barrierefreie Listenansicht anzeigen'}
            aria-pressed={showListView}
          >
            {showListView ? '🗺️ Karte' : '♿ Liste'}
          </button>
        </header>

        {/* ── Loading / Error state ── */}
        {loading && (
          <div className="flex-1 flex items-center justify-center bg-stone-200" role="status" aria-live="polite">
            <div className="text-center">
              <div className="text-5xl mb-4" aria-hidden="true">🇳🇴</div>
              <div className="text-stone-600 font-medium">Karte wird geladen…</div>
              <div className="mt-3 w-8 h-8 border-2 border-[#1d2822] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="flex-1 flex items-center justify-center bg-stone-200" role="alert">
            <div className="text-center max-w-xs">
              <div className="text-5xl mb-4" aria-hidden="true">⚠️</div>
              <p className="text-stone-600 font-medium">Fehler beim Laden der Ortsdaten</p>
              <p className="text-stone-400 text-sm mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-[#1d2822] text-white rounded-lg text-sm hover:bg-[#2d4a3e] transition"
              >
                Neu laden
              </button>
            </div>
          </div>
        )}

        {/* ── Main content (map + overlays) ── */}
        {!loading && !error && (
          <div className="flex-1 relative">

            {/* Leaflet map (always mounted so it can re-render markers) */}
            <MapView
              places={places}
              activeTypes={activeTypes}
              activeRegions={activeRegions}
              searchQuery={searchQuery}
              onSelectPlace={handleSelectPlace}
            />

            {/* ── Accessible list overlay ── */}
            {showListView && (
              <div className="absolute inset-0 z-10 bg-white overflow-y-auto" role="main">
                {/* List header */}
                <div className="sticky top-0 bg-[#1d2822] text-white px-4 py-3 flex items-center gap-3 z-10">
                  <button
                    onClick={() => setShowListView(false)}
                    className="hover:bg-white/10 rounded-lg p-1 transition"
                    aria-label="Listenansicht schließen, zurück zur Karte"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <h2 className="font-semibold text-sm">Alle Orte (Listenansicht)</h2>
                  <span className="ml-auto text-xs text-stone-300">{visibleCount} Orte</span>
                </div>

                {/* Inline search */}
                <div className="sticky top-[52px] bg-white border-b border-stone-100 px-4 py-2.5 z-[9]">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ort suchen…"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:border-[#1d2822] transition"
                    aria-label="Orte in der Liste suchen"
                  />
                </div>

                <AccessibleList
                  places={places}
                  activeTypes={activeTypes}
                  activeRegions={activeRegions}
                  searchQuery={searchQuery}
                  onSelect={(p) => { handleSelectPlace(p); setShowListView(false); }}
                />
              </div>
            )}

            {/* ── Place detail card ── */}
            <PlaceDetail
              place={selectedPlace}
              onClose={() => setSelectedPlace(null)}
            />
          </div>
        )}

        {/* Map attribution footer */}
        {!loading && !error && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <p className="text-[10px] text-stone-500 bg-white/80 backdrop-blur-sm rounded px-2 py-0.5 whitespace-nowrap">
              Kartendaten ©{' '}
              <a
                href="https://www.openstreetmap.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline pointer-events-auto"
              >
                OpenStreetMap
              </a>
              -Mitwirkende · Bilder via Wikimedia Commons
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
