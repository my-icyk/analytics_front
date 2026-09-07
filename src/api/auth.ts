import type { CurrentUserResponse, User } from '../types/auth/user'
import { loginRequest, logoutRequest, refreshAccessToken, request, setAccessToken } from './client'

export async function login(username: string, password: string) {
  const tokens = await loginRequest(username, password)
  setAccessToken(tokens.access_token)
  return getCurrentUser()
}

export async function logout() {
  await logoutRequest()
  setAccessToken(null)
}

export async function getCurrentUser() {
  const response = await request<CurrentUserResponse>('/api/v1/users/me')
  return { ...response.user, permissions: response.permissions }
}

export async function refreshSession() {
  return refreshAccessToken()
}

export type { User, CurrentUserResponse }
