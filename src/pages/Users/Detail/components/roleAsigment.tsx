import { DeleteOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button, Card, Empty, List, Popconfirm, Space, message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { addUserRole, removeUserRole, getUserRoles } from "@/services/users";
import { DebounceSelect } from "@/components/DebounceSelect";
import type { Role } from "@/types/auth";
import { rolesLookup } from "@/services/roles";

export default function RoleAssignment({ userId }: { userId: number }) {
  const [assigned, setAssigned] = useState<Role[]>([]);
  const [selected, setSelected] = useState<
    { label: string; value: number } | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const loadPermissions = useCallback(
    (search: string) => rolesLookup(search),
    [],
  );

  const load = async () => {
    setLoading(true);
    try {
      setAssigned(await getUserRoles(userId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [userId]);

  const handleAssign = async () => {
    if (selected === undefined) return;
    setAssigning(true);
    try {
      await addUserRole(userId, selected.value);
      message.success("Role assigned");
      setSelected(undefined);
      await load();
    } finally {
      setAssigning(false);
    }
  };

  const handleRevoke = async (roleId: number) => {
    await removeUserRole(userId, roleId);
    message.success("Role revoked");
    load();
  };

  return (
    <Card>
      <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
        <DebounceSelect
          value={selected}
          allowClear
          placeholder="Select roles to assign"
          fetchOptions={loadPermissions}
          onChange={(value) => setSelected(value)}
        />
        <Button
          type="primary"
          disabled={selected === undefined}
          loading={assigning}
          onClick={handleAssign}
        >
          Assign
        </Button>
      </Space.Compact>

      <List
        loading={loading}
        dataSource={assigned}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No roles assigned to this user"
            />
          ),
        }}
        renderItem={(p) => (
          <List.Item
            actions={[
              <Popconfirm
                key="revoke"
                title="Revoke this role?"
                okText="Revoke"
                okButtonProps={{ danger: true }}
                onConfirm={() => handleRevoke(p.id)}
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  size="large"
                />
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <SafetyCertificateOutlined
                  style={{ fontSize: 20, marginTop: 4 }}
                />
              }
              title={p.name}
              description={`id: ${p.id}`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
