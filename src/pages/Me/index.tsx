import { useState } from "react";
import { useModel } from "@umijs/max";
import { Avatar, Button, Result, Space, Tag, Typography } from "antd";
import {
  PageContainer,
  ProCard,
  ProDescriptions,
} from "@ant-design/pro-components";
import type { ProDescriptionsItemProps } from "@ant-design/pro-components";
import {
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";

import PasswordModal from "@/components/PasswordModal";
import { formatDate } from "@/utils/formatDate";
import { CurrentUser } from "@/types/user";

const { Title, Text } = Typography;

const roleTag = (
  isAdmin: boolean,
  adminLabel = "Administrator",
  userLabel = "User",
) => (
  <Tag color={isAdmin ? "purple" : "blue"}>
    {isAdmin ? adminLabel : userLabel}
  </Tag>
);

const personalColumns = (
  user: CurrentUser,
): ProDescriptionsItemProps<CurrentUser>[] => [
  { title: "Full name", dataIndex: "name" },
  { title: "Email", dataIndex: "email", copyable: true },
];

const accountColumns: ProDescriptionsItemProps<CurrentUser>[] = [
  { title: "User ID", dataIndex: "id", copyable: true },
  {
    title: "Account type",
    dataIndex: "is_admin",
    render: (_, u) => roleTag(u.is_admin, "Administrator", "Standard User"),
  },
  {
    title: "Roles",
    dataIndex: "roles",
    render: (_, user) =>
      user.roles?.length ? (
        <Space size={[4, 4]} wrap>
          {user.roles.map((role) => (
            <Tag key={role} color="geekblue">
              {role}
            </Tag>
          ))}
        </Space>
      ) : (
        <Text type="secondary">No roles assigned</Text>
      ),
  },
  {
    title: "Member since",
    dataIndex: "created_at",
    render: (_, u) => formatDate(u.created_at),
  },
];

export default function MePage() {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const { initialState, refresh, loading } = useModel("@@initialState");
  const user = initialState?.currentUser;

  if (!loading && !user) {
    return (
      <PageContainer title="My Profile">
        <Result
          status="error"
          title="Unable to load profile"
          subTitle="We couldn't retrieve your account information."
          extra={
            <Button type="primary" onClick={refresh}>
              Try again
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="My Profile"
      subTitle="View your personal information and manage account security."
      loading={loading}
      extra={[
        <Button
          key="password"
          type="primary"
          icon={<LockOutlined />}
          onClick={() => setPasswordOpen(true)}
        >
          Change Password
        </Button>,
      ]}
    >
      {user && (
        <ProCard ghost gutter={[24, 24]} wrap>
          {/* Hero */}
          <ProCard
            colSpan={24}
            bordered
            style={{
              background: "linear-gradient(120deg, #f8faff 0%, #eaf1ff 100%)",
              borderColor: "#e6edff",
            }}
          >
            <Space size={20} align="center" wrap>
              <Avatar
                size={88}
                src={
                  <img
                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(5)}`}
                    alt="User avatar"
                    style={{ width: "100%", height: "100%" }}
                  />
                }
                icon={<UserOutlined />}
              />
              <div>
                <Title level={3} style={{ margin: "0 0 8px" }}>
                  {user.name}
                </Title>
                <Space wrap size={8}>
                  {roleTag(user.is_admin)}
                </Space>
                <div style={{ marginTop: 10 }}>
                  <Text type="secondary">
                    <MailOutlined style={{ marginRight: 8 }} />
                    {user.email}
                  </Text>
                </div>
              </div>
            </Space>
          </ProCard>

          {/* Personal information */}
          <ProCard
            colSpan={{ xs: 24, lg: 12 }}
            bordered
            title={
              <Space>
                <UserOutlined style={{ color: "#1677ff" }} />
                Personal Information
              </Space>
            }
          >
            <ProDescriptions<CurrentUser>
              column={1}
              dataSource={user}
              columns={personalColumns(user)}
              labelStyle={{ color: "#8c8c8c", width: 150 }}
            />
          </ProCard>

          {/* Account information */}
          <ProCard
            colSpan={{ xs: 24, lg: 12 }}
            bordered
            title={
              <Space>
                <SafetyCertificateOutlined style={{ color: "#1677ff" }} />
                Account Information
              </Space>
            }
          >
            <ProDescriptions<CurrentUser>
              column={1}
              dataSource={user}
              columns={accountColumns}
              labelStyle={{ color: "#8c8c8c", width: 150 }}
            />
          </ProCard>
        </ProCard>
      )}

      <PasswordModal
        open={passwordOpen}
        mode="change"
        onClose={() => setPasswordOpen(false)}
      />
    </PageContainer>
  );
}
