import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Bell, BookOpen, ChevronDown, CircleHelp, Database, Filter, MoreHorizontal, PanelLeftClose, PanelLeftOpen, Search, SlidersHorizontal } from 'lucide-react'
import { buildAdminRoute, parseAdminRoute, adminPages } from '../constants/admin'
import { authService } from '../services/authService'
import { assignmentService } from '../services/assignmentService'
import { counterService } from '../services/counterService'
import { permissionService } from '../services/permissionService'
import { roleService } from '../services/roleService'
import { userService } from '../services/userService'
import type { Permission, PermissionName } from '../types/auth/permission'
import type { Role } from '../types/auth/role'
import type { User } from '../types/auth/user'
import type { Counter } from '../types/counter'
import type { Resource } from '../types/resource'
import type { RoleForm, UserForm } from '../types/forms'
import { UserFormModal } from '../components/users/UserFormModal'
import { RoleFormModal } from '../components/roles/RoleFormModal'
import { UsersPage } from './UsersPage'
import { RolesPage } from './RolesPage'
import { UserDetailPage } from './UserDetailPage'
import { RoleDetailPage } from './RoleDetailPage'
import { PermissionCatalogPage } from './PermissionCatalogPage'
import { CountersPage } from './CountersPage'
import { CounterDetailPage } from './CounterDetailPage'
import { CounterUpdateForm } from '../components/CountersUpdate/CounterUpdateForm'
import type { CounterUpdateFormValues } from '../components/CountersUpdate/CounterUpdateForm.schema'

const initialResources: Resource[] = [
  { id: 1, name: 'Users', type: 'Collection', domain: 'Auth', status: 'Active', updated: 'Live', owner: 'System', icon: Database },
  { id: 2, name: 'Roles', type: 'Policy set', domain: 'Auth', status: 'Active', updated: 'Live', owner: 'System', icon: Database },
  { id: 3, name: 'Permissions', type: 'Policy set', domain: 'Auth', status: 'Active', updated: 'Live', owner: 'System', icon: Database },
  { id: 4, name: 'Counters', type: 'Collection', domain: 'Finance', status: 'Active', updated: 'Live', owner: 'J. Chen', icon: Database },
  { id: 5, name: 'Groups', type: 'Collection', domain: 'Finance', status: 'Draft', updated: 'Live', owner: 'J. Chen', icon: Database },
  { id: 6, name: 'Rules', type: 'Logic set', domain: 'Finance', status: 'Active', updated: 'Live', owner: 'M. Patel', icon: Database },
]

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [loginError, setLoginError] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [activeNav, setActiveNav] = useState('Overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [resources, setResources] = useState(initialResources)
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState<'All' | 'Auth' | 'Finance'>('All')
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [userRoleMap, setUserRoleMap] = useState<Record<number, Role[]>>({})
  const [rolePermissionMap, setRolePermissionMap] = useState<Record<number, Permission[]>>({})
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null)
  const [selectedCounterId, setSelectedCounterId] = useState<number | null>(null)
  const [userForm, setUserForm] = useState<UserForm>({ username: '', password: '', is_admin: false })
  const [roleForm, setRoleForm] = useState<RoleForm>({ name: '', description: '' })
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [userError, setUserError] = useState('')
  const [roleError, setRoleError] = useState('')
  const [assignmentError, setAssignmentError] = useState('')
  const [counterError, setCounterError] = useState('')
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null)
  const [counterModalOpen, setCounterModalOpen] = useState(false)
  const [counterFormError, setCounterFormError] = useState('')
  const [counterRefreshKey, setCounterRefreshKey] = useState(0)

  const userPageLoadedRef = useRef(false)
  const rolePageLoadedRef = useRef(false)
  const permissionPageLoadedRef = useRef(false)
  const loadedUserRoleIdsRef = useRef<Set<number>>(new Set())
  const loadedRolePermissionIdsRef = useRef<Set<number>>(new Set())
  const loadedCounterIdsRef = useRef<Set<number>>(new Set())
  const counterMapRef = useRef<Record<number, Counter>>({})

  const can = useCallback((permission: PermissionName) => user?.is_admin === true || user?.permissions.includes(permission) === true, [user])

  const syncViewFromLocation = () => {
    const route = parseAdminRoute(window.location.search)
    setSelectedUser(null)
    setSelectedUserId(null)
    setSelectedRole(null)
    setSelectedRoleId(null)
    setSelectedCounter(null)
    setSelectedCounterId(null)
    if (route.view === 'users') { setActiveNav('Users'); return }
    if (route.view === 'user') { setActiveNav('User details'); setSelectedUserId(route.userId); return }
    if (route.view === 'roles') { setActiveNav('Roles'); return }
    if (route.view === 'role') { setActiveNav('Role details'); setSelectedRoleId(route.roleId); return }
    if (route.view === 'permissions') { setActiveNav('Permissions'); return }
    if (route.view === 'counters') { setActiveNav('Counters'); return }
    if (route.view === 'counter') { setActiveNav('Counter details'); setSelectedCounterId(route.counterId); return }
    setActiveNav('Overview')
  }

  const setRoute = (view: 'overview' | 'users' | 'user' | 'roles' | 'role' | 'permissions' | 'counters' | 'counter', values: { userId?: number | null; roleId?: number | null; counterId?: number | null } = {}) => {
    window.history.pushState({}, '', buildAdminRoute(view, values))
    syncViewFromLocation()
  }

  const ensureUsers = async () => {
    if (!user || !can('users:read') || userPageLoadedRef.current) return
    const nextUsers = await userService.listUsers()
    setUsers(nextUsers)
    userPageLoadedRef.current = true
  }

  const ensureRoles = async () => {
    if (!user || !can('role_permissions:read') || rolePageLoadedRef.current) return
    const nextRoles = await roleService.listRoles()
    setRoles(nextRoles)
    rolePageLoadedRef.current = true
  }

  const ensurePermissions = async () => {
    if (!user || !can('permissions:read') || permissionPageLoadedRef.current) return
    const nextPermissions = await permissionService.listPermissions()
    setPermissions(nextPermissions)
    permissionPageLoadedRef.current = true
  }

  const ensureUserRoles = async (userId: number) => {
    if (userRoleMap[userId] !== undefined || loadedUserRoleIdsRef.current.has(userId)) return
    const nextRoles = await userService.getUserRoles(userId)
    loadedUserRoleIdsRef.current.add(userId)
    setUserRoleMap((current) => ({ ...current, [userId]: nextRoles }))
  }

  const ensureRolePermissions = async (roleId: number) => {
    if (rolePermissionMap[roleId] !== undefined || loadedRolePermissionIdsRef.current.has(roleId)) return
    const nextPermissions = await roleService.getRolePermissions(roleId)
    loadedRolePermissionIdsRef.current.add(roleId)
    setRolePermissionMap((current) => ({ ...current, [roleId]: nextPermissions }))
  }

  const ensureCounter = async (counterId: number) => {
    if (loadedCounterIdsRef.current.has(counterId)) {
      setSelectedCounter(counterMapRef.current[counterId] ?? null)
      return
    }
    try {
      const counter = await counterService.getCounter(counterId)
      loadedCounterIdsRef.current.add(counterId)
      counterMapRef.current[counterId] = counter
      setCounterError('')
      setSelectedCounter(counter)
    } catch (error) { setCounterError(error instanceof Error ? error.message : 'Unable to load counter') }
  }

  useEffect(() => {
    authService.refreshSession().then((hasSession) => hasSession ? authService.getCurrentUser().then(setUser).catch(() => undefined) : undefined).finally(() => setCheckingSession(false))
  }, [])

  useEffect(() => {
    const handlePopState = () => syncViewFromLocation()
    window.addEventListener('popstate', handlePopState)
    syncViewFromLocation()
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (!user) return
    if (activeNav === 'Users' || activeNav === 'User details') void ensureUsers()
    if (activeNav === 'Roles' || activeNav === 'Role details') void ensureRoles()
    if (activeNav === 'Permissions' || activeNav === 'Role details') void ensurePermissions()
    if (activeNav === 'User details' && selectedUserId !== null) void ensureUserRoles(selectedUserId)
    if (activeNav === 'Role details' && selectedRoleId !== null) void ensureRolePermissions(selectedRoleId)
    if (activeNav === 'Counter details' && selectedCounterId !== null) void ensureCounter(selectedCounterId)
  }, [activeNav, selectedUserId, selectedRoleId, selectedCounterId, user, can])

  useEffect(() => {
    if (selectedUserId === null) {
      setSelectedUser(null)
      return
    }
    setSelectedUser(users.find((item) => item.id === selectedUserId) ?? null)
  }, [selectedUserId, users])

  useEffect(() => {
    if (selectedRoleId === null) {
      setSelectedRole(null)
      return
    }
    setSelectedRole(roles.find((item) => item.id === selectedRoleId) ?? null)
  }, [selectedRoleId, roles])

  useEffect(() => {
    if (!user) return
    const nextResources: Resource[] = []
    if (can('users:read')) nextResources.push({ ...initialResources[0], type: `${users.length} accounts` })
    if (can('role_permissions:read')) nextResources.push({ ...initialResources[1], type: `${roles.length} policy sets` })
    if (can('permissions:read')) nextResources.push({ ...initialResources[2], type: `${permissions.length} permissions` })
    const financePermissions: Record<string, PermissionName> = { Counters: 'counters:read', Groups: 'groups:read', Rules: 'rules:read' }
    nextResources.push(...initialResources.slice(3).filter((resource) => can(financePermissions[resource.name])))
    setResources(nextResources)
  }, [can, permissions, roles, user, users])

  const toggleUserRole = async (userId: number, roleId: number) => {
    const assigned = (userRoleMap[userId] ?? []).some((item) => item.id === roleId)
    try {
      if (assigned) await userService.removeRoleFromUser(userId, roleId)
      else await userService.assignRoleToUser(userId, roleId)
      setAssignmentError('')
      setUserRoleMap((current) => assignmentService.toggleRoleMembership(current, userId, roleId, assigned, roles.find((item) => item.id === roleId)!))
    } catch (error) { setAssignmentError(error instanceof Error ? error.message : 'Unable to update user roles') }
  }

  const toggleRolePermission = async (roleId: number, permissionId: number) => {
    const assigned = (rolePermissionMap[roleId] ?? []).some((item) => item.id === permissionId)
    try {
      if (assigned) await roleService.removePermissionFromRole(roleId, permissionId)
      else await roleService.assignPermissionToRole(roleId, permissionId)
      setAssignmentError('')
      setRolePermissionMap((current) => assignmentService.togglePermissionMembership(current, roleId, permissionId, assigned, permissions.find((item) => item.id === permissionId)!))
    } catch (error) { setAssignmentError(error instanceof Error ? error.message : 'Unable to update role permissions') }
  }

  const openUser = (item: User) => {
    setSelectedUser(item)
    setSelectedUserId(item.id)
    setSelectedRole(null)
    setSelectedRoleId(null)
    setRoute('user', { userId: item.id })
  }
  const openRole = (item: Role) => {
    setSelectedRole(item)
    setSelectedRoleId(item.id)
    setSelectedUser(null)
    setSelectedUserId(null)
    setRoute('role', { roleId: item.id })
  }
  const openCounter = (item: Counter) => {
    setSelectedCounter(item)
    setSelectedCounterId(item.id)
    setRoute('counter', { counterId: item.id })
  }
  const openUserEditor = (item: User | null) => { setEditingUser(item); setUserForm({ username: item?.username ?? '', password: '', is_admin: item?.is_admin ?? false }); setUserError(''); setUserModalOpen(true) }
  const openRoleEditor = (item: Role | null) => { setEditingRole(item); setRoleForm({ name: item?.name ?? '', description: item?.description ?? '' }); setRoleError(''); setRoleModalOpen(true) }
  const openCounterEditor = (item: Counter | null) => { setEditingCounter(item); setCounterFormError(''); setCounterModalOpen(true) }

  const saveCounter = async (values: CounterUpdateFormValues) => {
    const payload = { ...values, comment: values.comment ?? '' }
    try {
      const saved = editingCounter ? await counterService.updateCounter(editingCounter.id, payload) : await counterService.createCounter(payload)
      loadedCounterIdsRef.current.add(saved.id)
      counterMapRef.current[saved.id] = saved
      if (selectedCounter?.id === saved.id) setSelectedCounter(saved)
      setCounterModalOpen(false)
      setCounterRefreshKey((current) => current + 1)
    } catch (error) { setCounterFormError(error instanceof Error ? error.message : 'Unable to save counter') }
  }

  const removeCounter = async (item: Counter) => {
    if (!window.confirm(`Delete counter ${item.id_counter}?`)) return
    try {
      await counterService.deleteCounter(item.id)
      loadedCounterIdsRef.current.delete(item.id)
      delete counterMapRef.current[item.id]
      setCounterError('')
      setCounterRefreshKey((current) => current + 1)
      if (selectedCounter?.id === item.id) setRoute('counters')
    } catch (error) { setCounterError(error instanceof Error ? error.message : 'Unable to delete counter') }
  }

  const saveUser = async () => {
    if (!userForm.username.trim() || (!editingUser && !userForm.password)) return
    try {
      const saved = editingUser ? await userService.updateUser(editingUser.id, { username: userForm.username.trim(), ...(userForm.password ? { password: userForm.password } : {}), is_admin: userForm.is_admin }) : await userService.createUser({ username: userForm.username.trim(), password: userForm.password, is_admin: userForm.is_admin })
      setUsers((current) => editingUser ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved])
      if (selectedUser?.id === saved.id) setSelectedUser(saved)
      setUserModalOpen(false)
    } catch (error) { setUserError(error instanceof Error ? error.message : 'Unable to save user') }
  }

  const saveRole = async () => {
    if (!roleForm.name.trim()) return
    try {
      const saved = editingRole ? await roleService.updateRole(editingRole.id, { name: roleForm.name.trim(), description: roleForm.description.trim() || null }) : await roleService.createRole(roleForm.name.trim(), roleForm.description.trim() || null)
      setRoles((current) => editingRole ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved])
      if (selectedRole?.id === saved.id) setSelectedRole(saved)
      setRoleModalOpen(false)
    } catch (error) { setRoleError(error instanceof Error ? error.message : 'Unable to save role') }
  }

  const removeUser = async (item: User) => { if (!window.confirm(`Delete ${item.username}?`)) return; try { await userService.deleteUser(item.id); setUsers((current) => current.filter((entry) => entry.id !== item.id)); if (selectedUser?.id === item.id) setActiveNav('Users') } catch (error) { setUserError(error instanceof Error ? error.message : 'Unable to delete user') } }
  const removeRole = async (item: Role) => { if (!window.confirm(`Delete ${item.name}?`)) return; try { await roleService.deleteRole(item.id); setRoles((current) => current.filter((entry) => entry.id !== item.id)); if (selectedRole?.id === item.id) setActiveNav('Roles') } catch (error) { setRoleError(error instanceof Error ? error.message : 'Unable to delete role') } }

  const filteredResources = useMemo(() => resources.filter((resource) => resource.name.toLowerCase().includes(query.toLowerCase()) && (domain === 'All' || resource.domain === domain)), [domain, query, resources])

  const submitLogin = async (event: FormEvent) => { event.preventDefault(); setLoggingIn(true); setLoginError(''); try { setUser(await authService.login(username, password)); setPassword('') } catch (error) { setLoginError(error instanceof Error ? error.message : 'Unable to sign in') } finally { setLoggingIn(false) } }

  if (checkingSession) return <div className="auth-screen"><div className="auth-panel"><span className="brand-mark"><Database size={18} /></span><p>Connecting to Ledgerline...</p></div></div>
  if (!user) return <div className="auth-screen"><form className="auth-panel" onSubmit={submitLogin}><div className="brand auth-brand"><span className="brand-mark"><Database size={18} /></span><span>ledgerline</span></div><p className="eyebrow">SECURE CONSOLE</p><h1>Sign in to your workspace</h1><p className="subtitle">Use your FastAPI account to continue.</p><label>Username<input autoFocus value={username} onChange={(event) => setUsername(event.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{loginError && <p className="auth-error">{loginError}</p>}<button className="primary-button auth-submit" disabled={loggingIn}>{loggingIn ? 'Signing in...' : 'Sign in'}</button></form></div>

  const visibleNav = adminPages.filter((item) => item.id === 'overview' || (item.permission && can(item.permission)))
  return <div className="app-shell"><aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}><div className="sidebar-header"><div className="brand"><span className="brand-mark"><Database size={18} /></span><span>ledgerline</span></div><button className="sidebar-toggle" type="button" onClick={() => setSidebarCollapsed((current) => !current)} aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}>{sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}</button></div><div className="workspace-switcher"><span className="workspace-dot" /><span>Acme workspace</span><ChevronDown size={15} /></div><nav className="nav-list">{visibleNav.map((item) => { const Icon = item.icon; return <div key={item.id}>{item.group && visibleNav.find((nav) => nav.group === item.group)?.id === item.id && <span className="nav-group">{item.group}</span>}<button className={`nav-item ${activeNav === item.label ? 'active' : ''}`} onClick={() => { if (item.id === 'overview') setRoute('overview'); if (item.id === 'users') setRoute('users'); if (item.id === 'roles') setRoute('roles'); if (item.id === 'permissions') setRoute('permissions'); if (item.id === 'counters') setRoute('counters'); }}><Icon size={17} /><span>{item.label}</span></button></div> })}</nav><div className="sidebar-bottom"><button className="nav-item"><BookOpen size={17} /><span>Documentation</span></button><button className="nav-item"><CircleHelp size={17} /><span>Help center</span></button><button className="profile" onClick={() => authService.logout().then(() => setUser(null))}><div className="avatar">{user.username.slice(0, 2).toUpperCase()}</div><div><strong>{user.username}</strong><small>{user.is_admin ? 'Admin' : 'Member'}</small></div><MoreHorizontal size={17} /></button></div></aside>
    <main className="main-content"><header className="topbar"><div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>{activeNav}</strong></div><div className="top-actions"><button className="icon-button" type="button" onClick={() => setSidebarCollapsed((current) => !current)} aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}>{sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}</button><button className="icon-button" aria-label="Notifications"><Bell size={18} /></button><button className="help-button"><CircleHelp size={16} /> Support</button></div></header><section className="page-header"><div><p className="eyebrow">RESOURCE MANAGEMENT</p><h1>{activeNav === 'Overview' ? 'Your resource library' : activeNav}</h1><p className="subtitle">Manage the building blocks behind your application.</p></div></section><section className="stat-grid"><div className="stat-card"><span className="stat-label">Total resources</span><strong>{resources.length}</strong><span className="stat-note">Live backend resources</span></div><div className="stat-card"><span className="stat-label">Authentication</span><strong>{resources.filter((item) => item.domain === 'Auth').length}</strong><span className="stat-note">Users, roles & access</span></div><div className="stat-card"><span className="stat-label">Finance</span><strong>{resources.filter((item) => item.domain === 'Finance').length}</strong><span className="stat-note">Rules & operations</span></div><div className="stat-card accent"><span className="stat-label">Active resources</span><strong>{resources.filter((item) => item.status === 'Active').length}</strong><span className="stat-note">Ready for production</span></div></section>
      {activeNav === 'Users' && <UsersPage canCreate={can('users:create')} canEdit={can('users:update')} canDelete={can('users:delete')} onCreate={() => openUserEditor(null)} onOpen={openUser} onEdit={openUserEditor} onDelete={removeUser} error={userError} />}
      {activeNav === 'User details' && selectedUser && <UserDetailPage user={selectedUser} roles={roles} assignedRoles={userRoleMap[selectedUser.id] ?? []} canEdit={can('users:update')} canAssign={can('role_permissions:read')} onBack={() => setRoute('users')} onEdit={() => openUserEditor(selectedUser)} onOpenRole={openRole} onToggleRole={(roleId) => toggleUserRole(selectedUser.id, roleId)} error={assignmentError} />}
      {activeNav === 'Roles' && <RolesPage canCreate={can('role:create')} canEdit={can('role:update')} canDelete={can('role:delete')} onCreate={() => openRoleEditor(null)} onOpen={openRole} onEdit={openRoleEditor} onDelete={removeRole} error={roleError} />}
      {activeNav === 'Role details' && selectedRole && <RoleDetailPage role={selectedRole} permissions={permissions} assignedPermissions={rolePermissionMap[selectedRole.id] ?? []} canEdit={can('role:update')} canAssign={can('role_permissions:read')} onBack={() => setRoute('roles')} onEdit={() => openRoleEditor(selectedRole)} onTogglePermission={(permissionId) => toggleRolePermission(selectedRole.id, permissionId)} error={assignmentError} />}
      {activeNav === 'Permissions' && <PermissionCatalogPage permissions={permissions} />}
      {activeNav === 'Counters' && <CountersPage key={counterRefreshKey} canCreate={can('counters:create')} canEdit={can('counters:update')} canDelete={can('counters:delete')} onCreate={() => openCounterEditor(null)} onOpen={openCounter} onEdit={openCounterEditor} onDelete={removeCounter} error={counterError} />}
      {activeNav === 'Counter details' && selectedCounter && <CounterDetailPage counter={selectedCounter} canEdit={can('counters:update')} canDelete={can('counters:delete')} onBack={() => setRoute('counters')} onEdit={() => openCounterEditor(selectedCounter)} onDelete={() => removeCounter(selectedCounter)} error={counterError} />}
      {activeNav === 'Overview' && <section className="resource-section"><div className="section-heading"><div><h2>All resources</h2><p>Collections and policy sets across your workspace.</p></div><button className="filter-button"><SlidersHorizontal size={15} /> Customize</button></div><div className="toolbar"><div className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resources" /></div><div className="filter-tabs">{(['All', 'Auth', 'Finance'] as const).map((item) => <button key={item} className={domain === item ? 'selected' : ''} onClick={() => setDomain(item)}>{item === 'Auth' ? 'Authentication' : item}</button>)}</div><button className="filter-icon" aria-label="Filter"><Filter size={16} /></button></div><div className="table-wrap"><table><thead><tr><th>Resource</th><th>Domain</th><th>Status</th><th>Last updated</th><th>Owner</th></tr></thead><tbody>{filteredResources.map((resource) => { const Icon = resource.icon; return <tr key={resource.id}><td><div className="resource-name"><span className={`resource-icon ${resource.domain.toLowerCase()}`}><Icon size={17} /></span><div><strong>{resource.name}</strong><small>{resource.type}</small></div></div></td><td>{resource.domain}</td><td>{resource.status}</td><td>{resource.updated}</td><td>{resource.owner}</td></tr> })}</tbody></table>{filteredResources.length === 0 && <div className="empty-state">No resources match your search.</div>}</div></section>}
      <footer><span>Ledgerline console</span><span>Updated moments ago</span></footer></main>
    {userModalOpen && <UserFormModal user={editingUser} isAdmin={user.is_admin} form={userForm} error={userError} onChange={setUserForm} onClose={() => setUserModalOpen(false)} onSubmit={saveUser} />}
    {roleModalOpen && <RoleFormModal role={editingRole} form={roleForm} error={roleError} onChange={setRoleForm} onClose={() => setRoleModalOpen(false)} onSubmit={saveRole} />}
    {counterModalOpen && <CounterUpdateForm counter={editingCounter} error={counterFormError} onClose={() => setCounterModalOpen(false)} onSubmit={saveCounter} />}
  </div>
}

export default App
