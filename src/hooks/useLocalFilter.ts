import { useState, useMemo } from "react";

// hooks/useLocalFilter.ts
export function useLocalFilter<T extends object>(data: T[]) {
  const [filters, setFilters] = useState<Partial<T>>({});

  const rows = useMemo(
    () =>
      data.filter((row) =>
        Object.entries(filters).every(([key, value]) => {
          if (value === undefined || value === null || value === "")
            return true;
          return String(row[key as keyof T] ?? "")
            .toLowerCase()
            .includes(String(value).toLowerCase());
        }),
      ),
    [data, filters],
  );

  return { rows, setFilters, resetFilters: () => setFilters({}) };
}
