import { Plus } from 'lucide-react'
import type { User } from '../types/auth/user'

type UsersPageProps = {
  users: User[]
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  onCreate: () => void
  onOpen: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  error: string
}

export function UsersPage({ users, canCreate, canEdit, canDelete, onCreate, onOpen, onEdit, onDelete, error }: UsersPageProps) {
  return <section className="management-panel"><div className="section-heading"><div><h2>Users</h2><p>Manage workspace accounts and administrator access.</p></div>{canCreate && <button className="primary-button" onClick={onCreate}><Plus size={17} /> New user</button>}</div>{error && <p className="auth-error">{error}</p>}<div className="table-wrap"><table><thead><tr><th>Username</th><th>Access</th><th>User ID</th><th>Actions</th></tr></thead><tbody>{users.map((item) => <tr key={item.id}><td><button className="link-button" onClick={() => onOpen(item)}><strong>{item.username}</strong></button></td><td><span className={`status ${item.is_admin ? 'active' : 'draft'}`}><span />{item.is_admin ? 'Administrator' : 'Member'}</span></td><td>{item.id}</td><td className="table-actions">{canEdit && <button className="secondary-button compact-button" onClick={() => onEdit(item)}>Edit</button>}{canDelete && <button className="danger-button" onClick={() => onDelete(item)}>Delete</button>}</td></tr>)}</tbody></table>{users.length === 0 && <div className="empty-state">No users available.</div>}</div></section>
}
