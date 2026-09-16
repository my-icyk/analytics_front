import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type {
  Division,
  Group,
  GroupCreate,
  GroupType,
} from "../../types/finance";

type GroupFormModalProps = {
  group: Group | null;
  divisions: Division[];
  groupTypes: GroupType[];
  error: string;
  onClose: () => void;
  onSubmit: (payload: GroupCreate) => void | Promise<void>;
};

export function GroupFormModal({
  group,
  divisions,
  groupTypes,
  error,
  onClose,
  onSubmit,
}: GroupFormModalProps) {
  const [name, setName] = useState(group?.name ?? "");
  const [divisionId, setDivisionId] = useState<number>(
    group?.division.id ?? divisions[0]?.id ?? 0,
  );
  const [groupTypeId, setGroupTypeId] = useState<number>(
    group?.group_type.id ?? groupTypes[0]?.id ?? 0,
  );
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError("Group name is required");
      return;
    }
    if (!divisionId) {
      setFormError("Please select a division");
      return;
    }
    if (!groupTypeId) {
      setFormError("Please select a group type");
      return;
    }

    setFormError("");
    setSubmitting(true);
    try {
      await onSubmit({
        name: trimmedName,
        division_id: Number(divisionId),
        group_type_id: Number(groupTypeId),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{group ? "Edit group" : "Create group"}</h2>
          <button className="icon-button" aria-label="Close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {(error || formError) && (
          <p className="auth-error">{error || formError}</p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Group name
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marketing Ops"
              required
            />
          </label>

          <label>
            Division
            <select
              value={divisionId}
              onChange={(e) => setDivisionId(Number(e.target.value))}
              required
            >
              <option value="" disabled>
                Select division
              </option>
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Group Type
            <select
              value={groupTypeId}
              onChange={(e) => setGroupTypeId(Number(e.target.value))}
              required
            >
              <option value="" disabled>
                Select group type
              </option>
              {groupTypes.map((gt) => (
                <option key={gt.id} value={gt.id}>
                  {gt.name}
                </option>
              ))}
            </select>
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
                : group
                  ? "Save changes"
                  : "Create group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
