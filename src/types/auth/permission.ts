export type PermissionName =
  | 'resource:create'
  | 'resource:delete'
  | 'role:create'
  | 'role:update'
  | 'role:delete'
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  | 'role_permissions:read'
  | 'permissions:read'
  | 'counters:read'
  | 'groups:read'
  | 'rules:read'

export type Permission = { id: number; name: string }
