export function formatDate(value?: string | null): string {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  return `${d}.${m}.${y}`;
}
