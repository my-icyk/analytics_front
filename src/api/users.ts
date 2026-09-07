import type { User, UserCreate, UserUpdate } from '../types/auth/user'
import { request } from './client'

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
export function getUserRoles(userId: number) {
  return request<import('../types/auth/role').Role[]>(`/api/v1/users/${userId}/roles/`)
}
export function assignRoleToUser(userId: number, roleId: number) {
  return request<void>(`/api/v1/users/${userId}/roles/${roleId}`, { method: 'POST' })
}
export function removeRoleFromUser(userId: number, roleId: number) {
  return request<void>(`/api/v1/users/${userId}/roles/${roleId}`, { method: 'DELETE' })
}
