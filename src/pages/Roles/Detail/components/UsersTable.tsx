import { Button, List, Modal, Popconfirm, Select, message } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";

import { lookupUsers } from "@/services/users";
import { getUserRoles, addUserRole, removeUserRole } from "@/services/users";

type User = { id: number; username: string };
type Option = { label: string; value: number };

export default function UsersList({ roleId }: { roleId: number }) {
  const [assigned, setAssigned] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);

  const load = async () => {
    setAssigned(await getUserRoles(roleId)); // GET /roles/:id/users
  };

  useEffect(() => {
    load();
  }, [roleId]);

  const search = async (text?: string) => {
    const id = ++requestId.current;
    setLoading(true);
    try {
      const users = await lookupUsers(text || undefined);
      if (id !== requestId.current) return;
      setOptions(users.map((u) => ({ label: u.username, value: u.id })));
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };

  const debouncedSearch = useMemo(() => debounce(search, 400), [roleId]);
  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleRevoke = async (userId: number) => {
    await removeUserRole(userId, roleId);
    message.success("User removed from role");
    load();
  };

  const handleAssign = async () => {
    await Promise.all(selected.map((s) => addUserRole(s.value, roleId)));
    message.success("Users assigned");
    setOpen(false);
    setSelected([]);
    setOptions([]);
    load();
  };

  const handleOpen = () => {
    setOpen(true);
    search(); // first 50 users
  };

  return (
    <>
      <div style={{ marginBottom: 16, textAlign: "right" }}>
        <Button type="primary" onClick={handleOpen}>
          Assign user
        </Button>
      </div>

      <List
        bordered
        dataSource={assigned}
        pagination={{ pageSize: 10 }}
        renderItem={(u) => (
          <List.Item
            actions={[
              <Popconfirm
                key="revoke"
                title="Remove this user from the role?"
                onConfirm={() => handleRevoke(u.id)}
              >
                <Button type="link" danger>
                  Revoke
                </Button>
              </Popconfirm>,
            ]}
          >
            {u.username}
          </List.Item>
        )}
      />

      <Modal
        title="Assign users"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleAssign}
        okText="Assign"
        okButtonProps={{ disabled: selected.length === 0 }}
        destroyOnHidden
      >
        <Select
          mode="multiple"
          showSearch
          labelInValue
          filterOption={false}
          style={{ width: "100%" }}
          placeholder="Search users"
          value={selected}
          options={options}
          loading={loading}
          onSearch={debouncedSearch}
          onChange={setSelected}
          notFoundContent={loading ? "Loading..." : "No users found"}
        />
      </Modal>
    </>
  );
}
