import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type {
  Division,
  DivisionCreate,
} from "../../features/finance/divisions";

type DivisionFormModalProps = {
  division: Division | null;
  error: string;
  onClose: () => void;
  onSubmit: (payload: DivisionCreate) => void | Promise<void>;
};

export function DivisionFormModal({
  division,
  error,
  onClose,
  onSubmit,
}: DivisionFormModalProps) {
  const [name, setName] = useState(division?.name ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError("Division name is required");
      return;
    }

    setFormError("");
    setSubmitting(true);
    try {
      await onSubmit({ name: trimmedName });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{division ? "Edit division" : "Create division"}</h2>
          <button className="icon-button" aria-label="Close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {(error || formError) && (
          <p className="auth-error">{error || formError}</p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Division name
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Corporate"
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
              {submitting
                ? "Saving..."
                : division
                  ? "Save changes"
                  : "Create division"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
