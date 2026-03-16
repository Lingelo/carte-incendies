const numFmt = new Intl.NumberFormat('fr-FR');
const dateFmt = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatNum(n: number): string {
  return numFmt.format(n);
}

export function formatHa(n: number): string {
  if (n < 1) return `${(n * 10000).toFixed(0)} m²`;
  if (n < 10) return `${n.toFixed(2)} ha`;
  return `${numFmt.format(Math.round(n))} ha`;
}

/** French relative time string from ISO date */
export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `il y a ${mins} minute${mins > 1 ? 's' : ''}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  const months = Math.floor(days / 30);
  return `il y a ${months} mois`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return dateFmt.format(d);
}
