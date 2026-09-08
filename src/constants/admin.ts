import type { LucideIcon } from 'lucide-react'
import { FileText, FolderKanban, KeyRound, LayoutDashboard, ShieldCheck, Users, WalletCards } from 'lucide-react'
import type { PermissionName } from '../types/auth/permission'

export type AdminView = 'overview' | 'users' | 'user' | 'roles' | 'role' | 'permissions' | 'counters' | 'counter'

export type AdminRouteState = {
  view: AdminView
  userId: number | null
  roleId: number | null
  counterId: number | null
}

export type AdminPageDefinition = {
  id: AdminView | 'groups' | 'rules'
  label: string
  icon: LucideIcon
  group?: string
  permission?: PermissionName
}

export const adminPages: AdminPageDefinition[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users, group: 'Authentication', permission: 'users:read' },
  { id: 'roles', label: 'Roles', icon: ShieldCheck, group: 'Authentication', permission: 'role_permissions:read' },
  { id: 'permissions', label: 'Permissions', icon: KeyRound, group: 'Authentication', permission: 'permissions:read' },
  { id: 'counters', label: 'Counters', icon: WalletCards, group: 'Finance', permission: 'counters:read' },
  { id: 'groups', label: 'Groups', icon: FolderKanban, group: 'Finance', permission: 'groups:read' },
  { id: 'rules', label: 'Rules', icon: FileText, group: 'Finance', permission: 'rules:read' },
]

export function parseAdminRoute(search: string): AdminRouteState {
  const params = new URLSearchParams(search)
  const view = params.get('view') ?? 'overview'
  const userId = params.get('userId') ? Number(params.get('userId')) : null
  const roleId = params.get('roleId') ? Number(params.get('roleId')) : null
  const counterId = params.get('counterId') ? Number(params.get('counterId')) : null

  if (view === 'users' || view === 'permissions' || view === 'counters') return { view, userId: null, roleId: null, counterId: null }
  if (view === 'user') return { view: 'user', userId, roleId: null, counterId: null }
  if (view === 'roles') return { view: 'roles', userId: null, roleId: null, counterId: null }
  if (view === 'role') return { view: 'role', userId: null, roleId, counterId: null }
  if (view === 'counter') return { view: 'counter', userId: null, roleId: null, counterId }
  return { view: 'overview', userId: null, roleId: null, counterId: null }
}

export function buildAdminRoute(view: AdminView | 'groups' | 'rules', params: { userId?: number | null; roleId?: number | null; counterId?: number | null } = {}) {
  const url = new URL(window.location.href)
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

