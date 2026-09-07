import type { Permission } from '../types/auth/permission'
import { request } from './client'

export function getPermissions() { return request<Permission[]>('/api/v1/permissions/') }
