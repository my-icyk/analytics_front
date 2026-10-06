// DataTable.tsx
import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode; // always required: simpler typing, no keyof tricks
  width?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  renderActions?: (row: T) => ReactNode;
  isLoading?: boolean; // first load
  isFetching?: boolean; // refetch (dim the table)
  emptyText?: string;
};

export function DataTable<T>({
  columns,
  data,
  rowKey,
  renderActions,
  isLoading,
  isFetching,
  emptyText = "No data",
}: DataTableProps<T>) {
  const colSpan = columns.length + (renderActions ? 1 : 0);

  return (
    <table className="table-wrap">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} style={{ width: c.width }}>
              {c.header}
            </th>
          ))}
          {renderActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={colSpan}>Loading…</td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={colSpan}>{emptyText}</td>
          </tr>
        ) : (
          data.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((c) => (
                <td key={c.key}>{c.render(row)}</td>
              ))}
              {renderActions && <td>{renderActions(row)}</td>}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
