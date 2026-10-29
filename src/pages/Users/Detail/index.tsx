import { PageContainer } from "@ant-design/pro-components";
import { useState } from "react";
import { history, useAccess, useParams } from "@umijs/max";
import { Button, Card, Popconfirm, Space, Tabs, message } from "antd";
import { DeleteOutlined, EditOutlined, KeyOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";

import { deleteUser, getUser } from "@/services/users";
import { PERMISSIONS } from "../../../../config/permissions";
import UserFormModal from "../UserFormModal";
import RoleAssignment from "./components/roleAsigment";
import { UserDetails } from "./components/UserDetails";
import PasswordModal from "@/components/PasswordModal";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const access = useAccess();

  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false); // NEW

  const valid = !!id && !Number.isNaN(userId);

  const {
    data: user,
    loading,
    refresh,
  } = useRequest(() => getUser(userId), {
    ready: valid,
    refreshDeps: [id],
  });

  const handleDelete = async () => {
    await deleteUser(userId);
    message.success("User deleted");
    history.replace("/auth/users");
  };

  return (
    <PageContainer
      loading={loading}
      title={user?.name ?? "User"}
      extra={[
        access[PERMISSIONS.AUTH.USERS.UPDATE] && (
          <Button
            key="edit"
            icon={<EditOutlined />}
            onClick={() => setModalOpen(true)}
          >
            Edit
          </Button>
        ),
        access[PERMISSIONS.AUTH.USERS.CHANGE_PASSWORD] && (
          <Button
            key="reset-password"
            icon={<KeyOutlined />}
            onClick={() => setPasswordModalOpen(true)}
          >
            Reset password
          </Button>
        ),
        access[PERMISSIONS.AUTH.USERS.DELETE] && (
          <Popconfirm
            key="delete"
            title="Delete this user?"
            description={`Are you sure you want to delete "${user?.username}"?`}
            okText="Delete"
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
          <Tabs
            items={[
              {
                key: "Overview",
                label: "Overview",
                children: user ? <UserDetails user={user} /> : null,
              },
              {
                key: "Roles",
                label: "Roles",
                children: <RoleAssignment userId={userId} />,
              },
            ]}
          />
        </Card>
      </Space>

      <UserFormModal
        open={modalOpen}
        user={user}
        onCancel={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          message.success(user ? "User updated" : "User created");
          refresh();
        }}
      />
      {/* NEW */}
      <PasswordModal
        open={passwordModalOpen}
        mode="reset"
        userId={userId}
        onClose={() => setPasswordModalOpen(false)}
      />
    </PageContainer>
  );
}
