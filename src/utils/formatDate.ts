import dayjs from "dayjs";

function formatDateValue(
  value: string | null | undefined,
  format: string,
): string {
  if (!value?.trim()) return "-";

  const date = dayjs(value);
  return date.isValid() ? date.format(format) : "-";
}

export function formatDate(value?: string | null): string {
  return formatDateValue(value, "DD.MM.YYYY");
}

export function formatDateTime(value?: string | null): string {
  return formatDateValue(value, "DD.MM.YYYY HH:mm:ss");
}
const UNITS = [
  { label: "d", ms: 86_400_000 },
  { label: "h", ms: 3_600_000 },
  { label: "min", ms: 60_000 },
  { label: "s", ms: 1_000 },
] as const;

export function formatDuration(value?: number | null): string {
  if (value == null || !Number.isFinite(value) || value < 0) return "-";

  const total = Math.floor(value);

  // first unit that fits into the value
  const index = UNITS.findIndex((unit) => total >= unit.ms);
  if (index === -1) return total === 0 ? "0 s" : "< 1 s";

  const main = UNITS[index];
  const next = UNITS[index + 1]; // undefined when main is seconds

  const mainText = `${Math.floor(total / main.ms)} ${main.label}`;
  if (!next) return mainText;

  const rest = Math.floor((total % main.ms) / next.ms);
  return rest > 0 ? `${mainText} ${rest} ${next.label}` : mainText;
}
