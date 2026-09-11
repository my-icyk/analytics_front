import type { LucideIcon } from 'lucide-react'
import { FileText, FolderKanban, KeyRound, ShieldCheck, Users, WalletCards, Activity } from 'lucide-react'
import type { PermissionName } from '../types/auth/permission'

export type AdminView =
  | 'overview'
  | 'me'
  | 'users'
  | 'user'
  | 'roles'
  | 'role'
  | 'permissions'
  | 'counters'
  | 'counter'
  | 'groups'
  | 'rules'
  | 'scripts'

export type AdminRouteState = {
  view: AdminView
  userId: number | null
  roleId: number | null
  counterId: number | null
}

export type AdminPageDefinition = {
  id: AdminView
  label: string
  icon: LucideIcon
  group?: string
  permission?: PermissionName
}

export const adminPages: AdminPageDefinition[] = [
  { id: 'users', label: 'Users', icon: Users, group: 'Authentication', permission: 'user:read' },
  { id: 'roles', label: 'Roles', icon: ShieldCheck, group: 'Authentication', permission: 'role:read' },
  { id: 'permissions', label: 'Permissions', icon: KeyRound, group: 'Authentication', permission: 'permission:read' },
  { id: 'counters', label: 'Counters', icon: WalletCards, group: 'Tables', permission: 'counter_update:read' },
  { id: 'groups', label: 'Groups', icon: FolderKanban, group: 'Finance', permission: 'groups:read' },
  { id: 'rules', label: 'Rules', icon: FileText, group: 'Finance', permission: 'rules:read' },
  { id: 'scripts', label: 'Scripts', icon: Activity, group: 'General', permission: 'user:delete' }
]

export function parseAdminRoute(pathname: string, search: string): AdminRouteState {
  if (pathname === '/me') return { view: 'me', userId: null, roleId: null, counterId: null }

  const params = new URLSearchParams(search)
  const view = params.get('view') ?? 'me'
  const userId = params.get('userId') ? Number(params.get('userId')) : null
  const roleId = params.get('roleId') ? Number(params.get('roleId')) : null
  const counterId = params.get('counterId') ? Number(params.get('counterId')) : null

  if (view === 'me') return { view: 'me', userId: null, roleId: null, counterId: null }
  if (view === 'users' || view === 'permissions' || view === 'counters') return { view, userId: null, roleId: null, counterId: null }
  if (view === 'user') return { view: 'user', userId, roleId: null, counterId: null }
  if (view === 'roles') return { view: 'roles', userId: null, roleId: null, counterId: null }
  if (view === 'role') return { view: 'role', userId: null, roleId, counterId: null }
  if (view === 'counter') return { view: 'counter', userId: null, roleId: null, counterId }
  if (view === 'scripts') return { view: 'scripts', userId: null, roleId: null, counterId: null }
  return { view: 'me', userId: null, roleId: null, counterId: null }
}

export function buildAdminRoute(view: AdminView, params: { userId?: number | null; roleId?: number | null; counterId?: number | null } = {}) {
  const url = new URL(window.location.href)

  if (view === 'me') {
    url.pathname = '/me'
    url.search = ''
    return `${url.pathname}${url.search}`
  }

  url.pathname = '/'
  url.searchParams.set('view', view)

  if (view === 'user') {
    if (params.userId == null) url.searchParams.delete('userId')
    else url.searchParams.set('userId', String(params.userId))
    url.searchParams.delete('roleId')
    url.searchParams.delete('counterId')
    return `${url.pathname}${url.search}`
  }

  if (view === 'role') {
    if (params.roleId == null) url.searchParams.delete('roleId')
    else url.searchParams.set('roleId', String(params.roleId))
    url.searchParams.delete('userId')
    url.searchParams.delete('counterId')
    return `${url.pathname}${url.search}`
  }

  if (view === 'counter') {
    if (params.counterId == null) url.searchParams.delete('counterId')
    else url.searchParams.set('counterId', String(params.counterId))
    url.searchParams.delete('userId')
    url.searchParams.delete('roleId')
    return `${url.pathname}${url.search}`
  }


  url.searchParams.delete('userId')
  url.searchParams.delete('roleId')
  url.searchParams.delete('counterId')
  return `${url.pathname}${url.search}`
}

