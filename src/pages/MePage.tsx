import type { User } from "../types/auth/user";

type MePageProps = {
  user: User;
};

export function MePage({ user }: MePageProps) {
  return (
    <section className="detail-page">
      <div className="detail-header">
        <div>
          <p className="eyebrow">MY ACCOUNT</p>
          <h2>{user.username}</h2>
          <p className="subtitle">
            User ID {user.id} · {user.is_admin ? "Administrator" : "Member"}
          </p>
        </div>
      </div>
      <div className="document">
        <div className="document-field">
          <span className="document-label">User ID</span>
          <span className="document-value">{user.id}</span>
        </div>
        <div className="document-field">
          <span className="document-label">Username</span>
          <span className="document-value">{user.username}</span>
        </div>
        <div className="document-field">
          <span className="document-label">Access level</span>
          <span className="document-value">
            {user.is_admin ? "Administrator" : "Member"}
          </span>
        </div>
      </div>
      <div className="detail-section">
        <div className="section-heading">
          <div>
            <h3>Roles</h3>
            <p>Roles assigned to your account.</p>
          </div>
        </div>
        <div className="permission-grid">
          {user.roles.map((role) => (
            <span className="permission-chip" key={role}>
              {role}
            </span>
          ))}
        </div>
        {user.roles.length === 0 && (
          <div className="empty-state compact-state">
            No roles assigned yet.
          </div>
        )}
      </div>
      <div className="detail-section">
        <div className="section-heading">
          <div>
            <h3>Permissions</h3>
            <p>
              {user.is_admin
                ? "Administrators bypass permission checks."
                : "Granted through your assigned roles."}
            </p>
          </div>
        </div>
        <div className="permission-grid">
          {user.permissions.map((permission) => (
            <span className="permission-chip" key={permission}>
              {permission}
            </span>
          ))}
        </div>
        {user.permissions.length === 0 && !user.is_admin && (
          <div className="empty-state compact-state">
            No permissions assigned yet.
          </div>
        )}
      </div>
    </section>
  );
}
