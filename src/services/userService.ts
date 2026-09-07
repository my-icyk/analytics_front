import { assignRoleToUser, createUser, deleteUser, getUserRoles, getUsers, removeRoleFromUser, updateUser } from '../api/users'
import type { Role } from '../types/auth/role'
import type { User, UserCreate, UserUpdate } from '../types/auth/user'

export const userService = {
  listUsers: getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserRoles,
  assignRoleToUser,
  removeRoleFromUser,
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
