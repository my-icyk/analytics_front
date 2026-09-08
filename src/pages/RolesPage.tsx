import { Plus } from 'lucide-react'
import { DataTable, type DataTableColumn } from '../components/DataTable/DataTable'
import { roleService } from '../services/roleService'
import type { Role } from '../types/auth/role'

type RolesPageProps = {
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  onCreate: () => void
  onOpen: (role: Role) => void
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
  error: string
}

export function RolesPage({ canCreate, canEdit, canDelete, onCreate, onOpen, onEdit, onDelete, error }: RolesPageProps) {
  const columns: DataTableColumn<Role>[] = [
    { key: 'name', header: 'Name', render: (role) => <button className="link-button" onClick={() => onOpen(role)}><strong>{role.name}</strong></button> },
    { key: 'description', header: 'Description', render: (role) => role.description || 'No description' },
    { key: 'created', header: 'Created', render: (role) => new Date(role.created_at).toLocaleDateString() },
    { key: 'actions', header: 'Actions', render: (role) => <div className="table-actions">{canEdit && <button className="secondary-button compact-button" onClick={() => onEdit(role)}>Edit</button>}{canDelete && <button className="danger-button" onClick={() => onDelete(role)}>Delete</button>}</div> },
  ]

  return <section className="management-panel"><div className="section-heading"><div><h2>Roles</h2><p>Roles currently available in the backend.</p></div>{canCreate && <button className="primary-button" onClick={onCreate}><Plus size={17} /> New role</button>}</div><DataTable columns={columns} rowKey={(role) => role.id} fetchPage={(cursorId) => roleService.listRolesPage(cursorId, 20)} emptyMessage="No roles available." error={error} /></section>
}
