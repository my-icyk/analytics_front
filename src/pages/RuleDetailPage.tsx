import { useState } from "react";
import { ArrowLeft, Edit3, Plus, Trash2 } from "lucide-react";
import type {
  Group,
  Rule,
  RuleCreate,
  Target,
  TargetCreate,
} from "../types/finance";
import { RuleFormModal } from "../components/finance/RuleFormModal";
import { TargetFormModal } from "../components/finance/TargetFormModal";

type RuleDetailPageProps = {
  rule: Rule;
  group: Group | null;
  allGroups: Group[];
  targets: Target[];
  canEditRule: boolean;
  canDeleteRule: boolean;
  canCreateTarget: boolean;
  canEditTarget: boolean;
  canDeleteTarget: boolean;
  onBack: () => void;
  onOpenGroup: (groupId: number) => void;
  onUpdateRule: (ruleId: number, payload: RuleCreate) => Promise<void>;
  onDeleteRule: (rule: Rule) => Promise<void>;
  onCreateTarget: (payload: TargetCreate) => Promise<void>;
  onUpdateTarget: (
    ruleId: number,
    targetId: number,
    payload: TargetCreate,
  ) => Promise<void>;
  onDeleteTarget: (target: Target) => Promise<void>;
  error: string;
};

export function RuleDetailPage({
  rule,
  group,
  allGroups,
  targets,
  canEditRule,
  canDeleteRule,
  canCreateTarget,
  canEditTarget,
  canDeleteTarget,
  onBack,
  onOpenGroup,
  onUpdateRule,
  onDeleteRule,
  onCreateTarget,
  onUpdateTarget,
  onDeleteTarget,
  error,
}: RuleDetailPageProps) {
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [targetModalOpen, setTargetModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<Target | null>(null);
  const [modalError, setModalError] = useState("");

  const handleOpenEditRule = () => {
    setModalError("");
    setRuleModalOpen(true);
  };

  const handleSaveRule = async (payload: RuleCreate) => {
    try {
      await onUpdateRule(rule.id, payload);
      setRuleModalOpen(false);
    } catch (err) {
      setModalError(
        err instanceof Error ? err.message : "Failed to update rule",
      );
      throw err;
    }
  };

  const handleDeleteRule = () => {
    if (
      window.confirm(`Are you sure you want to delete rule "${rule.name}"?`)
    ) {
      void onDeleteRule(rule);
    }
  };

  const handleOpenCreateTarget = () => {
    setEditingTarget(null);
    setModalError("");
    setTargetModalOpen(true);
  };

  const handleOpenEditTarget = (target: Target) => {
    setEditingTarget(target);
    setModalError("");
    setTargetModalOpen(true);
  };

  const handleSaveTarget = async (payload: TargetCreate) => {
    try {
      if (editingTarget) {
        await onUpdateTarget(rule.id, editingTarget.id, payload);
      } else {
        await onCreateTarget(payload);
      }
      setTargetModalOpen(false);
    } catch (err) {
      setModalError(
        err instanceof Error ? err.message : "Failed to save target",
      );
      throw err;
    }
  };

  const handleDeleteTarget = (target: Target) => {
    if (window.confirm("Are you sure you want to remove this target?")) {
      void onDeleteTarget(target);
    }
  };

  const getGroupName = (groupId: number) => {
    const found = allGroups.find((g) => g.id === groupId);
    return found ? `${found.name} (#${found.id})` : `Group #${groupId}`;
  };

  return (
    <section className="detail-page">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={16} />{" "}
        {group ? `Back to ${group.name}` : "Back to groups"}
      </button>

      <div className="detail-header">
        <div>
          <p className="eyebrow">FINANCE RULE</p>
          <h2>{rule.name}</h2>
          <p className="subtitle">
            Rule ID #{rule.id} · Associated with:{" "}
            <button
              className="link-button"
              onClick={() => onOpenGroup(rule.group_id)}
              style={{ display: "inline", fontWeight: 700 }}
            >
              {group?.name ?? `Group #${rule.group_id}`}
            </button>
          </p>
        </div>
        <div className="table-actions">
          {canEditRule && (
            <button className="secondary-button" onClick={handleOpenEditRule}>
              <Edit3 size={15} /> Edit rule
            </button>
          )}
          {canDeleteRule && (
            <button className="danger-button" onClick={handleDeleteRule}>
              <Trash2 size={15} /> Delete rule
            </button>
          )}
        </div>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <div className="detail-grid">
        <div className="detail-card">
          <span className="stat-label">Validity Period</span>
          <strong>{rule.valid_from}</strong>
          <p>
            Valid until:{" "}
            {rule.valid_to ? (
              <strong>{rule.valid_to}</strong>
            ) : (
              "Ongoing (no expiry date)"
            )}
          </p>
        </div>
        <div className="detail-card">
          <span className="stat-label">Allocation Percentage</span>
          <strong>{rule.percent_value}%</strong>
          <p>Base calculation percentage configured for this rule.</p>
        </div>
      </div>

      <div className="detail-section">
        <div className="section-heading">
          <div>
            <h3>Rule Targets & Allocations</h3>
            <p>Target groups receiving allocated value for this rule.</p>
          </div>
          {canCreateTarget && (
            <button className="primary-button" onClick={handleOpenCreateTarget}>
              <Plus size={16} /> Add target
            </button>
          )}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Target Group</th>
                <th>Allocation Type</th>
                <th>Percent Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {targets.map((target) => (
                <tr key={target.id}>
                  <td>{target.id}</td>
                  <td>
                    <button
                      className="link-button"
                      onClick={() => onOpenGroup(target.group_id)}
                    >
                      <strong>{getGroupName(target.group_id)}</strong>
                    </button>
                  </td>
                  <td>
                    <span
                      className={`domain-pill ${
                        target.allocation_type === "DIRECT"
                          ? "finance"
                          : target.allocation_type === "PROPORTIONAL"
                            ? "auth"
                            : ""
                      }`}
                    >
                      {target.allocation_type}
                    </span>
                  </td>
                  <td>
                    {target.percent_value != null ? (
                      <strong>{target.percent_value}%</strong>
                    ) : (
                      <span style={{ color: "var(--muted)" }}>—</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      {canEditTarget && (
                        <button
                          className="secondary-button icon-action-button"
                          title="Edit target"
                          aria-label="Edit target"
                          onClick={() => handleOpenEditTarget(target)}
                        >
                          <Edit3 size={14} />
                        </button>
                      )}
                      {canDeleteTarget && (
                        <button
                          className="danger-button icon-action-button"
                          title="Remove target"
                          aria-label="Remove target"
                          onClick={() => handleDeleteTarget(target)}
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
          {targets.length === 0 && (
            <div className="empty-state">
              No targets defined for this rule yet.
            </div>
          )}
        </div>
      </div>

      {ruleModalOpen && (
        <RuleFormModal
          rule={rule}
          groupId={rule.group_id}
          error={modalError}
          onClose={() => setRuleModalOpen(false)}
          onSubmit={handleSaveRule}
        />
      )}

      {targetModalOpen && (
        <TargetFormModal
          target={editingTarget}
          ruleId={rule.id}
          groups={allGroups}
          error={modalError}
          onClose={() => setTargetModalOpen(false)}
          onSubmit={handleSaveTarget}
        />
      )}
    </section>
  );
}
