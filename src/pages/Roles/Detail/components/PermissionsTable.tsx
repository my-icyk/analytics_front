import { PageContainer, ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { useParams } from "@umijs/max";
import { Button, List, Popconfirm, Modal, Select, message } from "antd";
import { useEffect, useState } from "react";
import {
  getRolePermissions,
  getPermissions,
  addRolePermission,
  removeRolePermission,
} from "@/services/roles";

type Permission = {
  id: number;
  name: string;
  description: string;
};

export default function PermissionsTable({ roleId }: { roleId: number }) {
  const [assigned, setAssigned] = useState<Permission[]>([]);
  const [all, setAll] = useState<Permission[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const load = async () => {
    setAssigned(await getRolePermissions(roleId)); // GET /roles/:id/permissions
  };

  useEffect(() => {
    load();
    getPermissions().then(setAll); // GET /permissions
  }, [roleId]);

  // only permissions that are not assigned yet
  const available = all.filter((p) => !assigned.some((a) => a.id === p.id));

  const handleRevoke = async (permissionId: number) => {
    await removeRolePermission(roleId, permissionId);
    message.success("Permission revoked");
    load();
  };

  const handleAssign = async () => {
    await Promise.all(selected.map((pid) => addRolePermission(roleId, pid)));
    message.success("Permissions assigned");
    setOpen(false);
    setSelected([]);
    load();
  };
  return (
    <PageContainer
      extra={[
        <Button key="assign" type="primary" onClick={() => setOpen(true)}>
          Assign permission
        </Button>,
      ]}
    >
      <List
        bordered
        dataSource={assigned}
        renderItem={(p) => (
          <List.Item
            actions={[
              <Popconfirm
                key="revoke"
                title="Revoke this permission?"
                onConfirm={() => handleRevoke(p.id)}
              >
                <Button type="link" danger>
                  Revoke
                </Button>
              </Popconfirm>,
            ]}
          >
            {p.name}
          </List.Item>
        )}
      />

      <Modal
        title="Assign permissions"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleAssign}
        okText="Assign"
        okButtonProps={{ disabled: selected.length === 0 }}
      >
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Select permissions"
          value={selected}
          onChange={setSelected}
          optionFilterProp="label"
          options={available.map((p) => ({ label: p.name, value: p.id }))}
        />
      </Modal>
    </PageContainer>
  );
}
