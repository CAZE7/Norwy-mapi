import type { Place, PlaceType } from '../types';
import { TYPE_COLORS, TYPE_ICONS, TYPE_LABELS } from '../utils/mapConfig';

interface AccessibleListProps {
  places: Place[];
  activeTypes: Set<PlaceType>;
  activeRegions: Set<string>;
  searchQuery: string;
  onSelect: (p: Place) => void;
}

export default function AccessibleList({
  places,
  activeTypes,
  activeRegions,
  searchQuery,
  onSelect,
}: AccessibleListProps) {
  const filtered = places
    .filter((p) => {
      if (!activeTypes.has(p.type)) return false;
      if (!activeRegions.has(p.region)) return false;
      const q = searchQuery.toLowerCase().trim();
      if (q && !p.name.toLowerCase().includes(q) && !p.desc.toLowerCase().includes(q))
        return false;
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));

  if (filtered.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center h-48 text-stone-400 gap-2"
        role="status"
        aria-live="polite"
      >
        <span className="text-4xl" aria-hidden="true">🔍</span>
        <p className="text-sm">Keine Orte gefunden</p>
      </div>
    );
  }

  // Group by region
  const grouped = filtered.reduce<Record<string, Place[]>>((acc, p) => {
    if (!acc[p.region]) acc[p.region] = [];
    acc[p.region].push(p);
    return acc;
  }, {});

  return (
    <div className="pb-8">
      <p className="sr-only" role="status" aria-live="polite">
        {filtered.length} Orte gefunden
      </p>
      {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b, 'de'))
        .map(([region, regionPlaces]) => (
          <section key={region} aria-labelledby={`region-${region.replace(/\s/g, '-')}`}>
            <h3
              id={`region-${region.replace(/\s/g, '-')}`}
              className="sticky top-[100px] bg-stone-100 px-4 py-2 text-xs font-bold text-stone-500 uppercase tracking-widest border-b border-stone-200 z-[5]"
            >
              {region}{' '}
              <span className="font-normal normal-case">({regionPlaces.length})</span>
            </h3>
            <ul role="list">
              {regionPlaces.map((p) => (
                <li key={p.id} className="border-b border-stone-50 last:border-0">
                  <button
                    onClick={() => onSelect(p)}
                    className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-stone-50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1d2822]"
                    aria-label={`${p.name}, ${TYPE_LABELS[p.type]}, ${p.region}. ${p.desc}`}
                  >
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm shadow-sm"
                      style={{ background: TYPE_COLORS[p.type] }}
                      aria-hidden="true"
                    >
                      {TYPE_ICONS[p.type]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm text-stone-800">{p.name}</p>
                        <span
                          className="text-[10px] text-white px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                          style={{ background: TYPE_COLORS[p.type] }}
                          aria-hidden="true"
                        >
                          {TYPE_LABELS[p.type]}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5 leading-relaxed line-clamp-2">
                        {p.desc}
                      </p>
                      <p className="text-[10px] text-stone-300 mt-1 font-mono">
                        {p.lat.toFixed(3)}°N · {p.lng.toFixed(3)}°E
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
    </div>
  );
}
