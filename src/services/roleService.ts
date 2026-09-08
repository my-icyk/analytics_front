import { assignPermissionToRole, createRole, deleteRole, getRolePermissions, getRoles, removePermissionFromRole, updateRole } from '../api/roles'
import type { Permission } from '../types/auth/permission'
import type { Role, RoleUpdate } from '../types/auth/role'

export const roleService = {
  listRoles: getRoles,
  listRolesPage,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissions,
  assignPermissionToRole,
  removePermissionFromRole,
}

// Client-side cursor slice over getRoles(); shaped to swap later for real backend cursor params.
export async function listRolesPage(cursorId: string | number | null, limit = 20): Promise<{ items: Role[]; cursor_id: number | null }> {
  const all = await getRoles()
  const sorted = [...all].sort((a, b) => a.id - b.id)
  const startIndex = cursorId == null ? 0 : sorted.findIndex((item) => item.id === Number(cursorId)) + 1
  const items = sorted.slice(startIndex, startIndex + limit)
  const lastItem = items[items.length - 1]
  const cursor_id = lastItem && startIndex + items.length < sorted.length ? lastItem.id : null
  return { items, cursor_id }
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
