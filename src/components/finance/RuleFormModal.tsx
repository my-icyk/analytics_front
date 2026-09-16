import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { Rule, RuleCreate } from "../../types/finance";

type RuleFormModalProps = {
  rule: Rule | null;
  groupId: number;
  error: string;
  onClose: () => void;
  onSubmit: (payload: RuleCreate) => void | Promise<void>;
};

export function RuleFormModal({
  rule,
  groupId,
  error,
  onClose,
  onSubmit,
}: RuleFormModalProps) {
  const [name, setName] = useState(rule?.name ?? "");
  const [validFrom, setValidFrom] = useState(
    rule?.valid_from ?? new Date().toISOString().slice(0, 10),
  );
  const [validTo, setValidTo] = useState(rule?.valid_to ?? "");
  const [percentValue, setPercentValue] = useState<number>(
    rule?.percent_value ?? 100,
  );
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError("Rule name is required");
      return;
    }
    if (!validFrom) {
      setFormError("Valid from date is required");
      return;
    }

    setFormError("");
    setSubmitting(true);
    try {
      await onSubmit({
        name: trimmedName,
        group_id: groupId,
        valid_from: validFrom,
        valid_to: validTo.trim() ? validTo.trim() : null,
        percent_value: Number(percentValue),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{rule ? "Edit rule" : "Create rule"}</h2>
          <button className="icon-button" aria-label="Close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {(error || formError) && (
          <p className="auth-error">{error || formError}</p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Rule name
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q1 Expense Allocation"
              required
            />
          </label>

          <label>
            Valid from
            <input
              type="date"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
              required
            />
          </label>

          <label>
            Valid to (optional)
            <input
              type="date"
              value={validTo}
              onChange={(e) => setValidTo(e.target.value)}
            />
          </label>

          <label>
            Percent value (%)
            <input
              type="number"
              step="any"
              min="0"
              max="100"
              value={percentValue}
              onChange={(e) => setPercentValue(Number(e.target.value))}
              required
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
              {submitting ? "Saving..." : rule ? "Save changes" : "Create rule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
