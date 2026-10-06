import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type {
  CounterException,
  CounterExceptionCreate,
} from "../countersExceptions.types";

type ExceptionFormModalProps = {
  exception?: CounterException | null;
  initialCounterId?: number;
  error: string;
  onClose: () => void;
  onSubmit: (payload: CounterExceptionCreate) => void | Promise<void>;
};

function toDateInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function ExceptionFormModal({
  exception,
  initialCounterId,
  error,
  onClose,
  onSubmit,
}: ExceptionFormModalProps) {
  const [counterId, setCounterId] = useState<number>(
    exception?.counter_id ?? initialCounterId ?? 0,
  );
  const [validFrom, setValidFrom] = useState(
    exception?.valid_from?.slice(0, 10) ?? toDateInputValue(new Date()),
  );
  const [validTo, setValidTo] = useState(
    exception?.valid_to?.slice(0, 10) ?? toDateInputValue(new Date()),
  );
  const [visitors, setVisitors] = useState(String(exception?.visitors ?? 0));
  const [reason, setReason] = useState(exception?.reason ?? "");
  const [isAuto, setIsAuto] = useState(exception?.is_auto ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleAutoChange = (checked: boolean) => {
    setIsAuto(checked);
    if (checked) setVisitors("0");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!counterId || counterId < 1) {
      setFormError("Counter ID is required");
      return;
    }
    if (!validFrom || !validTo) {
      setFormError("Validity period is required");
      return;
    }
    if (new Date(validTo) < new Date(validFrom)) {
      setFormError("Valid to must be after valid from");
      return;
    }
    const visitorsCount = isAuto ? 0 : Number(visitors);
    if (!Number.isInteger(visitorsCount) || visitorsCount < 0) {
      setFormError("Visitors must be a non-negative number");
      return;
    }

    setFormError("");
    setSubmitting(true);
    try {
      await onSubmit({
        counter_id: Number(counterId),
        valid_from: validFrom,
        valid_to: validTo,
        visitors: visitorsCount,
        is_auto: isAuto,
        reason: reason.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{exception ? "Edit exception" : "Create exception"}</h2>
          <button className="icon-button" aria-label="Close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {(error || formError) && (
          <p className="auth-error">{error || formError}</p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Counter ID
            <input
              type="number"
              min={1}
              step={1}
              autoFocus
              value={counterId || ""}
              onChange={(e) => setCounterId(Number(e.target.value))}
              placeholder="e.g. 41"
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
            Valid to
            <input
              type="date"
              value={validTo}
              onChange={(e) => setValidTo(e.target.value)}
              required
            />
          </label>

          <label>
            Visitors
            <input
              type="number"
              min={0}
              step={1}
              value={isAuto ? "0" : visitors}
              onChange={(e) => setVisitors(e.target.value)}
              placeholder="e.g. 120"
              disabled={isAuto}
              required
            />
          </label>

          <label>
            Reason
            <textarea
              className="comment-textarea"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this exception needed?"
            />
          </label>

          <div className="toggle-row">
            <div className="toggle-row-text">
              <strong>Auto exception</strong>
              <span>Mark this exception as automatically generated.</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={isAuto}
                onChange={(e) => handleAutoChange(e.target.checked)}
              />
              <span className="switch-track">
                <span className="switch-thumb" />
              </span>
            </label>
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
                : exception
                  ? "Save changes"
                  : "Create exception"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
