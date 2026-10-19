import { Popconfirm, Button, Tooltip, type ButtonProps } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

type DeleteButtonProps = {
  entityName: string;
  itemLabel?: string;
  onConfirm: () => void | Promise<void>;
  buttonProps?: Omit<ButtonProps, "onClick" | "danger" | "icon">;
};

export function DeleteActionButton({
  entityName,
  itemLabel,
  onConfirm,
  buttonProps,
}: DeleteButtonProps) {
  return (
    <Popconfirm
      title={`Delete this ${entityName}?`}
      description={
        itemLabel
          ? `Are you sure you want to delete ${entityName}: "${itemLabel}"?`
          : `Are you sure you want to delete this ${entityName}?`
      }
      onConfirm={onConfirm}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
    >
      <Tooltip title="Delete">
        <Button
          danger
          type="text"
          size="middle"
          icon={<DeleteOutlined />}
          aria-label={
            itemLabel ? `Delete ${itemLabel}` : `Delete ${entityName}`
          }
          {...buttonProps}
        />
      </Tooltip>
    </Popconfirm>
  );
}
