export function formatDate(value?: string | null): string {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  return `${d}.${m}.${y}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function formatDateTime(value?: string | null): string {
  if (!value) return "";

  // If the backend sends a naive datetime (no Z / offset), treat it as UTC.
  const hasTimezone = /(Z|[+-]\d{2}:?\d{2})$/.test(value);
  const date = new Date(hasTimezone ? value : `${value}Z`);

  if (Number.isNaN(date.getTime())) return "";

  return (
    `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}
