import { ArrowLeft, Edit3, Search, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { Permission } from '../types/auth/permission'
import type { Role } from '../types/auth/role'

type RoleDetailPageProps = {
  role: Role
  permissions: Permission[]
  assignedPermissions: Permission[]
  canEdit: boolean
  canAssign: boolean
  onBack: () => void
  onEdit: () => void
  onTogglePermission: (permissionId: number) => void
  error: string
}

export function RoleDetailPage({ role, permissions, assignedPermissions, canEdit, canAssign, onBack, onEdit, onTogglePermission, error }: RoleDetailPageProps) {
  const [search, setSearch] = useState('')
  const [selectedPermissionId, setSelectedPermissionId] = useState<number | null>(null)

  const availablePermissions = useMemo(() => {
    const assignedIds = new Set(assignedPermissions.map((permission) => permission.id))
    return permissions.filter((permission) => !assignedIds.has(permission.id))
  }, [assignedPermissions, permissions])

  const matchingPermissions = useMemo(() => {
    const query = search.toLowerCase().trim()
    if (!query) return availablePermissions
    return availablePermissions.filter((permission) => permission.name.toLowerCase().includes(query))
  }, [availablePermissions, search])

  useEffect(() => {
    if (!matchingPermissions.length) {
      setSelectedPermissionId(null)
      return
    }
    setSelectedPermissionId((current) => current !== null && matchingPermissions.some((permission) => permission.id === current) ? current : matchingPermissions[0].id)
  }, [matchingPermissions])

  const addSelectedPermission = () => {
    if (selectedPermissionId === null || !canAssign) return
    onTogglePermission(selectedPermissionId)
  }

  return <section className="detail-page">
    <button className="back-button" onClick={onBack}><ArrowLeft size={16} /> Back to roles</button>
    <div className="detail-header"><div><p className="eyebrow">ROLE DETAILS</p><h2>{role.name}</h2><p className="subtitle">Created {new Date(role.created_at).toLocaleDateString()} · {role.description || 'No description'}</p></div>{canEdit && <button className="secondary-button" onClick={onEdit}><Edit3 size={15} /> Edit role</button>}</div>
    {error && <p className="auth-error">{error}</p>}
    <div className="detail-grid"><div className="detail-card"><span className="stat-label">Description</span><strong>{role.description || 'No description'}</strong><p>Role metadata can be updated without changing its assignments.</p></div><div className="detail-card"><span className="stat-label">Assigned permissions</span><strong>{assignedPermissions.length}</strong><p>{assignedPermissions.map((permission) => permission.name).join(', ') || 'No permissions assigned.'}</p></div></div>
    <div className="detail-section"><div className="section-heading"><div><h3>Permissions</h3><p>Search, add, and remove permissions for this role.</p></div></div>{canAssign ? <div className="assignment-picker"><div className="assignment-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search permissions" /></div><div className="assignment-actions"><select value={selectedPermissionId ?? ''} onChange={(event) => setSelectedPermissionId(event.target.value ? Number(event.target.value) : null)} disabled={!matchingPermissions.length}><option value="">{matchingPermissions.length ? 'Select a permission' : 'No permissions left'}</option>{matchingPermissions.map((permission) => <option key={permission.id} value={permission.id}>{permission.name}</option>)}</select><button className="primary-button compact-button" onClick={addSelectedPermission} disabled={selectedPermissionId === null}>Add</button></div></div> : <p className="subtitle">You do not have permission to manage permissions.</p>}<div className="selected-assignment-list">{assignedPermissions.length ? assignedPermissions.map((permission) => <div key={permission.id} className="selected-assignment-item"><span><strong>{permission.name}</strong><small>Backend permission</small></span>{canAssign ? <button className="danger-button ghost-button" onClick={() => onTogglePermission(permission.id)}><Trash2 size={13} /> Remove</button> : null}</div>) : <div className="empty-state compact-state">No permissions assigned yet.</div>}</div>{permissions.length === 0 && <div className="empty-state">No permissions available.</div>}</div>
  </section>
}
