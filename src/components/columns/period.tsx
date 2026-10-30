import { formatDate } from "@/utils/formatDate";
import { ProColumns } from "@ant-design/pro-components";
import { Typography } from "antd";

type PeriodOptions<T> = {
  from?: keyof T & string; // start field, default "valid_from"
  to?: keyof T & string; // end field, default "valid_to"
  sortable?: boolean; // client-side sorting, only for pages without pagination
  title?: string;
};

export function periodColumn<T>(
  {
    from = "valid_from" as keyof T & string,
    to = "valid_to" as keyof T & string,
    sortable = false,
    title = "Period",
  }: PeriodOptions<T> = {},
  extra?: Partial<ProColumns<T>>,
): ProColumns<T> {
  const get = (row: T, key: keyof T & string) =>
    (row[key] as string | null | undefined) ?? null;

  return {
    title,
    key: "period",
    search: false,
    sorter: sortable
      ? (a, b) =>
          (get(a, from) ?? "").localeCompare(get(b, from) ?? "") ||
          (get(a, to) ?? "9999-12-31").localeCompare(get(b, to) ?? "9999-12-31")
      : undefined,
    render: (_, row) => {
      const end = get(row, to);
      return (
        <>
          {formatDate(get(row, from))} -{" "}
          {end ? (
            formatDate(end)
          ) : (
            <Typography.Text type="secondary" italic>
              Present
            </Typography.Text>
          )}
        </>
      );
    },
    ...extra,
  };
}
