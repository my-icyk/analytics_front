import { assignRoleToUser, createUser, deleteUser, getUserRoles, getUsers, removeRoleFromUser, updateUser } from '../api/users'
import type { Role } from '../types/auth/role'
import type { User, UserCreate, UserUpdate } from '../types/auth/user'

export const userService = {
  listUsers: getUsers,
  listUsersPage,
  createUser,
  updateUser,
  deleteUser,
  getUserRoles,
  assignRoleToUser,
  removeRoleFromUser,
}

// Client-side cursor slice over getUsers(); shaped to swap later for real backend cursor params.
export async function listUsersPage(cursorId: string | number | null, limit = 20): Promise<{ items: User[]; cursor_id: number | null }> {
  const all = await getUsers()
  const sorted = [...all].sort((a, b) => a.id - b.id)
  const startIndex = cursorId == null ? 0 : sorted.findIndex((item) => item.id === Number(cursorId)) + 1
  const items = sorted.slice(startIndex, startIndex + limit)
  const lastItem = items[items.length - 1]
  const cursor_id = lastItem && startIndex + items.length < sorted.length ? lastItem.id : null
  return { items, cursor_id }
}

export function getAssignedRolesForUser(userId: number, current: Record<number, Role[]>) {
  return current[userId] ?? []
}

export function updateUserAssignments(current: Record<number, Role[]>, userId: number, nextRoles: Role[]) {
  return { ...current, [userId]: nextRoles }
}

export function normalizeUser(user: User): User {
  return { ...user }
}

export type { UserCreate, UserUpdate }
