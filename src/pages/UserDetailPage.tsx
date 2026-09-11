import { ArrowLeft, Edit3, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Role } from "../types/auth/role";
import type { User } from "../types/auth/user";

type UserDetailPageProps = {
  user: User;
  roles: Role[];
  assignedRoles: Role[];
  canEdit: boolean;
  canAssign: boolean;
  canManageAdmin: boolean;
  onBack: () => void;
  onEdit: () => void;
  onOpenRole: (role: Role) => void;
  onToggleRole: (roleId: number) => void;
  onToggleAdmin: () => void;
  error: string;
};

export function UserDetailPage({
  user,
  roles,
  assignedRoles,
  canEdit,
  canAssign,
  canManageAdmin,
  onBack,
  onEdit,
  onOpenRole,
  onToggleRole,
  onToggleAdmin,
  error,
}: UserDetailPageProps) {
  const [search, setSearch] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const availableRoles = useMemo(() => {
    const assignedIds = new Set(assignedRoles.map((role) => role.id));
    return roles.filter((role) => !assignedIds.has(role.id));
  }, [assignedRoles, roles]);

  const matchingRoles = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return availableRoles;
    return availableRoles.filter(
      (role) =>
        role.name.toLowerCase().includes(query) ||
        (role.description ?? "").toLowerCase().includes(query),
    );
  }, [availableRoles, search]);

  useEffect(() => {
    if (!matchingRoles.length) {
      setSelectedRoleId(null);
      return;
    }
    setSelectedRoleId((current) =>
      current !== null && matchingRoles.some((role) => role.id === current)
        ? current
        : matchingRoles[0].id,
    );
  }, [matchingRoles]);

  const addSelectedRole = () => {
    if (selectedRoleId === null || !canAssign) return;
    onToggleRole(selectedRoleId);
  };

  return (
    <section className="detail-page">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={16} /> Back to users
      </button>
      <div className="detail-header">
        <div>
          <p className="eyebrow">USER DETAILS</p>
          <h2>{user.username}</h2>
          <p className="subtitle">
            User ID {user.id} · {user.is_admin ? "Administrator" : "Member"}
          </p>
        </div>
        {canEdit && (
          <button className="secondary-button" onClick={onEdit}>
            <Edit3 size={15} /> Edit user
          </button>
        )}
      </div>
      {error && <p className="auth-error">{error}</p>}
      <div className="detail-grid">
        <div className="detail-card">
          <span className="stat-label">Account access</span>
          <strong>{user.is_admin ? "Administrator" : "Member"}</strong>
          <p>
            {user.is_admin
              ? "This account bypasses permission checks."
              : "This account is governed by assigned roles."}
          </p>
          {canManageAdmin && (
            <button
              className={
                user.is_admin
                  ? "danger-button ghost-button"
                  : "secondary-button compact-button"
              }
              onClick={onToggleAdmin}
            >
              {user.is_admin ? "Revoke admin" : "Grant admin"}
            </button>
          )}
        </div>
        <div className="detail-card">
          <span className="stat-label">Assigned roles</span>
          <strong>{assignedRoles.length}</strong>
          <p>
            {assignedRoles.map((role) => role.name).join(", ") ||
              "No roles assigned."}
          </p>
        </div>
      </div>
      <div className="detail-section">
        <div className="section-heading">
          <div>
            <h3>Roles</h3>
            <p>Search, add, and remove roles for this user.</p>
          </div>
        </div>
        {canAssign ? (
          <div className="assignment-picker">
            <div className="assignment-search">
              <Search size={14} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search roles"
              />
            </div>
            <div className="assignment-actions">
              <select
                value={selectedRoleId ?? ""}
                onChange={(event) =>
                  setSelectedRoleId(
                    event.target.value ? Number(event.target.value) : null,
                  )
                }
                disabled={!matchingRoles.length}
              >
                <option value="">
                  {matchingRoles.length ? "Select a role" : "No roles left"}
                </option>
                {matchingRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <button
                className="primary-button compact-button"
                onClick={addSelectedRole}
                disabled={selectedRoleId === null}
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <p className="subtitle">
            You do not have permission to assign roles.
          </p>
        )}
        <div className="selected-assignment-list">
          {assignedRoles.length ? (
            assignedRoles.map((role) => (
              <div key={role.id} className="selected-assignment-item">
                <button
                  type="button"
                  className="selected-assignment-link"
                  onClick={() => onOpenRole(role)}
                >
                  <span>
                    <strong>{role.name}</strong>
                    <small>{role.description || "No description"}</small>
                  </span>
                </button>
                {canAssign ? (
                  <button
                    className="danger-button ghost-button"
                    onClick={() => onToggleRole(role.id)}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                ) : null}
              </div>
            ))
          ) : (
            <div className="empty-state compact-state">
              No roles assigned yet.
            </div>
          )}
        </div>
        {roles.length === 0 && (
          <div className="empty-state">No roles available.</div>
        )}
      </div>
    </section>
  );
}
