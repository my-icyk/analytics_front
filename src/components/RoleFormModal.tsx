import { X } from 'lucide-react'
import { Role } from '../api'

type RoleFormModalProps = {
  role: Role | null
  form: { name: string; description: string }
  error: string
  onChange: (form: RoleFormModalProps['form']) => void
  onClose: () => void
  onSubmit: () => void
}

export function RoleFormModal({ role, form, error, onChange, onClose, onSubmit }: RoleFormModalProps) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">ROLE MANAGEMENT</p><h2>{role ? 'Edit role' : 'Create role'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></div><label>Role name<input autoFocus value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} /></label><label>Description<input value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} /></label>{error && <p className="auth-error">{error}</p>}<div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={onSubmit}>{role ? 'Save changes' : 'Create role'}</button></div></div></div>
}
