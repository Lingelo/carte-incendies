import { formatNum, formatHa } from '../utils/format.ts';
import type { Fire } from '../types.ts';

interface StatsBarProps {
  totalFires: number;
  totalHa: number;
  largest: Fire;
  mostDept: string;
  mostCount: number;
}

export function StatsBar({ totalFires, totalHa, largest, mostDept, mostCount }: StatsBarProps) {
  return (
    <div className="glass rounded-lg shadow-lg px-3 py-2 grid grid-cols-2 md:flex md:flex-wrap md:items-center gap-x-4 gap-y-1 md:gap-4 text-xs md:text-sm">
      <Stat label="Incendies" value={formatNum(totalFires)} />
      <Stat label="Surface totale" value={formatHa(totalHa)} />
      <Stat
        label="Plus grand"
        value={largest.surface > 0 ? formatHa(largest.surface) : '-'}
      />
      <Stat
        label="Dept. le plus touche"
        value={mostDept ? `${mostDept} (${formatNum(mostCount)})` : '-'}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gray-500">{label}:</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}
