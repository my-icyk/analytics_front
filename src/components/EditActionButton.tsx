// components/EditActionButton.tsx
import { EditOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

type Props = {
  itemLabel: string;
  onClick: () => void;
};

export function EditActionButton({ itemLabel, onClick }: Props) {
  return (
    <Tooltip title="Edit">
      <Button
        type="text"
        size="middle"
        icon={<EditOutlined />}
        aria-label={`Edit ${itemLabel}`}
        onClick={onClick}
      />
    </Tooltip>
  );
}
