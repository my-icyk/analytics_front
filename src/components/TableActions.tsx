import { Edit3, ExternalLink, Trash2 } from "lucide-react";

type TableActionsProps = {
  onOpen?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  openLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  disabled?: boolean;
};

export function TableActions({
  onOpen,
  onEdit,
  onDelete,
  openLabel = "Open",
  editLabel = "Edit",
  deleteLabel = "Delete",
  disabled = false,
}: TableActionsProps) {
  if (!onOpen && !onEdit && !onDelete) return null;

  return (
    <div className="table-actions">
      {onOpen && (
        <button
          type="button"
          className="secondary-button icon-action-button"
          title={openLabel}
          aria-label={openLabel}
          onClick={onOpen}
          disabled={disabled}
        >
          <ExternalLink size={14} />
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          className="secondary-button icon-action-button"
          title={editLabel}
          aria-label={editLabel}
          onClick={onEdit}
          disabled={disabled}
        >
          <Edit3 size={14} />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          className="danger-button icon-action-button"
          title={deleteLabel}
          aria-label={deleteLabel}
          onClick={onDelete}
          disabled={disabled}
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
