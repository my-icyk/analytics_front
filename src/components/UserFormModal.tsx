import { X } from 'lucide-react'
import { User } from '../api'

type UserFormModalProps = {
  user: User | null
  isAdmin: boolean
  form: { username: string; password: string; is_admin: boolean }
  error: string
  onChange: (form: UserFormModalProps['form']) => void
  onClose: () => void
  onSubmit: () => void
}

export function UserFormModal({ user, isAdmin, form, error, onChange, onClose, onSubmit }: UserFormModalProps) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">USER MANAGEMENT</p><h2>{user ? 'Edit user' : 'Create user'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></div><label>Username<input autoFocus value={form.username} onChange={(event) => onChange({ ...form, username: event.target.value })} /></label><label>{user ? 'New password (optional)' : 'Password'}<input type="password" value={form.password} onChange={(event) => onChange({ ...form, password: event.target.value })} /></label>{isAdmin && <label className="checkbox-label"><input type="checkbox" checked={form.is_admin} onChange={(event) => onChange({ ...form, is_admin: event.target.checked })} /> Administrator</label>}{error && <p className="auth-error">{error}</p>}<div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={onSubmit}>{user ? 'Save changes' : 'Create user'}</button></div></div></div>
}
