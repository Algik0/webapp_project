import { useEffect, useRef, useState } from "react";

/**
 * useCachedFetch: React-Hook für Caching mit LocalStorage und Hintergrund-Refresh.
 * @param key LocalStorage-Key
 * @param fetcher async () => Daten
 * @param options { refreshOnFocus: boolean }
 */
export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: { refreshOnFocus?: boolean }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const isMounted = useRef(true);

  // Initial: Daten aus LocalStorage
  useEffect(() => {
    isMounted.current = true;
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        setData(JSON.parse(cached));
        setLoading(false);
      } catch {}
    }
    // Immer im Hintergrund aktualisieren
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

  // Optional: Refresh bei Sichtbarkeitswechsel
  useEffect(() => {
    if (!options?.refreshOnFocus) return;
    const handler = () => {
      if (document.visibilityState === "visible") {
        setLoading(true);
        fetcher()
          .then((fresh) => {
            setData(fresh);
            setLoading(false);
            localStorage.setItem(key, JSON.stringify(fresh));
          })
          .catch((e) => {
            setError(e?.message || "Fehler beim Laden");
            setLoading(false);
          });
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
    // eslint-disable-next-line
  }, [key, options?.refreshOnFocus]);

  // Manuelles Refresh
  const refresh = async () => {
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
  };

  return { data, loading, error, refresh, setData };
}
