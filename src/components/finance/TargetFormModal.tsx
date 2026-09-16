import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type {
  AllocationType,
  Group,
  Target,
  TargetCreate,
} from "../../types/finance";

type TargetFormModalProps = {
  target: Target | null;
  ruleId: number;
  groups: Group[];
  error: string;
  onClose: () => void;
  onSubmit: (payload: TargetCreate) => void | Promise<void>;
};

const ALLOCATION_TYPES: { value: AllocationType; label: string }[] = [
  { value: "STATIC", label: "Static" },
  { value: "DIRECT", label: "Direct" },
  { value: "PROPORTIONAL", label: "Proportional" },
];

export function TargetFormModal({
  target,
  ruleId,
  groups,
  error,
  onClose,
  onSubmit,
}: TargetFormModalProps) {
  const [groupId, setGroupId] = useState<number>(
    target?.group_id ?? groups[0]?.id ?? 0,
  );
  const [allocationType, setAllocationType] = useState<AllocationType>(
    target?.allocation_type ?? "STATIC",
  );
  const [percentValue, setPercentValue] = useState<string>(
    target?.percent_value != null ? String(target.percent_value) : "100",
  );
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!groupId) {
      setFormError("Please select a target group");
      return;
    }

    const parsedPercent =
      percentValue.trim() === "" ? null : Number(percentValue);

    setFormError("");
    setSubmitting(true);
    try {
      await onSubmit({
        rule_id: ruleId,
        group_id: Number(groupId),
        allocation_type: allocationType,
        percent_value: parsedPercent,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{target ? "Edit rule target" : "Add rule target"}</h2>
          <button className="icon-button" aria-label="Close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {(error || formError) && (
          <p className="auth-error">{error || formError}</p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Target Group
            <select
              value={groupId}
              onChange={(e) => setGroupId(Number(e.target.value))}
              required
            >
              <option value="" disabled>
                Select target group
              </option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.division?.name ?? "No Division"} ·{" "}
                  {g.group_type?.name ?? "Type"})
                </option>
              ))}
            </select>
          </label>

          <label>
            Allocation Type
            <select
              value={allocationType}
              onChange={(e) =>
                setAllocationType(e.target.value as AllocationType)
              }
              required
            >
              {ALLOCATION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Percent value (%) (optional for direct)
            <input
              type="number"
              step="any"
              min="0"
              max="100"
              value={percentValue}
              onChange={(e) => setPercentValue(e.target.value)}
              placeholder="e.g. 50"
            />
          </label>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : target
                  ? "Save changes"
                  : "Add target"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
