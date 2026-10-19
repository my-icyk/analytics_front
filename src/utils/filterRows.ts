// utils/filterRows.ts
export function matchesFilters<T extends object>(
  row: T,
  filters: Partial<Record<keyof T, unknown>>,
): boolean {
  return (Object.entries(filters) as [keyof T, unknown][]).every(
    ([key, value]) => {
      if (value == null || value === "") return true;
      return String(row[key] ?? "")
        .toLowerCase()
        .includes(String(value).toLowerCase());
    },
  );
}

export function filterRows<T extends object>(
  rows: T[],
  filters: Partial<Record<keyof T, unknown>>,
): T[] {
  return rows.filter((row) => matchesFilters(row, filters));
}
