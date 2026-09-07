import { X } from 'lucide-react'
import type { Role } from '../../types/auth/role'
import type { RoleForm } from '../../types/forms'

type RoleFormModalProps = {
  role: Role | null
  form: RoleForm
  error: string
  onChange: (form: RoleForm) => void
  onClose: () => void
  onSubmit: () => void
}

export function RoleFormModal({ role, form, error, onChange, onClose, onSubmit }: RoleFormModalProps) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={(event) => event.stopPropagation()}><div className="modal-header"><h2>{role ? 'Edit role' : 'Create role'}</h2><button className="icon-button" aria-label="Close" onClick={onClose}><X size={16} /></button></div>{error && <p className="auth-error">{error}</p>}<label>Name<input value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} placeholder="Role name" /></label><label>Description<input value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} placeholder="Optional description" /></label><div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={onSubmit}>{role ? 'Save changes' : 'Create role'}</button></div></div></div>
}
