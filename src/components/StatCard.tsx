import { Avatar, Card, Space, Statistic } from "antd";
import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value?: number;
  icon: ReactNode;
  color: string;
  loading?: boolean;
};

export function StatCard({
  title,
  value,
  icon,
  color,
  loading,
}: StatCardProps) {
  return (
    <Card loading={loading} styles={{ body: { padding: 20 } }}>
      <Space size={16} align="center">
        <Avatar
          size={48}
          icon={icon}
          style={{ background: `${color}1A`, color }}
        />
        <Statistic title={title} value={value ?? "-"} />
      </Space>
    </Card>
  );
}
