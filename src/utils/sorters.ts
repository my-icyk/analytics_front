import type { SortOrder } from "antd/es/table/interface";

type DateLike = string | number | Date | null | undefined;

const toTime = (value: DateLike): number | null => {
  if (value == null || value === "") return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
};

/** Sort by a date field. Empty values always stay at the bottom. */
export const dateSorter =
  <T>(key: keyof T) =>
  (a: T, b: T, sortOrder?: SortOrder): number => {
    const ta = toTime(a[key] as DateLike);
    const tb = toTime(b[key] as DateLike);

    if (ta === null && tb === null) return 0;
    // antd flips the result on "descend", so return the opposite
    // to keep nulls last in both directions
    if (ta === null) return sortOrder === "descend" ? -1 : 1;
    if (tb === null) return sortOrder === "descend" ? 1 : -1;

    return ta - tb;
  };

export const dateSorterNullAsMax =
  <T>(key: keyof T) =>
  (a: T, b: T): number =>
    (toTime(a[key] as DateLike) ?? Infinity) -
    (toTime(b[key] as DateLike) ?? Infinity);
