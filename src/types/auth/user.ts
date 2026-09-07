export type User = {
  id: number
  username: string
  is_admin: boolean
  permissions: string[]
}

export type UserCreate = { username: string; password: string; is_admin?: boolean }
export type UserUpdate = { username?: string; password?: string; is_admin?: boolean }
export type CurrentUserResponse = { user: Omit<User, 'permissions'>; permissions: string[] }
