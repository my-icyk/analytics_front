import { Card, Col, Row, Statistic } from 'antd';
import type { DashboardStats } from '@/types/dashboard';

type Props = {
  stats?: DashboardStats;
  loading: boolean;
};

/** Three number cards. Pure display: gets data in, draws it, no fetching. */
export default function StatsRow({ stats, loading }: Props) {
  const items = [
    { title: 'Total users', value: stats?.totalUsers },
    { title: 'Active users', value: stats?.activeUsers },
    { title: 'New this week', value: stats?.newThisWeek },
  ];

  return (
    <Row gutter={[16, 16]}>
      {items.map((item) => (
        <Col key={item.title} xs={24} md={8}>
          <Card loading={loading}>
            <Statistic title={item.title} value={item.value ?? 0} />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
