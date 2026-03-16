/** Color scale based on fire surface area */
export function getFireColor(surface: number): string {
  if (surface >= 100) return '#7f1d1d'; // dark red
  if (surface >= 10) return '#dc2626'; // red
  if (surface >= 1) return '#f97316'; // orange
  return '#fbbf24'; // yellow
}

/** Marker radius based on surface area */
export function getFireRadius(surface: number): number {
  return Math.max(4, Math.log(surface + 1) * 3);
}

export const FIRE_SCALE = [
  { label: '< 1 ha', color: '#fbbf24' },
  { label: '1 - 10 ha', color: '#f97316' },
  { label: '10 - 100 ha', color: '#dc2626' },
  { label: '> 100 ha', color: '#7f1d1d' },
] as const;
