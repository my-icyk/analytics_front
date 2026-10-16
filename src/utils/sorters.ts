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

export const boolSorter =
  <T>(key: keyof T) =>
  (a: T, b: T): number =>
    Number(Boolean(a[key])) - Number(Boolean(b[key]));

type NumberLike = number | string | null | undefined;

const toNumber = (value: NumberLike): number | null => {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
};

/** Sort by a numeric field. Empty values always stay at the bottom. */
export const numberSorter =
  <T>(key: keyof T) =>
  (a: T, b: T, sortOrder?: SortOrder): number => {
    const na = toNumber(a[key] as NumberLike);
    const nb = toNumber(b[key] as NumberLike);

    if (na === null && nb === null) return 0;
    if (na === null) return sortOrder === "descend" ? -1 : 1;
    if (nb === null) return sortOrder === "descend" ? 1 : -1;

    return na - nb;
  };
