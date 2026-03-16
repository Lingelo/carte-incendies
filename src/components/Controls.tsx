import type { Filters } from '../types.ts';

interface ControlsProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  years: number[];
  allCauses: string[];
}

const SURFACE_OPTIONS = [
  { label: 'Tous', value: 0 },
  { label: '> 0.1 ha', value: 0.1 },
  { label: '> 1 ha', value: 1 },
  { label: '> 10 ha', value: 10 },
  { label: '> 100 ha', value: 100 },
];

export function Controls({ filters, onChange, years, allCauses }: ControlsProps) {
  const toggleCause = (cause: string) => {
    const next = new Set(filters.causes);
    if (next.has(cause)) {
      next.delete(cause);
    } else {
      next.add(cause);
    }
    onChange({ ...filters, causes: next });
  };

  return (
    <div className="glass rounded-lg shadow-lg p-2 md:p-3 flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
      {/* Year filter */}
      <div className="flex items-center gap-1.5">
        <label htmlFor="year-select" className="font-medium text-gray-700">
          Annee
        </label>
        <select
          id="year-select"
          value={filters.year ?? ''}
          onChange={(e) =>
            onChange({
              ...filters,
              year: e.target.value ? parseInt(e.target.value, 10) : null,
            })
          }
          className="border border-gray-300 rounded px-2 py-1 bg-white text-gray-800"
        >
          <option value="">Toutes</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Surface filter */}
      <div className="flex items-center gap-1.5">
        <label htmlFor="surface-select" className="font-medium text-gray-700">
          Surface min
        </label>
        <select
          id="surface-select"
          value={filters.minSurface}
          onChange={(e) =>
            onChange({ ...filters, minSurface: parseFloat(e.target.value) })
          }
          className="border border-gray-300 rounded px-2 py-1 bg-white text-gray-800"
        >
          {SURFACE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Cause checkboxes */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-medium text-gray-700">Cause</span>
        {allCauses.map((cause) => (
          <label
            key={cause}
            className="flex items-center gap-1 cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={filters.causes.has(cause)}
              onChange={() => toggleCause(cause)}
              className="accent-fire-600 w-3.5 h-3.5"
            />
            <span className="text-gray-600">{cause}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
