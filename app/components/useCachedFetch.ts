// React-Hook für Daten mit Caching und automatischem Refresh
import { useEffect, useRef, useState } from "react";

/**
 * useCachedFetch: Holt Daten, speichert sie im LocalStorage und aktualisiert sie im Hintergrund.
 * @param key LocalStorage-Key
 * @param fetcher async () => Daten
 * @param options { refreshOnFocus: boolean }
 */
export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: { refreshOnFocus?: boolean }
) {
  const [data, setData] = useState<T | null>(null); // Die eigentlichen Daten
  const [loading, setLoading] = useState(true); // Ladeanzeige
  const [error, setError] = useState<string>(""); // Fehleranzeige
  const isMounted = useRef(true); // Verhindert Updates nach Unmount

  // Initial: Daten aus LocalStorage laden und im Hintergrund aktualisieren
  useEffect(() => {
    isMounted.current = true;
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        setData(JSON.parse(cached));
        setLoading(false);
      } catch {}
    }
    // Immer im Hintergrund frische Daten holen
    fetcher()
      .then((fresh) => {
        if (!isMounted.current) return;
        setData(fresh);
        setLoading(false);
        localStorage.setItem(key, JSON.stringify(fresh));
      })
      .catch((e) => {
        if (!isMounted.current) return;
        setError(e?.message || "Fehler beim Laden");
        setLoading(false);
      });
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, [key]);

  // Optional: Daten neu laden, wenn das Fenster wieder sichtbar wird
  useEffect(() => {
    if (!options?.refreshOnFocus) return;
    const onFocus = () => {
      fetcher()
        .then((fresh) => {
          setData(fresh);
          setLoading(false);
          localStorage.setItem(key, JSON.stringify(fresh));
        })
        .catch((e) => setError(e?.message || "Fehler beim Laden"));
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [options, fetcher, key]);

  // Rückgabe: Daten, Ladezustand, Fehler, Setter und Refresh
  return {
    data,
    loading,
    error,
    refresh: async () => {
      setLoading(true);
      try {
        const fresh = await fetcher();
        setData(fresh);
        setLoading(false);
        localStorage.setItem(key, JSON.stringify(fresh));
      } catch (e: any) {
        setError(e?.message || "Fehler beim Laden");
        setLoading(false);
      }
    },
    setData,
  };
}
