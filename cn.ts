import { useState, useEffect } from 'react';
import type { Place } from '../types';

interface UsePlacesResult {
  places: Place[];
  loading: boolean;
  error: string | null;
}

export function usePlaces(): UsePlacesResult {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/places.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Place[] = await res.json();
        if (!cancelled) {
          setPlaces(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { places, loading, error };
}
