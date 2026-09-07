import { Plus } from 'lucide-react'
import type { Role } from '../types/auth/role'

type RolesPageProps = {
  roles: Role[]
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  onCreate: () => void
  onOpen: (role: Role) => void
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
  error: string
}

export function RolesPage({ roles, canCreate, canEdit, canDelete, onCreate, onOpen, onEdit, onDelete, error }: RolesPageProps) {
  return <section className="management-panel"><div className="section-heading"><div><h2>Roles</h2><p>Roles currently available in the backend.</p></div>{canCreate && <button className="primary-button" onClick={onCreate}><Plus size={17} /> New role</button>}</div>{error && <p className="auth-error">{error}</p>}<div className="table-wrap"><table><thead><tr><th>Name</th><th>Description</th><th>Created</th><th>Actions</th></tr></thead><tbody>{roles.map((role) => <tr key={role.id}><td><button className="link-button" onClick={() => onOpen(role)}><strong>{role.name}</strong></button></td><td>{role.description || 'No description'}</td><td>{new Date(role.created_at).toLocaleDateString()}</td><td className="table-actions">{canEdit && <button className="secondary-button compact-button" onClick={() => onEdit(role)}>Edit</button>}{canDelete && <button className="danger-button" onClick={() => onDelete(role)}>Delete</button>}</td></tr>)}</tbody></table>{roles.length === 0 && <div className="empty-state">No roles available.</div>}</div></section>
}
