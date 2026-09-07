import { assignPermissionToRole, createRole, deleteRole, getRolePermissions, getRoles, removePermissionFromRole, updateRole } from '../api/roles'
import type { Permission } from '../types/auth/permission'
import type { Role, RoleUpdate } from '../types/auth/role'

export const roleService = {
  listRoles: getRoles,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissions,
  assignPermissionToRole,
  removePermissionFromRole,
}

export function getAssignedPermissionsForRole(roleId: number, current: Record<number, Permission[]>) {
  return current[roleId] ?? []
}

export function updateRoleAssignments(current: Record<number, Permission[]>, roleId: number, nextPermissions: Permission[]) {
  return { ...current, [roleId]: nextPermissions }
}

export function normalizeRole(role: Role): Role {
  return { ...role }
}

export type { RoleUpdate }
