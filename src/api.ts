const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

export type User = {
  id: number
  username: string
  is_admin: boolean
  permissions: string[]
}
export type UserCreate = { username: string; password: string; is_admin?: boolean }
export type UserUpdate = { username?: string; password?: string; is_admin?: boolean }
export type CurrentUserResponse = { user: Omit<User, 'permissions'>; permissions: string[] }
export type Role = { id: number; name: string; description: string | null; created_at: string }
export type RoleUpdate = { name?: string; description?: string | null }
export type Permission = { id: number; name: string }
export type TokenResponse = { access_token: string; token_type: string }

let accessToken: string | null = null
let refreshPromise: Promise<boolean> | null = null

async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
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

export async function login(username: string, password: string) {
  const tokens = await request<TokenResponse>('/api/v1/auth/login', {
    method: 'POST', body: JSON.stringify({ username, password }),
  }, false)
  accessToken = tokens.access_token
  return getCurrentUser()
}

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = request<TokenResponse>('/api/v1/auth/refresh', { method: 'POST' }, false)
      .then((tokens) => { accessToken = tokens.access_token; return true })
      .catch(() => { accessToken = null; return false })
      .finally(() => { refreshPromise = null })
  }
  return refreshPromise
}

export async function logout() {
  await request<void>('/api/v1/auth/logout', { method: 'POST' }, false).catch(() => undefined)
  accessToken = null
}

export async function getCurrentUser() {
  const response = await request<CurrentUserResponse>('/api/v1/users/me')
  return { ...response.user, permissions: response.permissions }
}
export function getUsers() { return request<User[]>('/api/v1/users/') }
export function createUser(payload: UserCreate) {
  return request<User>('/api/v1/users/', { method: 'POST', body: JSON.stringify(payload) })
}
export function updateUser(userId: number, payload: UserUpdate) {
  return request<User>(`/api/v1/users/${userId}`, { method: 'PATCH', body: JSON.stringify(payload) })
}
export function deleteUser(userId: number) {
  return request<void>(`/api/v1/users/${userId}`, { method: 'DELETE' })
}
export function getRoles() { return request<Role[]>('/api/v1/roles/') }
export function getUserRoles(userId: number) { return request<Role[]>(`/api/v1/users/${userId}/roles/`) }
export function assignRoleToUser(userId: number, roleId: number) {
  return request<void>(`/api/v1/users/${userId}/roles/${roleId}`, { method: 'POST' })
}
export function removeRoleFromUser(userId: number, roleId: number) {
  return request<void>(`/api/v1/users/${userId}/roles/${roleId}`, { method: 'DELETE' })
}
export function getPermissions() { return request<Permission[]>('/api/v1/permissions/') }
export function getRolePermissions(roleId: number) { return request<Permission[]>(`/api/v1/roles/${roleId}/permissions/`) }
export function assignPermissionToRole(roleId: number, permissionId: number) {
  return request<void>(`/api/v1/roles/${roleId}/permissions/${permissionId}`, { method: 'POST' })
}
export function removePermissionFromRole(roleId: number, permissionId: number) {
  return request<void>(`/api/v1/roles/${roleId}/permissions/${permissionId}`, { method: 'DELETE' })
}
export function createRole(name: string, description: string | null) {
  return request<Role>('/api/v1/roles/', { method: 'POST', body: JSON.stringify({ name, description }) })
}
export function updateRole(roleId: number, payload: RoleUpdate) {
  return request<Role>(`/api/v1/roles/${roleId}`, { method: 'PUT', body: JSON.stringify(payload) })
}
export function deleteRole(roleId: number) {
  return request<void>(`/api/v1/roles/${roleId}`, { method: 'DELETE' })
}
