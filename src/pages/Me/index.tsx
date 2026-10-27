import { useState } from "react";
import { useRequest } from "ahooks";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Result,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";

import PasswordModal from "@/components/PasswordModal";
import { fetchCurrentUser } from "@/services/auth";
import { formatDate } from "@/utils/formatDate";

const { Title, Text, Paragraph } = Typography;

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  is_admin: boolean;
  status: string;
  createdAt: string;
  lastLoginAt?: string | null;
};

export default function MePage() {
  const [passwordOpen, setPasswordOpen] = useState(false);

  const { data: user, loading, error, refresh } = useRequest(fetchCurrentUser);

  if (loading) {
    return (
      <Card style={{ borderRadius: 16 }}>
        <Skeleton active avatar paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  if (error || !user) {
    return (
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
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim() || user.email;

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        paddingBottom: 32,
      }}
    >
      {/* Page heading */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          My Profile
        </Title>
        <Text type="secondary">
          View your personal information and manage account security.
        </Text>
      </div>

      {/* Profile hero */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 16,
          overflow: "hidden",
          background: "linear-gradient(120deg, #f8faff 0%, #eaf1ff 100%)",
          border: "1px solid #e6edff",
        }}
        styles={{ body: { padding: 28 } }}
      >
        <Row gutter={[24, 24]} align="middle" justify="space-between">
          <Col flex="auto">
            <Space size={20} align="center" wrap>
              <Avatar
                size={88}
                src={user.avatarUrl}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "#d6e4ff",
                  color: "#1677ff",
                }}
              />

              <div>
                <Title level={3} style={{ margin: "0 0 8px" }}>
                  {fullName}
                </Title>

                <Space wrap size={8}>
                  <Tag color={user.is_admin ? "purple" : "blue"}>
                    {user.is_admin ? "Administrator" : "User"}
                  </Tag>

                  <Tag color={user.status === "ACTIVE" ? "success" : "default"}>
                    {user.status}
                  </Tag>
                </Space>

                <div style={{ marginTop: 10 }}>
                  <Text type="secondary">
                    <MailOutlined style={{ marginRight: 8 }} />
                    {user.email}
                  </Text>
                </div>
              </div>
            </Space>
          </Col>

          <Col>
            <Button
              type="primary"
              size="large"
              icon={<LockOutlined />}
              onClick={() => setPasswordOpen(true)}
            >
              Change Password
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]} align="stretch">
        {/* Personal information */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <UserOutlined style={{ color: "#1677ff" }} />
                Personal Information
              </Space>
            }
            style={{ height: "100%", borderRadius: 16 }}
          >
            <Descriptions
              column={1}
              colon={false}
              labelStyle={{
                color: "#8c8c8c",
                width: 150,
              }}
            >
              <Descriptions.Item label="First name">
                {user.firstName}
              </Descriptions.Item>

              <Descriptions.Item label="Last name">
                {user.lastName}
              </Descriptions.Item>

              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>

              {user.phone && (
                <Descriptions.Item label="Phone">
                  <PhoneOutlined style={{ marginRight: 8 }} />
                  {user.phone}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* Account information */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <SafetyCertificateOutlined style={{ color: "#1677ff" }} />
                Account Information
              </Space>
            }
            style={{ height: "100%", borderRadius: 16 }}
          >
            <Descriptions
              column={1}
              colon={false}
              labelStyle={{
                color: "#8c8c8c",
                width: 150,
              }}
            >
              <Descriptions.Item label="User ID">
                <Text copyable>{String(user.id)}</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Account type">
                <Tag color={user.is_admin ? "purple" : "blue"}>
                  {user.is_admin ? "Administrator" : "Standard User"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Member since">
                <CalendarOutlined style={{ marginRight: 8 }} />
                {formatDate(user.createdAt)}
              </Descriptions.Item>

              <Descriptions.Item label="Last login">
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                {formatDate(user.lastLoginAt)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Password modal */}
      <PasswordModal
        open={passwordOpen}
        mode="change"
        onClose={() => setPasswordOpen(false)}
      />
    </div>
  );
}
