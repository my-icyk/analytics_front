import { ArrowLeft, Edit3 } from 'lucide-react'
import { Permission, Role } from '../api'

type RoleDetailProps = {
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

export function RoleDetail({ role, permissions, assignedPermissions, canEdit, canAssign, onBack, onEdit, onTogglePermission, error }: RoleDetailProps) {
  return <section className="detail-page">
    <button className="back-button" onClick={onBack}><ArrowLeft size={16} /> Back to roles</button>
    <div className="detail-header"><div><p className="eyebrow">ROLE DETAILS</p><h2>{role.name}</h2><p className="subtitle">Created {new Date(role.created_at).toLocaleDateString()} · {role.description || 'No description'}</p></div>{canEdit && <button className="secondary-button" onClick={onEdit}><Edit3 size={15} /> Edit role</button>}</div>
    {error && <p className="auth-error">{error}</p>}
    <div className="detail-grid"><div className="detail-card"><span className="stat-label">Description</span><strong>{role.description || 'No description'}</strong><p>Role metadata can be updated without changing its assignments.</p></div><div className="detail-card"><span className="stat-label">Assigned permissions</span><strong>{assignedPermissions.length}</strong><p>{assignedPermissions.map((permission) => permission.name).join(', ') || 'No permissions assigned.'}</p></div></div>
    <div className="detail-section"><div className="section-heading"><div><h3>Permissions</h3><p>Manage the permissions granted to this role.</p></div></div><div className="assignment-list detail-assignment-list">{permissions.map((permission) => { const checked = assignedPermissions.some((assignedPermission) => assignedPermission.id === permission.id); return <label key={permission.id} className={`toggle-check ${!canAssign ? 'read-only' : ''}`}><input type="checkbox" checked={checked} disabled={!canAssign} onChange={() => onTogglePermission(permission.id)} /> <span><strong>{permission.name}</strong><small>Backend permission</small></span></label> })}</div>{permissions.length === 0 && <div className="empty-state">No permissions available.</div>}</div>
  </section>
}
