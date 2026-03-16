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

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return dateFmt.format(d);
}
