import { PageContainer } from "@ant-design/pro-components";
import { history, useAccess, useParams } from "@umijs/max";
import {
  Avatar,
  Button,
  Card,
  Empty,
  List,
  Popconfirm,
  Space,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useRequest } from "ahooks";
import { useCallback, useState } from "react";

import { DebounceSelect } from "@/components/DebounceSelect";
import {
  addUserRole,
  deleteUser,
  getUser,
  getUserRoles,
  removeUserRole,
} from "@/services/users";
import { getRoles } from "@/services/roles";
import { PERMISSIONS } from "../../../../config/permissions";
import UserFormModal from "../UserFormModal";
import RoleAssignment from "./components/roleAsigment";

type Option = { label: React.ReactNode; value: number };

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const access = useAccess();

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Option | undefined>();
  const [assigning, setAssigning] = useState(false);

  const valid = !!id && !Number.isNaN(userId);

  const {
    data: user,
    loading,
    refresh,
  } = useRequest(() => getUser(userId), {
    ready: valid,
    refreshDeps: [id],
  });

  const {
    data: assigned = [],
    loading: rolesLoading,
    refresh: refreshRoles,
  } = useRequest(() => getUserRoles(userId), {
    ready: valid,
    refreshDeps: [id],
  });

  // only roles that are not assigned yet
  const loadRoles = useCallback(
    async (search: string): Promise<Option[]> => {
      const res = await getRoles({ page: 1, limit: 50, name: search });
      return res.data
        .filter((r) => !assigned.some((a) => a.id === r.id))
        .map((r) => ({ label: r.name, value: r.id }));
    },
    [assigned],
  );

  const handleAssign = async () => {
    if (!selected) return;
    setAssigning(true);
    try {
      await addUserRole(userId, selected.value);
      message.success("Role assigned");
      setSelected(undefined);
      refreshRoles();
    } finally {
      setAssigning(false);
    }
  };

  const handleRevoke = async (roleId: number) => {
    await removeUserRole(userId, roleId);
    message.success("Role removed");
    refreshRoles();
  };

  const handleDelete = async () => {
    await deleteUser(userId);
    message.success("User deleted");
    history.replace("/auth/users");
  };

  return (
    <PageContainer
      loading={loading}
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
          <Space size={16} align="center">
            <Avatar
              size={64}
              icon={<UserOutlined />}
              style={{ background: "#1677ff1A", color: "#1677ff" }}
            />
            <div>
              <Typography.Title level={4} style={{ margin: 0 }}>
                {user?.name ?? "User"}
              </Typography.Title>
              <Typography.Text type="secondary">{user?.email}</Typography.Text>
              <div style={{ marginTop: 4 }}>
                <Space size={8}>
                  <Tag>ID: {user?.id}</Tag>
                  <Tag>@{user?.username}</Tag>
                  <Tag color={user?.is_active ? "green" : "red"}>
                    {user?.is_active ? "Active" : "Inactive"}
                  </Tag>
                </Space>
              </div>
            </div>
          </Space>
        </Card>

        <Card>
          <Tabs
            items={[
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
          refresh();
        }}
      />
    </PageContainer>
  );
}
