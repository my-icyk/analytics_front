import { X } from 'lucide-react'
import type { User } from '../../types/auth/user'
import type { UserForm } from '../../types/forms'

type UserFormModalProps = {
  user: User | null
  isAdmin: boolean
  form: UserForm
  error: string
  onChange: (form: UserForm) => void
  onClose: () => void
  onSubmit: () => void
}

export function UserFormModal({ user, isAdmin, form, error, onChange, onClose, onSubmit }: UserFormModalProps) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={(event) => event.stopPropagation()}><div className="modal-header"><h2>{user ? 'Edit user' : 'Create user'}</h2><button className="icon-button" aria-label="Close" onClick={onClose}><X size={16} /></button></div>{error && <p className="auth-error">{error}</p>}<label>Username<input value={form.username} onChange={(event) => onChange({ ...form, username: event.target.value })} placeholder="Enter username" /></label><label>Password<input type="password" value={form.password} onChange={(event) => onChange({ ...form, password: event.target.value })} placeholder={user ? 'Leave blank to keep current password' : 'Enter password'} /></label><label className="checkbox-label"><input type="checkbox" checked={form.is_admin} disabled={!isAdmin} onChange={(event) => onChange({ ...form, is_admin: event.target.checked })} /> Administrator access</label><div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={onSubmit}>{user ? 'Save changes' : 'Create user'}</button></div></div></div>
}
