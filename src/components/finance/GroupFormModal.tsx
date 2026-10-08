import { useMemo, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type {
  Division,
  DivisionDetails,
} from "../../features/finance/divisions";
import type {
  Group,
  GroupCreate,
  GroupType,
  GroupTypeDetails,
} from "../../features/finance/groups";
import { Slicer, type SlicerOption } from "../common/Slicer";

type GroupFormModalProps = {
  group: Group | null;
  divisions: DivisionDetails[];
  groupTypes: GroupTypeDetails[];
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

  const divisionOptions: SlicerOption[] = useMemo(
    () =>
      divisions.map((d) => ({
        id: d.id,
        label: d.name,
        badge: d.group_count,
      })),
    [divisions],
  );

  const groupTypeOptions: SlicerOption[] = useMemo(
    () =>
      groupTypes.map((gt) => ({
        id: gt.id,
        label: gt.name,
        badge: gt.group_count,
      })),
    [groupTypes],
  );

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

          <div className="modal-field">
            Division
            <div className="modal-slicer">
              <Slicer
                title="Division"
                options={divisionOptions}
                selectedValues={divisionId ? [divisionId] : []}
                onChange={(selected) => setDivisionId(Number(selected[0] ?? 0))}
                multiSelect={false}
                requireApply={false}
                placeholder="Select division"
                searchPlaceholder="Search divisions..."
              />
            </div>
          </div>

          <div className="modal-field">
            Group Type
            <div className="modal-slicer">
              <Slicer
                title="Group Type"
                options={groupTypeOptions}
                selectedValues={groupTypeId ? [groupTypeId] : []}
                onChange={(selected) =>
                  setGroupTypeId(Number(selected[0] ?? 0))
                }
                multiSelect={false}
                requireApply={false}
                placeholder="Select group type"
                searchPlaceholder="Search group types..."
              />
            </div>
          </div>

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
