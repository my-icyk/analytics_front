import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type PaginationProps = {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  loading?: boolean;
  entityLabel?: string;
};

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  loading = false,
  entityLabel = "items",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const offset = (currentPage - 1) * pageSize;
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const sizeOptions = pageSizeOptions.includes(pageSize)
    ? pageSizeOptions
    : [...pageSizeOptions, pageSize].sort((a, b) => a - b);

  return (
    <div className="table-pagination">
      <div className="pagination-info">
        {total === 0 ? (
          <span>0 {entityLabel}</span>
        ) : (
          <span>
            Showing <strong>{offset + 1}</strong>–
            <strong>{Math.min(offset + pageSize, total)}</strong> of{" "}
            <strong>{total}</strong> {entityLabel}
          </span>
        )}
      </div>

      <div className="pagination-controls">
        {onPageSizeChange && (
          <div className="pagination-size">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              disabled={loading}
            >
              {sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pagination-buttons">
          <button
            type="button"
            className="pagination-btn"
            title="First page"
            aria-label="First page"
            disabled={!canPrev || loading}
            onClick={() => onPageChange(1)}
          >
            <ChevronsLeft size={14} />
          </button>
          <button
            type="button"
            className="pagination-btn"
            title="Previous page"
            aria-label="Previous page"
            disabled={!canPrev || loading}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft size={14} />
          </button>

          <span className="pagination-current">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            className="pagination-btn"
            title="Next page"
            aria-label="Next page"
            disabled={!canNext || loading}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight size={14} />
          </button>
          <button
            type="button"
            className="pagination-btn"
            title="Last page"
            aria-label="Last page"
            disabled={!canNext || loading}
            onClick={() => onPageChange(totalPages)}
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
