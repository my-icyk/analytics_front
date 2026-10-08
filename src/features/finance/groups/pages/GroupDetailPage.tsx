import { useState } from "react";
import { ArrowLeft, Edit3, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useGroupTypes } from "..";
import type { Rule, RuleCreate } from "../../../../types/finance";
import type { Group, GroupCreate } from "../groups.types";
import { GroupRulesSection } from "../../../../components/GroupRulesSection";
import { GroupFormModal } from "../../../../components/finance/GroupFormModal";
import { RuleFormModal } from "../../../../components/finance/RuleFormModal";
import { GroupDepartmentAllocationForm } from "../../../../components/finance/GroupDepartmentAllocationForm";
import { GroupDeparmentSection } from "../../repartitions/components/GroupRepartitionsTab";
import { useDivisions } from "../../divisions";
import { usePermissions } from "../../../../auth/AuthContext";
import { Tabs, type TabItem } from "../../../../components/common/Tabs";
import { useTabParam } from "../../../../hooks/useTabParam";
import { GroupSearchSelect } from "../components/GroupSearchSelect";
import {
  DepartmentRepartitionCreate,
  useCreateRepartition,
  useDeleteRepartition,
  useDepartments,
  useRepartitionByGroup,
  useUpdateRepartition,
} from "../../repartitions";

const GROUP_TABS = [
  { key: "overview", label: "Overview" },
  { key: "rules", label: "Rules" },
  { key: "departments", label: "Departments" },
] as const satisfies readonly TabItem[];

type GroupDetailPageProps = {
  group: Group;
  allGroups: Group[];
  rules: Rule[];
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
  rules,
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
  const { can } = usePermissions();
  const { data: groupTypes = [] } = useGroupTypes();
  const { data: divisions = [] } = useDivisions();

  const [tab, setTab] = useTabParam(
    GROUP_TABS.map((t) => t.key),
    "overview",
  );
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

        <GroupSearchSelect current={group} onSelect={onSelectGroup} />
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

      <Tabs tabs={GROUP_TABS} activeTab={tab} onTabChange={setTab} />

      {tab === "overview" && (
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
      )}

      {tab === "rules" && (
        <GroupRulesSection
          groupName={group.name}
          rules={rules}
          onCreateRule={handleOpenCreateRule}
          onOpenRule={onOpenRule}
          onEditRule={handleOpenEditRule}
          onDeleteRule={handleDeleteRule}
        />
      )}

      {tab === "departments" && <GroupDeparmentSection group={group} />}

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
