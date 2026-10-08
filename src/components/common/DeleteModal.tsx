import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type DeleteModalProps = {
  open: boolean;
  onClose: () => void;
  /** Should return a promise. If it rejects, the error is shown in the modal. */
  onConfirm: () => Promise<unknown>;
  /** What is being deleted, e.g. "group", "division", "assignment". */
  entity: string;
  /** Name of the item, e.g. "Group A". Shown in bold. */
  itemName?: string;
  /** Optional extra line, e.g. "Its 3 targets will also be deleted." */
  description?: string;
};

const FOCUSABLE =
  "button:not(:disabled), [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

function errorText(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Could not delete. Please try again.";
}

export function DeleteModal({
  open,
  onClose,
  onConfirm,
  entity,
  itemName,
  description,
}: DeleteModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    if (!pending) onClose();
  };

  // Reset state, lock page scroll, focus Cancel (never the destructive button), restore focus on close.
  useEffect(() => {
    if (!open) return;
    setError("");
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      return;
    }
    // Keep Tab focus inside the modal
    if (e.key === "Tab" && panelRef.current) {
      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const handleConfirm = async () => {
    setError("");
    setPending(true);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={close}>
      <div
        ref={panelRef}
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-desc"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="modal-header">
          <h2 id="delete-modal-title">Delete {entity}?</h2>
          <button
            className="icon-button"
            aria-label="Close"
            onClick={close}
            disabled={pending}
          >
            <X size={16} />
          </button>
        </div>

        <p id="delete-modal-desc" className="delete-modal-text">
          {itemName ? (
            <>
              <strong>{itemName}</strong> will be permanently deleted.
            </>
          ) : (
            <>This {entity} will be permanently deleted.</>
          )}{" "}
          This action cannot be undone.
          {description && (
            <span className="delete-modal-extra">{description}</span>
          )}
        </p>

        {error && <p className="auth-error">{error}</p>}

        <div className="modal-actions">
          <button
            ref={cancelRef}
            type="button"
            className="secondary-button"
            onClick={close}
            disabled={pending}
          >
            Cancel
          </button>
          <button
            type="button"
            className="danger-button"
            onClick={handleConfirm}
            disabled={pending}
          >
            {pending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
