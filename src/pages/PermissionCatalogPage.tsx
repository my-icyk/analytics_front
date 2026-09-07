import type { Permission } from '../types/auth/permission'

export function PermissionCatalogPage({ permissions }: { permissions: Permission[] }) {
  return <section className="management-panel"><div className="section-heading"><div><h2>Permissions</h2><p>Permission catalog provided by the backend. Permissions are read-only.</p></div></div><div className="permission-grid">{permissions.map((permission) => <span className="permission-chip" key={permission.id}>{permission.name}</span>)}</div>{permissions.length === 0 && <div className="empty-state">No permissions available.</div>}</section>
}
