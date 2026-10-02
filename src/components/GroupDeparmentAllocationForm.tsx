import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import type {
  Department,
  DepartmentRepartition,
  DepartmentRepartitionCreate,
} from "../types/finance";

type GroupDepartmentAllocationFormProps = {
  allocation: DepartmentRepartition | null;
  groupId: number;
  departments: Department[];
  error?: string;
  onClose: () => void;
  onSubmit: (payload: DepartmentRepartitionCreate) => Promise<void>;
};

type FieldName = "departmentId" | "validFrom" | "validTo";
type Values = Record<FieldName, string>;
// TODO: WHAT IS DOING THAT FIELD ERRORS
type FieldErrors = Partial<Record<FieldName, string>>;

const FIELD_ORDER: FieldName[] = ["departmentId", "validFrom", "validTo"];

// TODO: Validate my be with zod library
function validate(values: Values): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.departmentId) {
    errors.departmentId = "Select a department.";
  }
  if (!values.validFrom) {
    errors.validFrom = "Enter a start date.";
  }
  if (values.validFrom && values.validTo && values.validTo < values.validFrom) {
    errors.validTo = "The end date can't be before the start date.";
  }

  return errors;
}

export function GroupDepartmentAllocationForm({
  allocation,
  groupId,
  departments,
  error,
  onClose,
  onSubmit,
}: GroupDepartmentAllocationFormProps) {
  const isEditing = allocation !== null;

  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const fieldRefs = {
    departmentId: useRef<HTMLSelectElement>(null),
    validFrom: useRef<HTMLInputElement>(null),
    validTo: useRef<HTMLInputElement>(null),
  };

  const [values, setValues] = useState<Values>(() => ({
    departmentId: allocation ? String(allocation.department_id) : "",
    validFrom: allocation?.valid_from?.slice(0, 10) ?? "",
    validTo: allocation?.valid_to?.slice(0, 10) ?? "",
  }));
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = useMemo(() => validate(values), [values]);
  const visibleError = (name: FieldName) =>
    touched[name] ? errors[name] : undefined;

  const sortedDepartments = useMemo(
    () =>
      [...departments].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      ),
    [departments],
  );

  // When editing, make sure the current department is selectable
  // even if it's missing from the list (e.g. inactive).
  const currentDepartmentMissing =
    isEditing &&
    !sortedDepartments.some((d) => String(d.id) === values.departmentId);

  // Native modal dialog: focus trap, Esc handling and inert background come for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const requestClose = () => {
    if (!isSubmitting) onClose();
  };

  const setField = (name: FieldName, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const markTouched = (name: FieldName) =>
    setTouched((prev) => ({ ...prev, [name]: true }));

  const describedBy = (name: FieldName, hasHint = false) => {
    const ids = [];
    if (hasHint) ids.push(id(`${name}-hint`));
    if (visibleError(name)) ids.push(id(`${name}-error`));
    return ids.length ? ids.join(" ") : undefined;
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setTouched({ departmentId: true, validFrom: true, validTo: true });

    const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
    if (firstInvalid) {
      fieldRefs[firstInvalid].current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        group_id: groupId,
        department_id: Number(values.departmentId),
        valid_from: values.validFrom,
        valid_to: values.validTo || null,
      });
    } catch {
      // The parent shows the message through the `error` prop.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="allocation-dialog"
      aria-labelledby={id("title")}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        // Click on the backdrop (the dialog element itself, not its content)
        if (event.target === dialogRef.current) requestClose();
      }}
    >
      <form className="allocation-form" noValidate onSubmit={handleSubmit}>
        <header className="allocation-form__header">
          <h3 id={id("title")}>
            {isEditing ? "Edit allocation" : "Allocate department"}
          </h3>
          <p className="allocation-form__intro">
            {isEditing
              ? "Change the period this department is allocated to the group."
              : "Assign a department to this group for a period of time."}
          </p>
        </header>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <div className="allocation-form__field">
          <label htmlFor={id("departmentId")}>Department</label>
          <select
            id={id("departmentId")}
            ref={fieldRefs.departmentId}
            value={values.departmentId}
            disabled={isEditing || isSubmitting}
            required
            aria-required="true"
            aria-invalid={Boolean(visibleError("departmentId"))}
            aria-describedby={describedBy("departmentId", isEditing)}
            autoFocus={!isEditing}
            onChange={(e) => setField("departmentId", e.target.value)}
            onBlur={() => markTouched("departmentId")}
          >
            <option value="" disabled>
              Select a department
            </option>
            {currentDepartmentMissing && allocation && (
              <option value={values.departmentId}>
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
          {isEditing && (
            <p id={id("departmentId-hint")} className="allocation-form__hint">
              The department can't be changed. Remove this allocation and add a
              new one instead.
            </p>
          )}
          {visibleError("departmentId") && (
            <p id={id("departmentId-error")} className="allocation-form__error">
              {visibleError("departmentId")}
            </p>
          )}
        </div>

        <div className="allocation-form__row">
          <div className="allocation-form__field">
            <label htmlFor={id("validFrom")}>Start date</label>
            <input
              id={id("validFrom")}
              ref={fieldRefs.validFrom}
              type="date"
              value={values.validFrom}
              disabled={isSubmitting}
              required
              aria-required="true"
              aria-invalid={Boolean(visibleError("validFrom"))}
              aria-describedby={describedBy("validFrom")}
              autoFocus={isEditing}
              onChange={(e) => setField("validFrom", e.target.value)}
              onBlur={() => markTouched("validFrom")}
            />
            {visibleError("validFrom") && (
              <p id={id("validFrom-error")} className="allocation-form__error">
                {visibleError("validFrom")}
              </p>
            )}
          </div>

          <div className="allocation-form__field">
            <label htmlFor={id("validTo")}>End date (optional)</label>
            <input
              id={id("validTo")}
              ref={fieldRefs.validTo}
              type="date"
              value={values.validTo}
              min={values.validFrom || undefined}
              disabled={isSubmitting}
              aria-invalid={Boolean(visibleError("validTo"))}
              aria-describedby={describedBy("validTo", true)}
              onChange={(e) => setField("validTo", e.target.value)}
              onBlur={() => markTouched("validTo")}
            />
            <p id={id("validTo-hint")} className="allocation-form__hint">
              Leave empty if the allocation is ongoing.
            </p>
            {visibleError("validTo") && (
              <p id={id("validTo-error")} className="allocation-form__error">
                {visibleError("validTo")}
              </p>
            )}
          </div>
        </div>

        <footer className="allocation-form__actions">
          <button
            type="button"
            className="secondary-button"
            onClick={requestClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving…"
              : isEditing
                ? "Save changes"
                : "Allocate department"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
