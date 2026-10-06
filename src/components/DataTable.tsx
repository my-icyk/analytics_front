// DataTable.tsx
// General-purpose, controlled table: pages fetch data, DataTable only renders it.
// Pairs with <Pagination /> via the `footer` prop.
import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  renderActions?: (row: T) => ReactNode;
  isLoading?: boolean; // first load: show loading state instead of rows
  isFetching?: boolean; // refetch: dim rows but keep them visible
  error?: string;
  emptyText?: string;
  loadingText?: string;
  footer?: ReactNode; // e.g. <Pagination />
};

export function DataTable<T>({
  columns,
  data,
  rowKey,
  renderActions,
  isLoading = false,
  isFetching = false,
  error,
  emptyText = "No data",
  loadingText = "Loading…",
  footer,
}: DataTableProps<T>) {
  return (
    <div>
      {error && <p className="auth-error">{error}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width, textAlign: column.align }}
                >
                  {column.header}
                </th>
              ))}
              {renderActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody style={isFetching ? { opacity: 0.55 } : undefined}>
            {!isLoading &&
              data.map((row) => (
                <tr key={rowKey(row)}>
                  {columns.map((column) => (
                    <td key={column.key} style={{ textAlign: column.align }}>
                      {column.render(row)}
                    </td>
                  ))}
                  {renderActions && <td>{renderActions(row)}</td>}
                </tr>
              ))}
          </tbody>
        </table>
        {isLoading && <div className="empty-state">{loadingText}</div>}
        {!isLoading && data.length === 0 && (
          <div className="empty-state">{emptyText}</div>
        )}
      </div>
      {footer}
    </div>
  );
}
