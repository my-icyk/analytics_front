// shared/components/CreateButton.tsx
import { Plus } from "lucide-react";
import { ReactNode } from "react";

type CreateButtonProps = {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
};

export function CreateButton({
  onClick,
  children,
  disabled,
}: CreateButtonProps) {
  return (
    <button
      type="button"
      className="primary-button"
      onClick={onClick}
      disabled={disabled}
    >
      <Plus size={17} />
      {children}
    </button>
  );
}
