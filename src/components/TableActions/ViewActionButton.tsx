// components/ViewActionButton.tsx
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "@umijs/max";
import { Button, Tooltip } from "antd";

type Props = {
  to: string;
  itemLabel?: string;
};

export function ViewActionButton({ to, itemLabel }: Props) {
  return (
    <Tooltip title={`View ${itemLabel ?? "details"}`}>
      <Link to={to} aria-label={`View ${itemLabel ?? "details"}`}>
        <Button
          type="text"
          size="middle"
          icon={<EyeOutlined />}
          tabIndex={-1}
        />
      </Link>
    </Tooltip>
  );
}
