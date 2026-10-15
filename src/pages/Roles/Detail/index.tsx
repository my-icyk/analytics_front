import { useParams } from "@umijs/max";
import { Card, Tabs, Avatar, Col, Row, Space, Tag, Typography } from "antd";
import { UsergroupAddOutlined } from "@ant-design/icons";
import PermissionsTable from "./components/PermissionsTable";
import { PageContainer } from "@ant-design/pro-components";
import { getRole } from "@/services/roles";
import { useRequest } from "ahooks";
import { TeamOutlined, KeyOutlined } from "@ant-design/icons";
import { StatCard } from "@/components/StatCard";

export default function RoleDetailsPage() {
  const { id } = useParams();
  const { data: role } = useRequest(() => getRole(Number(id)), {
    ready: !!id,
    refreshDeps: [id],
  });

  return (
    <PageContainer>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Card>
          <Space size={16} align="center">
            <Avatar
              size={64}
              icon={<UsergroupAddOutlined />}
              style={{ background: "#1677ff1A", color: "#1677ff" }}
            />

            <Typography.Title level={4} style={{ margin: 0 }}>
              {role?.name ?? "Role"}
            </Typography.Title>
            <Space size={8} style={{ marginTop: 4 }}>
              <Tag>ID: {role?.id}</Tag>
            </Space>
          </Space>
        </Card>

        <Row gutter={16}>
          <Col md={8}>
            <StatCard
              title="Assigned users"
              value={0}
              icon={<TeamOutlined />}
              color="#52c41a"
            />
          </Col>
          <Col md={8}>
            <StatCard
              title="Assigned permissions"
              value={0}
              icon={<KeyOutlined />}
              color="#fa8c16"
            />
          </Col>
        </Row>
      </Space>

      <Card style={{ marginTop: 16 }}>
        <Tabs
          items={[
            {
              key: "permissions",
              label: "Permissions",
              children: <PermissionsTable roleId={Number(id)} />,
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
}
