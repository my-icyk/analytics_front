import { createCounter, getCounter, getCounters, updateCounter } from '../api/counters'
import type { Counter } from '../types/counter'

export const counterService = {
  getCounter,
  createCounter,
  updateCounter,
  listCountersPage,
}

// Adapts the backend's { items, next_cursor } shape to DataTable's { items, cursor_id } contract.
export async function listCountersPage(cursorId: string | number | null): Promise<{ items: Counter[]; cursor_id: number | null }> {
  const cursor = cursorId == null ? null : Number(cursorId)
  const page = await getCounters(cursor)
  return { items: page.items, cursor_id: page.next_cursor }
}
