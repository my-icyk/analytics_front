import { DeleteOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button, Card, Empty, List, Popconfirm, Space, message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addRolePermission,
  getRolePermissions,
  removeRolePermission,
  permissionsLookup,
} from "@/services/roles";
import { DebounceSelect } from "@/components/DebounceSelect";
import { Permission } from "@/types/auth";

export default function PermissionsTable({ roleId }: { roleId: number }) {
  const [assigned, setAssigned] = useState<Permission[]>([]);
  const [selected, setSelected] = useState<
    { label: string; value: number } | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const loadPermissions = useCallback(
    (search: string) => permissionsLookup(search),
    [],
  );

  const load = async () => {
    setLoading(true);
    try {
      setAssigned(await getRolePermissions(roleId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [roleId]);

  const handleAssign = async () => {
    if (selected === undefined) return;
    setAssigning(true);
    try {
      await addRolePermission(roleId, selected.value);
      message.success("Permissions assigned");
      setSelected(undefined);
      await load();
    } finally {
      setAssigning(false);
    }
  };

  const handleRevoke = async (permissionId: number) => {
    await removeRolePermission(roleId, permissionId);
    message.success("Permission revoked");
    load();
  };

  return (
    <Card>
      <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
        <DebounceSelect
          value={selected}
          allowClear
          placeholder="Select permissions to assign"
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
              description="No permissions assigned to this role"
            />
          ),
        }}
        renderItem={(p) => (
          <List.Item
            actions={[
              <Popconfirm
                key="revoke"
                title="Revoke this permission?"
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
