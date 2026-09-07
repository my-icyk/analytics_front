import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Bell, BookOpen, ChevronDown, CircleHelp, Database, FileText, Filter, FolderKanban, KeyRound, LayoutDashboard, MoreHorizontal, Search, ShieldCheck, SlidersHorizontal, Users, WalletCards } from 'lucide-react'
import { assignPermissionToRole, assignRoleToUser, createRole, createUser, deleteRole, deleteUser, getCurrentUser, getPermissions, getRolePermissions, getRoles, getUserRoles, getUsers, login, logout, Permission, refreshAccessToken, removePermissionFromRole, removeRoleFromUser, Role, updateRole, updateUser, User } from './api'
import { PermissionCatalog } from './components/PermissionCatalog'
import { RoleDetail } from './components/RoleDetail'
import { RoleFormModal } from './components/RoleFormModal'
import { RolesPage } from './components/RolesPage'
import { UserDetail } from './components/UserDetail'
import { UserFormModal } from './components/UserFormModal'
import { UsersPage } from './components/UsersPage'
import { PermissionName, Resource } from './types'

const initialResources: Resource[] = [
  { id: 1, name: 'Users', type: 'Collection', domain: 'Auth', status: 'Active', updated: 'Live', owner: 'System', icon: Users },
  { id: 2, name: 'Roles', type: 'Policy set', domain: 'Auth', status: 'Active', updated: 'Live', owner: 'System', icon: ShieldCheck },
  { id: 3, name: 'Permissions', type: 'Policy set', domain: 'Auth', status: 'Active', updated: 'Live', owner: 'System', icon: KeyRound },
  { id: 4, name: 'Counters', type: 'Collection', domain: 'Finance', status: 'Active', updated: 'Live', owner: 'J. Chen', icon: WalletCards },
  { id: 5, name: 'Groups', type: 'Collection', domain: 'Finance', status: 'Draft', updated: 'Live', owner: 'J. Chen', icon: FolderKanban },
  { id: 6, name: 'Rules', type: 'Logic set', domain: 'Finance', status: 'Active', updated: 'Live', owner: 'M. Patel', icon: FileText },
]

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Users', icon: Users, group: 'Authentication' },
  { label: 'Roles', icon: ShieldCheck, group: 'Authentication' },
  { label: 'Permissions', icon: KeyRound, group: 'Authentication' },
  { label: 'Counters', icon: WalletCards, group: 'Finance' },
  { label: 'Groups', icon: FolderKanban, group: 'Finance' },
  { label: 'Rules', icon: FileText, group: 'Finance' },
]

type UserForm = { username: string; password: string; is_admin: boolean }
type RoleForm = { name: string; description: string }

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [loginError, setLoginError] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [activeNav, setActiveNav] = useState('Overview')
  const [resources, setResources] = useState(initialResources)
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState<'All' | 'Auth' | 'Finance'>('All')
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [userRoleMap, setUserRoleMap] = useState<Record<number, Role[]>>({})
  const [rolePermissionMap, setRolePermissionMap] = useState<Record<number, Permission[]>>({})
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [userForm, setUserForm] = useState<UserForm>({ username: '', password: '', is_admin: false })
  const [roleForm, setRoleForm] = useState<RoleForm>({ name: '', description: '' })
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [userError, setUserError] = useState('')
  const [roleError, setRoleError] = useState('')
  const [assignmentError, setAssignmentError] = useState('')

  const can = (permission: PermissionName) => user?.is_admin === true || user?.permissions.includes(permission) === true

  useEffect(() => {
    refreshAccessToken().then((hasSession) => hasSession ? getCurrentUser().then(setUser).catch(() => undefined) : undefined).finally(() => setCheckingSession(false))
  }, [])

  const loadData = async () => {
    const nextResources: Resource[] = []
    if (can('users:read')) {
      const nextUsers = await getUsers()
      setUsers(nextUsers)
      const memberships = await Promise.all(nextUsers.map(async (item) => [item.id, await getUserRoles(item.id)] as const))
      setUserRoleMap(Object.fromEntries(memberships))
      nextResources.push({ ...initialResources[0], type: `${nextUsers.length} accounts` })
    }
    if (can('role_permissions:read')) {
      const nextRoles = await getRoles()
      setRoles(nextRoles)
      const memberships = await Promise.all(nextRoles.map(async (item) => [item.id, await getRolePermissions(item.id)] as const))
      setRolePermissionMap(Object.fromEntries(memberships))
      nextResources.push({ ...initialResources[1], type: `${nextRoles.length} policy sets` })
    }
    if (can('permissions:read')) {
      const nextPermissions = await getPermissions()
      setPermissions(nextPermissions)
      nextResources.push({ ...initialResources[2], type: `${nextPermissions.length} permissions` })
    }
    const financePermissions: Record<string, PermissionName> = { Counters: 'counters:read', Groups: 'groups:read', Rules: 'rules:read' }
    nextResources.push(...initialResources.slice(3).filter((resource) => can(financePermissions[resource.name])))
    setResources(nextResources)
  }

  useEffect(() => { if (user) loadData().catch(() => setResources([])) }, [user])

  const toggleUserRole = async (userId: number, roleId: number) => {
    const assigned = (userRoleMap[userId] ?? []).some((item) => item.id === roleId)
    try {
      if (assigned) await removeRoleFromUser(userId, roleId)
      else await assignRoleToUser(userId, roleId)
      setAssignmentError('')
      setUserRoleMap((current) => {
        const currentRoles = current[userId] ?? []
        const nextRoles = assigned
          ? currentRoles.filter((item) => item.id !== roleId)
          : [...currentRoles, roles.find((item) => item.id === roleId)!]
        return { ...current, [userId]: nextRoles }
      })
    } catch (error) { setAssignmentError(error instanceof Error ? error.message : 'Unable to update user roles') }
  }

  const toggleRolePermission = async (roleId: number, permissionId: number) => {
    const assigned = (rolePermissionMap[roleId] ?? []).some((item) => item.id === permissionId)
    try {
      if (assigned) await removePermissionFromRole(roleId, permissionId)
      else await assignPermissionToRole(roleId, permissionId)
      setAssignmentError('')
      setRolePermissionMap((current) => {
        const currentPermissions = current[roleId] ?? []
        const nextPermissions = assigned
          ? currentPermissions.filter((item) => item.id !== permissionId)
          : [...currentPermissions, permissions.find((item) => item.id === permissionId)!]
        return { ...current, [roleId]: nextPermissions }
      })
    } catch (error) { setAssignmentError(error instanceof Error ? error.message : 'Unable to update role permissions') }
  }

  const openUser = (item: User) => { setSelectedUser(item); setActiveNav('User details') }
  const openRole = (item: Role) => { setSelectedRole(item); setActiveNav('Role details') }
  const openUserEditor = (item: User | null) => { setEditingUser(item); setUserForm({ username: item?.username ?? '', password: '', is_admin: item?.is_admin ?? false }); setUserError(''); setUserModalOpen(true) }
  const openRoleEditor = (item: Role | null) => { setEditingRole(item); setRoleForm({ name: item?.name ?? '', description: item?.description ?? '' }); setRoleError(''); setRoleModalOpen(true) }

  const saveUser = async () => {
    if (!userForm.username.trim() || (!editingUser && !userForm.password)) return
    try {
      const saved = editingUser ? await updateUser(editingUser.id, { username: userForm.username.trim(), ...(userForm.password ? { password: userForm.password } : {}), is_admin: userForm.is_admin }) : await createUser({ username: userForm.username.trim(), password: userForm.password, is_admin: userForm.is_admin })
      setUsers((current) => editingUser ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved])
      if (selectedUser?.id === saved.id) setSelectedUser(saved)
      setUserModalOpen(false)
    } catch (error) { setUserError(error instanceof Error ? error.message : 'Unable to save user') }
  }

  const saveRole = async () => {
    if (!roleForm.name.trim()) return
    try {
      const saved = editingRole ? await updateRole(editingRole.id, { name: roleForm.name.trim(), description: roleForm.description.trim() || null }) : await createRole(roleForm.name.trim(), roleForm.description.trim() || null)
      setRoles((current) => editingRole ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved])
      if (selectedRole?.id === saved.id) setSelectedRole(saved)
      setRoleModalOpen(false)
    } catch (error) { setRoleError(error instanceof Error ? error.message : 'Unable to save role') }
  }

  const removeUser = async (item: User) => { if (!window.confirm(`Delete ${item.username}?`)) return; try { await deleteUser(item.id); setUsers((current) => current.filter((entry) => entry.id !== item.id)); if (selectedUser?.id === item.id) setActiveNav('Users') } catch (error) { setUserError(error instanceof Error ? error.message : 'Unable to delete user') } }
  const removeRole = async (item: Role) => { if (!window.confirm(`Delete ${item.name}?`)) return; try { await deleteRole(item.id); setRoles((current) => current.filter((entry) => entry.id !== item.id)); if (selectedRole?.id === item.id) setActiveNav('Roles') } catch (error) { setRoleError(error instanceof Error ? error.message : 'Unable to delete role') } }

  const filteredResources = useMemo(() => resources.filter((resource) => resource.name.toLowerCase().includes(query.toLowerCase()) && (domain === 'All' || resource.domain === domain)), [domain, query, resources])

  const submitLogin = async (event: FormEvent) => { event.preventDefault(); setLoggingIn(true); setLoginError(''); try { setUser(await login(username, password)); setPassword('') } catch (error) { setLoginError(error instanceof Error ? error.message : 'Unable to sign in') } finally { setLoggingIn(false) } }

  if (checkingSession) return <div className="auth-screen"><div className="auth-panel"><span className="brand-mark"><Database size={18} /></span><p>Connecting to Ledgerline...</p></div></div>
  if (!user) return <div className="auth-screen"><form className="auth-panel" onSubmit={submitLogin}><div className="brand auth-brand"><span className="brand-mark"><Database size={18} /></span><span>ledgerline</span></div><p className="eyebrow">SECURE CONSOLE</p><h1>Sign in to your workspace</h1><p className="subtitle">Use your FastAPI account to continue.</p><label>Username<input autoFocus value={username} onChange={(event) => setUsername(event.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{loginError && <p className="auth-error">{loginError}</p>}<button className="primary-button auth-submit" disabled={loggingIn}>{loggingIn ? 'Signing in...' : 'Sign in'}</button></form></div>

  const visibleNav = navItems.filter((item) => item.label === 'Overview' || (item.label === 'Users' && can('users:read')) || (item.label === 'Roles' && can('role_permissions:read')) || (item.label === 'Permissions' && can('permissions:read')) || (item.label === 'Counters' && can('counters:read')) || (item.label === 'Groups' && can('groups:read')) || (item.label === 'Rules' && can('rules:read')))
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark"><Database size={18} /></span><span>ledgerline</span></div><div className="workspace-switcher"><span className="workspace-dot" /><span>Acme workspace</span><ChevronDown size={15} /></div><nav className="nav-list">{visibleNav.map((item) => { const Icon = item.icon; return <div key={item.label}>{item.group && visibleNav.find((nav) => nav.group === item.group)?.label === item.label && <span className="nav-group">{item.group}</span>}<button className={`nav-item ${activeNav === item.label ? 'active' : ''}`} onClick={() => setActiveNav(item.label)}><Icon size={17} /><span>{item.label}</span></button></div> })}</nav><div className="sidebar-bottom"><button className="nav-item"><BookOpen size={17} /><span>Documentation</span></button><button className="nav-item"><CircleHelp size={17} /><span>Help center</span></button><button className="profile" onClick={() => logout().then(() => setUser(null))}><div className="avatar">{user.username.slice(0, 2).toUpperCase()}</div><div><strong>{user.username}</strong><small>{user.is_admin ? 'Admin' : 'Member'}</small></div><MoreHorizontal size={17} /></button></div></aside>
    <main className="main-content"><header className="topbar"><div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>{activeNav}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Notifications"><Bell size={18} /></button><button className="help-button"><CircleHelp size={16} /> Support</button></div></header><section className="page-header"><div><p className="eyebrow">RESOURCE MANAGEMENT</p><h1>{activeNav === 'Overview' ? 'Your resource library' : activeNav}</h1><p className="subtitle">Manage the building blocks behind your application.</p></div></section><section className="stat-grid"><div className="stat-card"><span className="stat-label">Total resources</span><strong>{resources.length}</strong><span className="stat-note">Live backend resources</span></div><div className="stat-card"><span className="stat-label">Authentication</span><strong>{resources.filter((item) => item.domain === 'Auth').length}</strong><span className="stat-note">Users, roles & access</span></div><div className="stat-card"><span className="stat-label">Finance</span><strong>{resources.filter((item) => item.domain === 'Finance').length}</strong><span className="stat-note">Rules & operations</span></div><div className="stat-card accent"><span className="stat-label">Active resources</span><strong>{resources.filter((item) => item.status === 'Active').length}</strong><span className="stat-note">Ready for production</span></div></section>
      {activeNav === 'Users' && <UsersPage users={users} canCreate={can('users:create')} canEdit={can('users:update')} canDelete={can('users:delete')} onCreate={() => openUserEditor(null)} onOpen={openUser} onEdit={openUserEditor} onDelete={removeUser} error={userError} />}
      {activeNav === 'User details' && selectedUser && <UserDetail user={selectedUser} roles={roles} assignedRoles={userRoleMap[selectedUser.id] ?? []} canEdit={can('users:update')} canAssign={can('role_permissions:read')} onBack={() => setActiveNav('Users')} onEdit={() => openUserEditor(selectedUser)} onOpenRole={openRole} onToggleRole={(roleId) => toggleUserRole(selectedUser.id, roleId)} error={assignmentError} />}
      {activeNav === 'Roles' && <RolesPage roles={roles} canCreate={can('role:create')} canEdit={can('role:update')} canDelete={can('role:delete')} onCreate={() => openRoleEditor(null)} onOpen={openRole} onEdit={openRoleEditor} onDelete={removeRole} error={roleError} />}
      {activeNav === 'Role details' && selectedRole && <RoleDetail role={selectedRole} permissions={permissions} assignedPermissions={rolePermissionMap[selectedRole.id] ?? []} canEdit={can('role:update')} canAssign={can('role_permissions:read')} onBack={() => setActiveNav('Roles')} onEdit={() => openRoleEditor(selectedRole)} onTogglePermission={(permissionId) => toggleRolePermission(selectedRole.id, permissionId)} error={assignmentError} />}
      {activeNav === 'Permissions' && <PermissionCatalog permissions={permissions} />}
      {activeNav === 'Overview' && <section className="resource-section"><div className="section-heading"><div><h2>All resources</h2><p>Collections and policy sets across your workspace.</p></div><button className="filter-button"><SlidersHorizontal size={15} /> Customize</button></div><div className="toolbar"><div className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resources" /></div><div className="filter-tabs">{(['All', 'Auth', 'Finance'] as const).map((item) => <button key={item} className={domain === item ? 'selected' : ''} onClick={() => setDomain(item)}>{item === 'Auth' ? 'Authentication' : item}</button>)}</div><button className="filter-icon" aria-label="Filter"><Filter size={16} /></button></div><div className="table-wrap"><table><thead><tr><th>Resource</th><th>Domain</th><th>Status</th><th>Last updated</th><th>Owner</th></tr></thead><tbody>{filteredResources.map((resource) => { const Icon = resource.icon; return <tr key={resource.id}><td><div className="resource-name"><span className={`resource-icon ${resource.domain.toLowerCase()}`}><Icon size={17} /></span><div><strong>{resource.name}</strong><small>{resource.type}</small></div></div></td><td>{resource.domain}</td><td>{resource.status}</td><td>{resource.updated}</td><td>{resource.owner}</td></tr> })}</tbody></table>{filteredResources.length === 0 && <div className="empty-state">No resources match your search.</div>}</div></section>}
      <footer><span>Ledgerline console</span><span>Updated moments ago</span></footer></main>
    {userModalOpen && <UserFormModal user={editingUser} isAdmin={user.is_admin} form={userForm} error={userError} onChange={setUserForm} onClose={() => setUserModalOpen(false)} onSubmit={saveUser} />}
    {roleModalOpen && <RoleFormModal role={editingRole} form={roleForm} error={roleError} onChange={setRoleForm} onClose={() => setRoleModalOpen(false)} onSubmit={saveRole} />}
  </div>
}

export default App
