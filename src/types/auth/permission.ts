export type PermissionName =
  | 'users:create'
  | 'users:read'
  | 'users:update'
  | 'users:delete'
  | 'roles:create'
  | 'roles:read'
  | 'roles:update'
  | 'roles:delete'
  | 'user_roles:create'
  | 'user_roles:read'
  | 'user_roles:update'
  | 'user_roles:delete'
  | 'role_permissions:create'
  | 'role_permissions:read'
  | 'role_permissions:update'
  | 'role_permissions:delete'
  | 'permissions:read'
  | 'counters_update:create'
  | 'counters_update:read'
  | 'counters_update:update'
  | 'counters_update:delete'
  | 'groups:read'
  | 'rules:read'



export type Permission = { id: number; name: string }
