import { PlayCircleOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

type Props = {
  itemLabel: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function RunActionButton({
  itemLabel,
  onClick,
  loading,
  disabled,
}: Props) {
  return (
    <Tooltip title="Run">
      <Button
        type="text"
        size="middle"
        icon={<PlayCircleOutlined />}
        aria-label={`Run ${itemLabel}`}
        loading={loading}
        disabled={disabled}
        onClick={onClick}
      />
    </Tooltip>
  );
}
