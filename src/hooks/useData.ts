import { useState, useEffect, useMemo } from 'react';
import type { Fire, FireData, FireMeta, Filters } from '../types.ts';

const DATA_URL = import.meta.env.BASE_URL + 'data/incendies.json';

const ALL_CAUSES = [
  'Humaine intentionnelle',
  'Humaine involontaire',
  'Naturelle',
  'Inconnue',
];

export function useData() {
  const [fires, setFires] = useState<Fire[]>([]);
  const [meta, setMeta] = useState<FireMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    year: null,
    minSurface: 0,
    causes: new Set(ALL_CAUSES),
  });

  useEffect(() => {
    const controller = new AbortController();
    fetch(DATA_URL, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<FireData>;
      })
      .then((data) => {
        setFires(data.fires);
        setMeta(data.meta);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    return fires.filter((f) => {
      if (filters.year !== null) {
        const y = parseInt(f.date.slice(0, 4), 10);
        if (y !== filters.year) return false;
      }
      if (f.surface < filters.minSurface) return false;
      if (!filters.causes.has(f.cause)) return false;
      return true;
    });
  }, [fires, filters]);

  const stats = useMemo(() => {
    const totalFires = filtered.length;
    const totalHa = filtered.reduce((s, f) => s + f.surface, 0);
    const largest = filtered.reduce(
      (max, f) => (f.surface > max.surface ? f : max),
      { surface: 0 } as Fire
    );

    // Most affected department
    const deptCounts = new Map<string, number>();
    for (const f of filtered) {
      deptCounts.set(f.dept, (deptCounts.get(f.dept) || 0) + 1);
    }
    let mostDept = '';
    let mostCount = 0;
    for (const [dept, count] of deptCounts) {
      if (count > mostCount) {
        mostDept = dept;
        mostCount = count;
      }
    }

    return { totalFires, totalHa, largest, mostDept, mostCount };
  }, [filtered]);

  return { fires: filtered, meta, loading, error, filters, setFilters, stats, allCauses: ALL_CAUSES };
}
