import type { Permission } from '../types/auth/permission'
import type { Role } from '../types/auth/role'

export function isAssigned<T extends { id: number }>(items: T[], id: number) {
  return items.some((item) => item.id === id)
}

export function toggleRoleMembership(current: Record<number, Role[]>, userId: number, roleId: number, assigned: boolean, role: Role) {
  const currentRoles = current[userId] ?? []
  const nextRoles = assigned
    ? currentRoles.filter((item) => item.id !== roleId)
    : [...currentRoles, role]
  return { ...current, [userId]: nextRoles }
}

export function togglePermissionMembership(current: Record<number, Permission[]>, roleId: number, permissionId: number, assigned: boolean, permission: Permission) {
  const currentPermissions = current[roleId] ?? []
  const nextPermissions = assigned
    ? currentPermissions.filter((item) => item.id !== permissionId)
    : [...currentPermissions, permission]
  return { ...current, [roleId]: nextPermissions }
}

export const assignmentService = {
  isAssigned,
  toggleRoleMembership,
  togglePermissionMembership,
}
