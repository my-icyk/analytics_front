import type { Counter, CounterCreate, CounterPage, CounterUpdate } from '../types/counter'
import { request } from './client'

export function getCounters(cursorId: number | null) {
  const params = new URLSearchParams()
  if (cursorId != null) params.set('cursor_id', String(cursorId))
  const query = params.toString()
  return request<CounterPage>(`/api/v1/counter-updates${query ? `?${query}` : ''}`)
}

export function getCounter(counterId: number) {
  return request<Counter>(`/api/v1/counter-updates/${counterId}`)
}

export function createCounter(payload: CounterCreate) {
  return request<Counter>('/api/v1/counter-updates', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateCounter(counterId: number, payload: CounterUpdate) {
  return request<Counter>(`/api/v1/counter-updates/${counterId}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function deleteCounter(counterId: number) {
  return request<void>(`/api/v1/counter-updates/${counterId}`, { method: 'DELETE' })
}
