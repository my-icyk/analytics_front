import { PageContainer } from "@ant-design/pro-components";
import { useParams, history } from "@umijs/max";
import { Button, List, Modal, Popconfirm, Select, message } from "antd";
import { useEffect, useState } from "react";

import { addUserRole, getUserRoles, removeUserRole } from "@/services/users";
import { getRoles } from "@/services/roles";
import type { Role } from "@/types/auth";

export default function UserDetail() {
  const { id } = useParams();
  const userId = Number(id);

  const [assigned, setAssigned] = useState<Role[]>([]);
  const [all, setAll] = useState<Role[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const load = async () => setAssigned(await getUserRoles(userId));

  useEffect(() => {
    load();
    getRoles({ page: 1, limit: 100 }).then((r) => setAll(r.data));
  }, [userId]);

  const available = all.filter((r) => !assigned.some((a) => a.id === r.id));

  const handleRevoke = async (roleId: number) => {
    await removeUserRole(userId, roleId);
    message.success("Role removed");
    load();
  };

  const handleAssign = async () => {
    await Promise.all(selected.map((rid) => addUserRole(userId, rid)));
    message.success("Roles assigned");
    setOpen(false);
    setSelected([]);
    load();
  };

  return (
    <PageContainer
      onBack={() => history.push("/users")}
      extra={[
        <Button key="assign" type="primary" onClick={() => setOpen(true)}>
          Assign role
        </Button>,
      ]}
    >
      <List
        bordered
        dataSource={assigned}
        renderItem={(r) => (
          <List.Item
            actions={[
              <Popconfirm
                key="revoke"
                title="Remove this role from the user?"
                onConfirm={() => handleRevoke(r.id)}
              >
                <Button type="link" danger>
                  Revoke
                </Button>
              </Popconfirm>,
            ]}
          >
            {r.name}
          </List.Item>
        )}
      />

      <Modal
        title="Assign roles"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleAssign}
        okText="Assign"
        okButtonProps={{ disabled: selected.length === 0 }}
        destroyOnHidden
      >
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Select roles"
          value={selected}
          onChange={setSelected}
          optionFilterProp="label"
          options={available.map((r) => ({ label: r.name, value: r.id }))}
        />
      </Modal>
    </PageContainer>
  );
}
