const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

let accessToken: string | null = null
let refreshPromise: Promise<boolean> | null = null

export async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  const response = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: 'include' })
  if (response.status === 401 && retry && path !== '/api/v1/auth/refresh') {
    if (await refreshAccessToken()) return request<T>(path, options, false)
  }
  if (!response.ok) {
    const detail = await response.json().catch(() => null) as { detail?: string } | null
    throw new Error(detail?.detail || `Request failed (${response.status})`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export async function loginRequest(username: string, password: string) {
  const tokens = await request<{ access_token: string; token_type: string }>('/api/v1/auth/login', {
    method: 'POST', body: JSON.stringify({ username, password }),
  }, false)
  accessToken = tokens.access_token
  return tokens
}

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = request<{ access_token: string; token_type: string }>('/api/v1/auth/refresh', { method: 'POST' }, false)
      .then((tokens) => { accessToken = tokens.access_token; return true })
      .catch(() => { accessToken = null; return false })
      .finally(() => { refreshPromise = null })
  }
  return refreshPromise
}

export async function logoutRequest() {
  await request<void>('/api/v1/auth/logout', { method: 'POST' }, false).catch(() => undefined)
  accessToken = null
}

export function setAccessToken(token: string | null) {
  accessToken = token
}
