import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";
import "./DeleteModal.css";

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
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (!pending) onClose();
  };

  // Reset state, lock page scroll, focus Cancel (never the destructive button), restore focus on close.
  useEffect(() => {
    if (!open) return;
    setError(null);
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
    setError(null);
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

  return createPortal(
    <div
      className="dm-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        ref={panelRef}
        className="dm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dm-title"
        aria-describedby="dm-desc"
        onKeyDown={handleKeyDown}
      >
        <h2 id="dm-title" className="dm__title">
          Delete {entity}?
        </h2>

        <p id="dm-desc" className="dm__text">
          {itemName ? (
            <>
              <strong>{itemName}</strong> will be permanently deleted.
            </>
          ) : (
            <>This {entity} will be permanently deleted.</>
          )}{" "}
          This action cannot be undone.
          {description && <span className="dm__extra">{description}</span>}
        </p>

        {error && (
          <p className="dm__error" role="alert">
            {error}
          </p>
        )}

        <div className="dm__actions">
          <button
            ref={cancelRef}
            type="button"
            className="dm__btn"
            onClick={close}
            disabled={pending}
          >
            Cancel
          </button>
          <button
            type="button"
            className="dm__btn dm__btn--danger"
            onClick={handleConfirm}
            disabled={pending}
          >
            {pending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
