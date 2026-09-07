import type { Role, RoleUpdate } from '../types/auth/role'
import { request } from './client'

export function getRoles() { return request<Role[]>('/api/v1/roles/') }
export function createRole(name: string, description: string | null) {
  return request<Role>('/api/v1/roles/', { method: 'POST', body: JSON.stringify({ name, description }) })
}
export function updateRole(roleId: number, payload: RoleUpdate) {
  return request<Role>(`/api/v1/roles/${roleId}`, { method: 'PUT', body: JSON.stringify(payload) })
}
export function deleteRole(roleId: number) {
  return request<void>(`/api/v1/roles/${roleId}`, { method: 'DELETE' })
}
export function getRolePermissions(roleId: number) {
  return request<import('../types/auth/permission').Permission[]>(`/api/v1/roles/${roleId}/permissions/`)
}
export function assignPermissionToRole(roleId: number, permissionId: number) {
  return request<void>(`/api/v1/roles/${roleId}/permissions/${permissionId}`, { method: 'POST' })
}
export function removePermissionFromRole(roleId: number, permissionId: number) {
  return request<void>(`/api/v1/roles/${roleId}/permissions/${permissionId}`, { method: 'DELETE' })
}
