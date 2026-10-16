import dayjs from "dayjs";

export function formatDate(value?: string | null): string {
  if (!value) return "-";

  const date = dayjs(value);

  return date.isValid() ? date.format("DD.MM.YYYY") : "-";
}
