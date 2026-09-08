import { Plus } from 'lucide-react'
import { DataTable, type DataTableColumn } from '../components/DataTable/DataTable'
import { userService } from '../services/userService'
import type { User } from '../types/auth/user'

type UsersPageProps = {
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  onCreate: () => void
  onOpen: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  error: string
}

export function UsersPage({ canCreate, canEdit, canDelete, onCreate, onOpen, onEdit, onDelete, error }: UsersPageProps) {
  const columns: DataTableColumn<User>[] = [
    { key: 'username', header: 'Username', render: (item) => <button className="link-button" onClick={() => onOpen(item)}><strong>{item.username}</strong></button> },
    { key: 'access', header: 'Access', render: (item) => <span className={`status ${item.is_admin ? 'active' : 'draft'}`}><span />{item.is_admin ? 'Administrator' : 'Member'}</span> },
    { key: 'id', header: 'User ID', render: (item) => item.id },
    { key: 'actions', header: 'Actions', render: (item) => <div className="table-actions">{canEdit && <button className="secondary-button compact-button" onClick={() => onEdit(item)}>Edit</button>}{canDelete && <button className="danger-button" onClick={() => onDelete(item)}>Delete</button>}</div> },
  ]

  return <section className="management-panel"><div className="section-heading"><div><h2>Users</h2><p>Manage workspace accounts and administrator access.</p></div>{canCreate && <button className="primary-button" onClick={onCreate}><Plus size={17} /> New user</button>}</div><DataTable columns={columns} rowKey={(item) => item.id} fetchPage={(cursorId) => userService.listUsersPage(cursorId, 20)} emptyMessage="No users available." error={error} /></section>
}
