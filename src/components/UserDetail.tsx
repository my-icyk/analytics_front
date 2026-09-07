import { ArrowLeft, Edit3 } from 'lucide-react'
import { Role, User } from '../api'

type UserDetailProps = {
  user: User
  roles: Role[]
  assignedRoles: Role[]
  canEdit: boolean
  canAssign: boolean
  onBack: () => void
  onEdit: () => void
  onToggleRole: (roleId: number) => void
  error: string
}

export function UserDetail({ user, roles, assignedRoles, canEdit, canAssign, onBack, onEdit, onToggleRole, error }: UserDetailProps) {
  return <section className="detail-page">
    <button className="back-button" onClick={onBack}><ArrowLeft size={16} /> Back to users</button>
    <div className="detail-header"><div><p className="eyebrow">USER DETAILS</p><h2>{user.username}</h2><p className="subtitle">User ID {user.id} · {user.is_admin ? 'Administrator' : 'Member'}</p></div>{canEdit && <button className="secondary-button" onClick={onEdit}><Edit3 size={15} /> Edit user</button>}</div>
    {error && <p className="auth-error">{error}</p>}
    <div className="detail-grid"><div className="detail-card"><span className="stat-label">Account access</span><strong>{user.is_admin ? 'Administrator' : 'Member'}</strong><p>{user.is_admin ? 'This account bypasses permission checks.' : 'This account is governed by assigned roles.'}</p></div><div className="detail-card"><span className="stat-label">Assigned roles</span><strong>{assignedRoles.length}</strong><p>{assignedRoles.map((role) => role.name).join(', ') || 'No roles assigned.'}</p></div></div>
    <div className="detail-section"><div className="section-heading"><div><h3>Roles</h3><p>Manage the roles assigned to this user.</p></div></div><div className="assignment-list detail-assignment-list">{roles.map((role) => { const checked = assignedRoles.some((assignedRole) => assignedRole.id === role.id); return <label key={role.id} className={`toggle-check ${!canAssign ? 'read-only' : ''}`}><input type="checkbox" checked={checked} disabled={!canAssign} onChange={() => onToggleRole(role.id)} /> <span><strong>{role.name}</strong><small>{role.description || 'No description'}</small></span></label> })}</div>{roles.length === 0 && <div className="empty-state">No roles available.</div>}</div>
  </section>
}
