import { PageContainer } from "@ant-design/pro-components";
import { history, useAccess, useParams } from "@umijs/max";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Popconfirm,
  Row,
  Space,
  Tabs,
  Typography,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useRequest } from "ahooks";
import { useState } from "react";
import { deleteRole, getRole } from "@/services/roles";
import { StatCard } from "@/components/StatCard";
import { PERMISSIONS } from "../../../../config/permissions";
import RoleFormModal from "../RoleFormModal";
import PermissionsTable from "./components/PermissionsTable";

export default function RoleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const roleId = Number(id);
  const access = useAccess();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: role,
    loading,
    refresh,
  } = useRequest(() => getRole(roleId), {
    ready: !!id && !Number.isNaN(roleId),
    refreshDeps: [id],
  });

  const handleDelete = async () => {
    await deleteRole(roleId);
    message.success("Role deleted");
    history.replace("/auth/roles");
  };

  return (
    <PageContainer
      loading={loading}
      extra={[
        access[PERMISSIONS.AUTH.ROLES.UPDATE] && (
          <Button
            key="edit"
            icon={<EditOutlined />}
            onClick={() => setModalOpen(true)}
          >
            Edit
          </Button>
        ),
        access[PERMISSIONS.AUTH.ROLES.DELETE] && (
          <Popconfirm
            key="delete"
            title="Delete this role?"
            description={`Are you sure you want to delete role "${role?.name}"?`}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={handleDelete}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        ),
      ]}
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Card>
          <Typography.Title level={4} style={{ marginTop: 0 }}>
            Role Name: {role?.name}
          </Typography.Title>

          <Descriptions column={2} size="small">
            <Descriptions.Item label="Role ID">{role?.id}</Descriptions.Item>

            <Descriptions.Item label="Description">
              {role?.description || "No description"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <StatCard
              title="Assigned users"
              value={0}
              icon={<TeamOutlined />}
              color="#52c41a"
            />
          </Col>
          <Col xs={24} md={8}>
            <StatCard
              title="Assigned permissions"
              value={0}
              icon={<KeyOutlined />}
              color="#fa8c16"
            />
          </Col>
        </Row>

        <Card>
          <Tabs
            items={[
              {
                key: "permissions",
                label: "Permissions",
                children: <PermissionsTable roleId={roleId} />,
              },
            ]}
          />
        </Card>
      </Space>

      <RoleFormModal
        open={modalOpen}
        role={role}
        onCancel={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          refresh();
        }}
      />
    </PageContainer>
  );
}
