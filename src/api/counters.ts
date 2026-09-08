import type { Counter, CounterPage } from '../types/counter'
import { request } from './client'

export function getCounters(cursorId: number | null) {
  const params = new URLSearchParams()
  if (cursorId != null) params.set('cursor_id', String(cursorId))
  const query = params.toString()
  return request<CounterPage>(`/api/v1/counters_update/${query ? `?${query}` : ''}`)
}

export function getCounter(counterId: number) {
  return request<Counter>(`/api/v1/counters_update/${counterId}`)
}
