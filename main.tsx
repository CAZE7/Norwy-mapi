import { useState } from 'react';
import type { Place, PlaceType, Region } from '../types';
import { TYPE_COLORS, TYPE_ICONS, TYPE_LABELS } from '../utils/mapConfig';

const ALL_TYPES: PlaceType[] = [
  'city', 'fjord', 'mountain', 'island', 'village', 'landmark', 'nationalpark', 'valley',
];

const ALL_REGIONS: Region[] = [
  'Østlandet', 'Vestlandet', 'Trøndelag', 'Nord-Norge', 'Sørlandet', 'Innlandet', 'Svalbard',
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  places: Place[];
  activeTypes: Set<PlaceType>;
  activeRegions: Set<string>;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleType: (t: PlaceType) => void;
  onToggleRegion: (r: string) => void;
  onAllTypes: () => void;
  onClearTypes: () => void;
  onSelectPlace: (p: Place) => void;
  selectedPlace: Place | null;
}

export default function Sidebar({
  isOpen,
  onClose,
  places,
  activeTypes,
  activeRegions,
  searchQuery,
  onSearchChange,
  onToggleType,
  onToggleRegion,
  onAllTypes,
  onClearTypes,
  onSelectPlace,
  selectedPlace,
}: SidebarProps) {
  const [tab, setTab] = useState<'filter' | 'list'>('filter');

  const visiblePlaces = places
    .filter((p) => {
      if (!activeTypes.has(p.type)) return false;
      if (!activeRegions.has(p.region)) return false;
      const q = searchQuery.toLowerCase().trim();
      if (q && !p.name.toLowerCase().includes(q) && !p.desc.toLowerCase().includes(q)) return false;
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        role="complementary"
        aria-label="Filter und Orteliste"
        className={`
          fixed top-0 left-0 h-full w-80 bg-[#f4f1ea] z-40 shadow-2xl
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 lg:z-auto lg:shadow-none lg:border-r lg:border-stone-200
        `}
      >
        {/* Header */}
        <div className="bg-[#1d2822] text-white px-4 py-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold leading-tight">🇳🇴 Steder i Norge</h1>
              <p className="text-xs text-stone-300 mt-0.5">
                {visiblePlaces.length} von {places.length} Orten
              </p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition"
              aria-label="Seitenleiste schließen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Ort suchen…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/10 text-white placeholder-stone-400 text-sm border border-white/20 focus:outline-none focus:border-white/50 focus:bg-white/15 transition"
              aria-label="Orte durchsuchen"
            />
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-stone-200 flex-shrink-0 bg-white">
          <button
            onClick={() => setTab('filter')}
            className={`flex-1 py-2.5 text-sm font-medium transition ${
              tab === 'filter'
                ? 'text-[#1d2822] border-b-2 border-[#1d2822]'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            🎛️ Filter
          </button>
          <button
            onClick={() => setTab('list')}
            className={`flex-1 py-2.5 text-sm font-medium transition ${
              tab === 'list'
                ? 'text-[#1d2822] border-b-2 border-[#1d2822]'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            📋 Liste ({visiblePlaces.length})
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {tab === 'filter' ? (
            <FilterPanel
              activeTypes={activeTypes}
              activeRegions={activeRegions}
              places={places}
              onToggleType={onToggleType}
              onToggleRegion={onToggleRegion}
              onAllTypes={onAllTypes}
              onClearTypes={onClearTypes}
            />
          ) : (
            <ListView
              places={visiblePlaces}
              selectedPlace={selectedPlace}
              onSelect={onSelectPlace}
            />
          )}
        </div>
      </aside>
    </>
  );
}

// ── Filter panel ──────────────────────────────────────────────────────────────
function FilterPanel({
  activeTypes,
  activeRegions,
  places,
  onToggleType,
  onToggleRegion,
  onAllTypes,
  onClearTypes,
}: {
  activeTypes: Set<PlaceType>;
  activeRegions: Set<string>;
  places: Place[];
  onToggleType: (t: PlaceType) => void;
  onToggleRegion: (r: string) => void;
  onAllTypes: () => void;
  onClearTypes: () => void;
}) {
  const countByType = (t: PlaceType) => places.filter((p) => p.type === t).length;
  const countByRegion = (r: string) => places.filter((p) => p.region === r).length;

  return (
    <div className="p-4 space-y-5">
      {/* Type filter */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Ortstyp</h2>
          <div className="flex gap-1">
            <button onClick={onAllTypes} className="text-xs text-blue-600 hover:underline">Alle</button>
            <span className="text-stone-300">·</span>
            <button onClick={onClearTypes} className="text-xs text-stone-400 hover:underline">Keine</button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => onToggleType(t)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition border ${
                activeTypes.has(t)
                  ? 'border-transparent text-white font-medium'
                  : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
              }`}
              style={activeTypes.has(t) ? { backgroundColor: TYPE_COLORS[t] } : {}}
              aria-pressed={activeTypes.has(t)}
            >
              <span className="text-base">{TYPE_ICONS[t]}</span>
              <span className="flex-1 text-left">{TYPE_LABELS[t]}</span>
              <span className={`text-xs rounded-full px-1.5 py-0.5 ${
                activeTypes.has(t) ? 'bg-white/20' : 'bg-stone-100 text-stone-400'
              }`}>
                {countByType(t)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Region filter */}
      <section>
        <h2 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Region</h2>
        <div className="grid grid-cols-1 gap-1.5">
          {ALL_REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => onToggleRegion(r)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition border ${
                activeRegions.has(r)
                  ? 'bg-[#1d2822] text-white border-transparent font-medium'
                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
              aria-pressed={activeRegions.has(r)}
            >
              <span>{r}</span>
              <span className={`text-xs rounded-full px-1.5 py-0.5 ${
                activeRegions.has(r) ? 'bg-white/20' : 'bg-stone-100 text-stone-400'
              }`}>
                {countByRegion(r)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Legend */}
      <section className="border-t border-stone-200 pt-4">
        <h2 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Legende</h2>
        <div className="bg-white rounded-lg p-3 space-y-1">
          {ALL_TYPES.filter((t) => activeTypes.has(t)).map((t) => (
            <div key={t} className="flex items-center gap-2 text-xs text-stone-600">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: TYPE_COLORS[t] }} />
              {TYPE_ICONS[t]} {TYPE_LABELS[t]}
            </div>
          ))}
          {activeTypes.size === 0 && (
            <p className="text-xs text-stone-400 italic">Kein Typ ausgewählt</p>
          )}
        </div>
      </section>

      <p className="text-[10px] text-stone-400 text-center pb-2">
        Kartendaten © <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-600">OpenStreetMap</a>-Mitwirkende
      </p>
    </div>
  );
}

// ── List view ─────────────────────────────────────────────────────────────────
function ListView({
  places,
  selectedPlace,
  onSelect,
}: {
  places: Place[];
  selectedPlace: Place | null;
  onSelect: (p: Place) => void;
}) {
  if (places.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-stone-400 text-sm gap-2">
        <span className="text-3xl">🔍</span>
        <p>Keine Orte gefunden</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-stone-100" role="list" aria-label="Ortsliste">
      {places.map((p) => (
        <li key={p.id}>
          <button
            onClick={() => onSelect(p)}
            className={`w-full text-left px-4 py-3 flex items-start gap-3 transition hover:bg-white ${
              selectedPlace?.id === p.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''
            }`}
            aria-current={selectedPlace?.id === p.id ? 'true' : undefined}
          >
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm mt-0.5"
              style={{ background: TYPE_COLORS[p.type] }}
              aria-hidden="true"
            >
              {TYPE_ICONS[p.type]}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-stone-800 truncate">{p.name}</p>
              <p className="text-xs text-stone-500 mt-0.5">{p.region}</p>
              <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">{p.desc}</p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
