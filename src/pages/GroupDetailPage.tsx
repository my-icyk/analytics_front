import { useState } from "react";
import { ArrowLeft, Edit3, ExternalLink, Plus, Trash2 } from "lucide-react";
import type {
  Division,
  Group,
  GroupCreate,
  GroupType,
  Rule,
  RuleCreate,
  DepartmentRepartition,
} from "../types/finance";
import { GroupRulesSection } from "../components/GroupRulesSection";
import { GroupFormModal } from "../components/finance/GroupFormModal";
import { RuleFormModal } from "../components/finance/RuleFormModal";

type GroupDetailPageProps = {
  group: Group;
  allGroups: Group[];
  divisions: Division[];
  groupTypes: GroupType[];
  rules: Rule[];
  departmentRepartitions: DepartmentRepartition[];
  canEditGroup: boolean;
  canDeleteGroup: boolean;
  canCreateRule: boolean;
  canEditRule: boolean;
  canDeleteRule: boolean;
  onBack: () => void;
  onSelectGroup: (groupId: number) => void;
  onUpdateGroup: (groupId: number, payload: GroupCreate) => Promise<void>;
  onDeleteGroup: (group: Group) => Promise<void>;
  onOpenRule: (rule: Rule) => void;
  onCreateRule: (payload: RuleCreate) => Promise<void>;
  onUpdateRule: (ruleId: number, payload: RuleCreate) => Promise<void>;
  onDeleteRule: (rule: Rule) => Promise<void>;
  error: string;
};

export function GroupDetailPage({
  group,
  allGroups,
  divisions,
  groupTypes,
  rules,
  departmentRepartitions,
  canEditGroup,
  canDeleteGroup,
  canCreateRule,
  canEditRule,
  canDeleteRule,
  onBack,
  onSelectGroup,
  onUpdateGroup,
  onDeleteGroup,
  onOpenRule,
  onCreateRule,
  onUpdateRule,
  onDeleteRule,
  error,
}: GroupDetailPageProps) {
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [modalError, setModalError] = useState("");

  const handleOpenEditGroup = () => {
    setModalError("");
    setGroupModalOpen(true);
  };

  const handleSaveGroup = async (payload: GroupCreate) => {
    try {
      await onUpdateGroup(group.id, payload);
      setGroupModalOpen(false);
    } catch (err) {
      setModalError(
        err instanceof Error ? err.message : "Failed to update group",
      );
      throw err;
    }
  };

  const handleDeleteGroup = () => {
    if (
      window.confirm(`Are you sure you want to delete group "${group.name}"?`)
    ) {
      void onDeleteGroup(group);
    }
  };

  const handleOpenCreateRule = () => {
    setEditingRule(null);
    setModalError("");
    setRuleModalOpen(true);
  };

  const handleOpenEditRule = (rule: Rule) => {
    setEditingRule(rule);
    setModalError("");
    setRuleModalOpen(true);
  };

  const handleSaveRule = async (payload: RuleCreate) => {
    try {
      if (editingRule) {
        await onUpdateRule(editingRule.id, payload);
      } else {
        await onCreateRule(payload);
      }
      setRuleModalOpen(false);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Failed to save rule");
      throw err;
    }
  };

  const handleDeleteRule = (rule: Rule) => {
    if (
      window.confirm(`Are you sure you want to delete rule "${rule.name}"?`)
    ) {
      void onDeleteRule(rule);
    }
  };

  return (
    <section className="detail-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={16} /> Back to groups
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 600 }}
          >
            Switch group:
          </span>
          <select
            value={group.id}
            onChange={(e) => onSelectGroup(Number(e.target.value))}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid var(--line)",
              fontSize: "12px",
              background: "var(--paper)",
              color: "var(--ink)",
            }}
          >
            {allGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.division?.name ?? "No division"})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="detail-header">
        <div>
          <p className="eyebrow">FINANCE GROUP</p>
          <h2>{group.name}</h2>
          <p className="subtitle">
            Group ID #{group.id} · Division: {group.division?.name ?? "—"} ·
            Type: {group.group_type?.name ?? "—"}
          </p>
        </div>
        <div className="table-actions">
          {canEditGroup && (
            <button className="secondary-button" onClick={handleOpenEditGroup}>
              <Edit3 size={15} /> Edit group
            </button>
          )}
          {canDeleteGroup && (
            <button className="danger-button" onClick={handleDeleteGroup}>
              <Trash2 size={15} /> Delete group
            </button>
          )}
        </div>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <div className="detail-grid">
        <div className="detail-card">
          <span className="stat-label">Division</span>
          <strong>{group.division?.name ?? "—"}</strong>
          <p>Organizational division assigned to this financial group.</p>
        </div>
        <div className="detail-card">
          <span className="stat-label">Group Category & Type</span>
          <strong>{group.group_type?.name ?? "—"}</strong>
          <p>Classification for calculation and reporting rules.</p>
        </div>
      </div>

      <GroupRulesSection
        groupName={group.name}
        rules={rules}
        onCreateRule={handleOpenCreateRule}
        onOpenRule={onOpenRule}
        onEditRule={handleOpenEditRule}
        onDeleteRule={handleDeleteRule}
      />
      <div className="detail-section">
        <div className="section-heading">
          <div>
            <h3>Allocated Departments</h3>
            <p>Departments allocated to {group.name}.</p>
          </div>
          {canCreateRule && (
            <button className="primary-button" onClick={handleOpenCreateRule}>
              <Plus size={16} /> New rule
            </button>
          )}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Code</th>
                <th>From</th>
                <th>To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departmentRepartitions.map((repartition) => (
                <tr key={repartition.id}>
                  <td>{repartition.id}</td>
                  <td>{repartition.department_name}</td>
                  <td>{repartition.department_code}</td>
                  <td>{repartition.valid_from}</td>
                  <td>
                    {repartition.valid_to || (
                      <span style={{ color: "var(--muted)" }}>Ongoing</span>
                    )}
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        className="secondary-button icon-action-button"
                        title="Manage targets"
                        aria-label="Manage targets"
                        //onClick={() => onOpenDepartmentRepartition(repartition)}
                      >
                        <ExternalLink size={14} />
                      </button>
                      {canEditRule && (
                        <button
                          className="secondary-button icon-action-button"
                          title="Edit rule"
                          aria-label="Edit rule"
                          //onClick={() => handleOpenEditRule(repartition)}
                        >
                          <Edit3 size={14} />
                        </button>
                      )}
                      {canDeleteRule && (
                        <button
                          className="danger-button icon-action-button"
                          title="Delete rule"
                          aria-label="Delete rule"
                          //onClick={() => handleDeleteRule(repartition)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {departmentRepartitions.length === 0 && (
            <div className="empty-state">
              No departments allocated to this group yet.
            </div>
          )}
        </div>
      </div>

      {groupModalOpen && (
        <GroupFormModal
          group={group}
          divisions={divisions}
          groupTypes={groupTypes}
          error={modalError}
          onClose={() => setGroupModalOpen(false)}
          onSubmit={handleSaveGroup}
        />
      )}

      {ruleModalOpen && (
        <RuleFormModal
          rule={editingRule}
          groupId={group.id}
          error={modalError}
          onClose={() => setRuleModalOpen(false)}
          onSubmit={handleSaveRule}
        />
      )}
    </section>
  );
}
