import { getCurrentUser, login, logout, refreshSession } from '../api/auth'

export const authService = {
  login,
  logout,
  getCurrentUser,
  refreshSession,
}
