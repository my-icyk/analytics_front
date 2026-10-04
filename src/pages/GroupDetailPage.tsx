import { useState } from "react";
import { ArrowLeft, Edit3, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useGroupTypes } from "../features/finance/groups";
import type {
  Department,
  DepartmentRepartitionCreate,
  Group,
  GroupCreate,
  Rule,
  RuleCreate,
  DepartmentRepartition,
} from "../types/finance";
import { GroupRulesSection } from "../components/GroupRulesSection";
import { GroupFormModal } from "../components/finance/GroupFormModal";
import { RuleFormModal } from "../components/finance/RuleFormModal";
import { GroupDepartmentAllocationForm } from "../components/finance/GroupDepartmentAllocationForm";
import { GroupDeparmentSection } from "../components/GroupDeparmentSection";
import { useDivisions } from "../features/finance/divisions";
import { usePermissions } from "../auth/AuthContext";

type GroupDetailPageProps = {
  group: Group;
  allGroups: Group[];
  rules: Rule[];
  departmentRepartitions: DepartmentRepartition[];
  departments: Department[];
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
  onCreateDepartmentRepartition: (
    payload: DepartmentRepartitionCreate,
  ) => Promise<void>;
  error: string;
};

export function GroupDetailPage({
  group,
  allGroups,
  rules,
  departmentRepartitions,
  departments,
  onBack,
  onSelectGroup,
  onUpdateGroup,
  onDeleteGroup,
  onOpenRule,
  onCreateRule,
  onUpdateRule,
  onDeleteRule,
  onCreateDepartmentRepartition,
  error,
}: GroupDetailPageProps) {
  const { can } = usePermissions();
  const { data: groupTypes = [] } = useGroupTypes();
  const { data: divisions = [] } = useDivisions();
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
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

  const handleOpenCreateAllocation = () => {
    setModalError("");
    setAllocationModalOpen(true);
  };

  const handleSaveAllocation = async (payload: DepartmentRepartitionCreate) => {
    try {
      await onCreateDepartmentRepartition(payload);
      setAllocationModalOpen(false);
    } catch (err) {
      setModalError(
        err instanceof Error ? err.message : "Failed to allocate department",
      );
      throw err;
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
          {can("finance:group:update") && (
            <button className="secondary-button" onClick={handleOpenEditGroup}>
              <Edit3 size={15} /> Edit group
            </button>
          )}
          {can("finance:group:delete") && (
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
      <GroupDeparmentSection
        allocations={departmentRepartitions}
        onCreate={handleOpenCreateAllocation}
        onOpen={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />

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

      {allocationModalOpen && (
        <GroupDepartmentAllocationForm
          allocation={null}
          groupId={group.id}
          departments={departments}
          error={modalError}
          onClose={() => setAllocationModalOpen(false)}
          onSubmit={handleSaveAllocation}
        />
      )}
    </section>
  );
}
