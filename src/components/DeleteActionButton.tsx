import { Popconfirm, Button, type ButtonProps } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

type DeleteButtonProps = {
  entityName: string;
  itemLabel?: string;
  onConfirm: () => void | Promise<void>;
  label?: string;
  buttonProps?: Omit<ButtonProps, "onClick" | "danger" | "icon">;
};

export function DeleteActionButton({
  entityName,
  itemLabel,
  onConfirm,
  label = "Delete",
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
      <Button danger type="text" icon={<DeleteOutlined />} {...buttonProps}>
        {label}
      </Button>
    </Popconfirm>
  );
}
