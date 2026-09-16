import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import type { Division, Group, GroupCreate, GroupType } from "../types/finance";
import { GroupFormModal } from "../components/finance/GroupFormModal";

type GroupsPageProps = {
  groups: Group[];
  divisions: Division[];
  groupTypes: GroupType[];
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onOpenGroup: (group: Group) => void;
  onCreateGroup: (payload: GroupCreate) => Promise<void>;
  onUpdateGroup: (groupId: number, payload: GroupCreate) => Promise<void>;
  onDeleteGroup: (group: Group) => Promise<void>;
  error: string;
};

export function GroupsPage({
  groups,
  divisions,
  groupTypes,
  canCreate,
  canEdit,
  canDelete,
  onOpenGroup,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
  error,
}: GroupsPageProps) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [modalError, setModalError] = useState("");

  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return groups;
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.division?.name?.toLowerCase().includes(q) ||
        g.group_type?.name?.toLowerCase().includes(q) ||
        String(g.id).includes(q),
    );
  }, [groups, search]);

  const handleOpenCreate = () => {
    setEditingGroup(null);
    setModalError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (group: Group) => {
    setEditingGroup(group);
    setModalError("");
    setModalOpen(true);
  };

  const handleSaveGroup = async (payload: GroupCreate) => {
    try {
      if (editingGroup) {
        await onUpdateGroup(editingGroup.id, payload);
      } else {
        await onCreateGroup(payload);
      }
      setModalOpen(false);
    } catch (err) {
      setModalError(
        err instanceof Error ? err.message : "Failed to save group",
      );
      throw err;
    }
  };

  const handleDelete = (group: Group) => {
    if (
      window.confirm(`Are you sure you want to delete group "${group.name}"?`)
    ) {
      void onDeleteGroup(group);
    }
  };

  return (
    <section className="management-panel">
      <div className="section-heading">
        <div>
          <h2>Finance Groups</h2>
          <p>
            Configure business groups, divisional alignment, and cost centers.
          </p>
        </div>
        {canCreate && (
          <button className="primary-button" onClick={handleOpenCreate}>
            <Plus size={17} /> New group
          </button>
        )}
      </div>

      {error && <p className="auth-error">{error}</p>}

      <div className="toolbar">
        <div className="search-box">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search groups, divisions, types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Group Name</th>
              <th>Division</th>
              <th>Group Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map((group) => (
              <tr key={group.id}>
                <td>{group.id}</td>
                <td>
                  <button
                    className="link-button"
                    onClick={() => onOpenGroup(group)}
                  >
                    <strong>{group.name}</strong>
                  </button>
                </td>
                <td>
                  <span className="domain-pill finance">
                    {group.division?.name ?? "—"}
                  </span>
                </td>
                <td>
                  <span className="domain-pill auth">
                    {group.group_type?.name ?? "—"}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="secondary-button compact-button"
                      onClick={() => onOpenGroup(group)}
                    >
                      Open
                    </button>
                    {canEdit && (
                      <button
                        className="secondary-button compact-button"
                        onClick={() => handleOpenEdit(group)}
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="danger-button compact-button"
                        onClick={() => handleDelete(group)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredGroups.length === 0 && (
          <div className="empty-state">
            {groups.length === 0
              ? "No finance groups found."
              : "No groups matching search."}
          </div>
        )}
      </div>

      {modalOpen && (
        <GroupFormModal
          group={editingGroup}
          divisions={divisions}
          groupTypes={groupTypes}
          error={modalError}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSaveGroup}
        />
      )}
    </section>
  );
}
