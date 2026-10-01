import { Edit3, ExternalLink, Plus, Trash2 } from "lucide-react";
import type { Rule } from "../types/finance";
import { usePermissions } from "../auth/AuthContext";
import { formatDate } from "../utils/utils";

type GroupRulesSectionProps = {
  groupName: string;
  rules: Rule[];
  onCreateRule: () => void;
  onOpenRule: (rule: Rule) => void;
  onEditRule: (rule: Rule) => void;
  onDeleteRule: (rule: Rule) => void;
};

export function GroupRulesSection({
  // TODO: De exclus group name , probabil nu voi avea nevoie de el
  groupName,
  rules,

  onCreateRule,
  onOpenRule,
  onEditRule,
  onDeleteRule,
}: GroupRulesSectionProps) {
  const { can } = usePermissions();
  return (
    <div className="detail-section">
      <div className="section-heading">
        <div>
          <h3>Associated Rules</h3>
          <p>Rules and allocation percentages assigned to {groupName}.</p>
        </div>
        {can("finance:rule:create") && (
          <button className="primary-button" onClick={onCreateRule}>
            <Plus size={16} /> New rule
          </button>
        )}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Rule Name</th>
              <th>Valid From</th>
              <th>Valid To</th>
              <th>Percent Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td>{rule.id}</td>
                <td>
                  <button
                    className="link-button"
                    onClick={() => onOpenRule(rule)}
                  >
                    <strong>{rule.name}</strong>
                  </button>
                </td>
                <td>{formatDate(rule.valid_from)}</td>
                <td>
                  {rule.valid_to || (
                    <span className="badge badge-active">Ongoing</span>
                  )}
                </td>
                <td>
                  <strong>{rule.percent_value}%</strong>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="secondary-button icon-action-button"
                      title="Manage targets"
                      aria-label="Manage targets"
                      onClick={() => onOpenRule(rule)}
                    >
                      <ExternalLink size={14} />
                    </button>
                    {can("finance:rule:update") && (
                      <button
                        className="secondary-button icon-action-button"
                        title="Edit rule"
                        aria-label="Edit rule"
                        onClick={() => onEditRule(rule)}
                      >
                        <Edit3 size={14} />
                      </button>
                    )}
                    {can("finance:rule:delete") && (
                      <button
                        className="danger-button icon-action-button"
                        title="Delete rule"
                        aria-label="Delete rule"
                        onClick={() => onDeleteRule(rule)}
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
        {rules.length === 0 && (
          <div className="empty-state">
            No rules associated with this group yet.
          </div>
        )}
      </div>
    </div>
  );
}
