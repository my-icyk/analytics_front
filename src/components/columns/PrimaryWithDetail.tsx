import { Space, Typography } from "antd";
import type { ReactNode } from "react";

type Props = {
  primary: ReactNode;
  details?: ReactNode[];
};

export function PrimaryWithDetails({ primary, details = [] }: Props) {
  const items = details.filter(
    (item) => item !== null && item !== undefined && item !== "",
  );

  return (
    <Space size={6} style={{ whiteSpace: "nowrap" }}>
      <Typography.Text>{primary}</Typography.Text>

      {items.length > 0 && (
        <Typography.Text type="secondary" italic>
          {items.map((item, index) => (
            <span key={index}>
              {index > 0 && " · "}
              {item}
            </span>
          ))}
        </Typography.Text>
      )}
    </Space>
  );
}
