import { useMemo, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type {
  Department,
  DepartmentRepartition,
  DepartmentRepartitionCreate,
} from "../../types/finance";

type GroupDepartmentAllocationFormProps = {
  allocation: DepartmentRepartition | null;
  groupId: number;
  departments: Department[];
  error: string;
  onClose: () => void;
  onSubmit: (payload: DepartmentRepartitionCreate) => void | Promise<void>;
};

export function GroupDepartmentAllocationForm({
  allocation,
  groupId,
  departments,
  error,
  onClose,
  onSubmit,
}: GroupDepartmentAllocationFormProps) {
  const isEditing = allocation !== null;

  const [departmentId, setDepartmentId] = useState<number>(
    allocation?.department_id ?? 0,
  );
  const [validFrom, setValidFrom] = useState(
    allocation?.valid_from?.slice(0, 10) ??
      new Date().toISOString().slice(0, 10),
  );
  const [validTo, setValidTo] = useState(
    allocation?.valid_to?.slice(0, 10) ?? "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const sortedDepartments = useMemo(
    () =>
      [...departments].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      ),
    [departments],
  );

  // When editing, keep the current department selectable even if it is
  // missing from the list (e.g. inactive).
  const currentDepartmentMissing =
    isEditing &&
    !sortedDepartments.some((d) => d.id === allocation.department_id);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!departmentId) {
      setFormError("Please select a department");
      return;
    }
    if (!validFrom) {
      setFormError("Start date is required");
      return;
    }
    if (validTo && validTo < validFrom) {
      setFormError("The end date can't be before the start date");
      return;
    }

    setFormError("");
    setSubmitting(true);
    try {
      await onSubmit({
        group_id: groupId,
        department_id: Number(departmentId),
        valid_from: validFrom,
        valid_to: validTo.trim() ? validTo.trim() : null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Edit allocation" : "Allocate department"}</h2>
          <button className="icon-button" aria-label="Close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {(error || formError) && (
          <p className="auth-error">{error || formError}</p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Department
            <select
              value={departmentId}
              disabled={isEditing || submitting}
              autoFocus={!isEditing}
              onChange={(e) => setDepartmentId(Number(e.target.value))}
              required
            >
              <option value={0} disabled>
                Select department
              </option>
              {currentDepartmentMissing && allocation && (
                <option value={allocation.department_id}>
                  {allocation.department_name}
                </option>
              )}
              {sortedDepartments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                  {department.code ? ` (${department.code})` : ""}
                </option>
              ))}
            </select>
          </label>
          {isEditing && (
            <p
              style={{
                fontSize: "12px",
                color: "var(--muted)",
                margin: "4px 0 0",
              }}
            >
              The department can't be changed. Remove this allocation and add a
              new one instead.
            </p>
          )}

          <label>
            Start date
            <input
              type="date"
              value={validFrom}
              autoFocus={isEditing}
              onChange={(e) => setValidFrom(e.target.value)}
              required
            />
          </label>

          <label>
            End date (optional — leave empty if ongoing)
            <input
              type="date"
              value={validTo}
              min={validFrom || undefined}
              onChange={(e) => setValidTo(e.target.value)}
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
                : isEditing
                  ? "Save changes"
                  : "Allocate department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
