import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

export type DataTableColumn<T> = {
  key: string
  header: string
  render: (row: T) => ReactNode
}

export type DataTablePage<T> = {
  items: T[]
  cursor_id: string | number | null
}

type DataTableProps<T> = {
  columns: DataTableColumn<T>[]
  rowKey: (row: T) => string | number
  fetchPage: (cursorId: string | number | null) => Promise<DataTablePage<T>>
  loadMode?: 'scroll' | 'button'
  maxHeight?: string
  emptyMessage?: string
  error?: string
}

export function DataTable<T>({ columns, rowKey, fetchPage, loadMode = 'scroll', maxHeight = '480px', emptyMessage = 'No records available.', error }: DataTableProps<T>) {
  const [rows, setRows] = useState<T[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchPageRef = useRef(fetchPage)
  fetchPageRef.current = fetchPage
  const cursorRef = useRef<string | number | null>(null)
  const loadingRef = useRef(false)
  const hasMoreRef = useRef(true)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLTableRowElement | null>(null)

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return
    loadingRef.current = true
    setLoading(true)
    try {
      const page = await fetchPageRef.current(cursorRef.current)
      setRows((current) => [...current, ...page.items])
      cursorRef.current = page.cursor_id
      hasMoreRef.current = page.cursor_id !== null
      setHasMore(hasMoreRef.current)
    } finally {
      loadingRef.current = false
      setLoading(false)
      setInitialLoading(false)
    }
  }, [])

  // Load the first page once on mount; subsequent pages are driven by scroll/button.
  useEffect(() => {
    void loadMore()
  }, [loadMore])

  useEffect(() => {
    if (loadMode !== 'scroll' || !hasMore) return
    const root = scrollRef.current
    const sentinel = sentinelRef.current
    if (!root || !sentinel) return
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) void loadMore()
    }, { root, threshold: 0.1 })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMode, loadMore, hasMore, rows.length])

  return <div>
    {error && <p className="auth-error">{error}</p>}
    <div className="table-wrap table-wrap-scroll" style={{ maxHeight }} ref={scrollRef}>
      <table>
        <thead><tr>{columns.map((column) => <th key={column.key}>{column.header}</th>)}</tr></thead>
        <tbody>
          {rows.map((row) => <tr key={rowKey(row)}>{columns.map((column) => <td key={column.key}>{column.render(row)}</td>)}</tr>)}
          {loadMode === 'scroll' && hasMore && <tr ref={sentinelRef}><td colSpan={columns.length} className="data-table-sentinel">{loading ? 'Loading…' : ''}</td></tr>}
        </tbody>
      </table>
      {!initialLoading && rows.length === 0 && <div className="empty-state">{emptyMessage}</div>}
    </div>
    {loadMode === 'button' && hasMore && <div className="data-table-load-more"><button className="secondary-button compact-button" type="button" disabled={loading} onClick={() => void loadMore()}>{loading ? 'Loading…' : 'Load more'}</button></div>}
  </div>
}
