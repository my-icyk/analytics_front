import { SaveOutlined, UndoOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Empty,
  Input,
  List,
  Space,
  Spin,
  Tag,
  message,
} from "antd";
import { useRequest } from "ahooks";
import { useCallback, useMemo, useState } from "react";

import { useRoles } from "@/hooks/useReferenceData";
import { assignUserRoles, getUserRoles } from "@/services/users";

// roles that "Select all" must never tick (the admin can still tick them one by one)
const PROTECTED_ROLES = new Set(["admin"]);

const areSetsEqual = (a: Set<number>, b: Set<number>) =>
  a.size === b.size && [...a].every((id) => b.has(id));

export default function UserRolesTab({ userId }: { userId: number }) {
  const { data: allRoles = [], loading: loadingRoles } = useRoles();

  const [initial, setInitial] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");

  const {
    loading: loadingUser,
    error: loadError,
    refresh,
  } = useRequest(() => getUserRoles(userId), {
    refreshDeps: [userId],
    onSuccess: (roles) => {
      const ids = new Set(roles.map((r) => r.id));
      setInitial(ids);
      setSelected(new Set(ids));
    },
  });

  const { loading: saving, runAsync: save } = useRequest(assignUserRoles, {
    manual: true,
  });

  const loading = loadingRoles || loadingUser;
  const disabled = loading || saving || !!loadError;
  const dirty = !areSetsEqual(selected, initial);

  // filtered list (search by name or description)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allRoles;
    return allRoles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q),
    );
  }, [allRoles, search]);

  // ids that "Select all" controls: visible and not protected
  const selectableIds = useMemo(
    () =>
      filtered
        .filter((r) => !PROTECTED_ROLES.has(r.name.toLowerCase()))
        .map((r) => r.id),
    [filtered],
  );
  const selectedCount = selectableIds.filter((id) => selected.has(id)).length;

  const toggleMany = useCallback((ids: number[], checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });
  }, []);

  const handleSave = async () => {
    if (disabled || !dirty) return;
    try {
      await save(userId, [...selected]);
      message.success("Roles saved");
      refresh(); // onSuccess resets initial + selected from the server
    } catch {
      message.error("Failed to save roles");
    }
  };

  return (
    <Card
      title={
        <Space>
          Roles
          <Tag color={dirty ? "orange" : "blue"}>
            {selected.size} of {allRoles.length} selected
          </Tag>
        </Space>
      }
      extra={
        <Space>
          <Button
            icon={<UndoOutlined />}
            disabled={!dirty || disabled}
            onClick={() => setSelected(new Set(initial))}
          >
            Reset
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            disabled={!dirty || disabled}
            loading={saving}
            onClick={handleSave}
          >
            Save
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input.Search
          allowClear
          placeholder="Search roles"
          value={search}
          disabled={loading}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Checkbox
          checked={
            selectableIds.length > 0 && selectedCount === selectableIds.length
          }
          indeterminate={
            selectedCount > 0 && selectedCount < selectableIds.length
          }
          disabled={disabled || selectableIds.length === 0}
          onChange={(e) => toggleMany(selectableIds, e.target.checked)}
        >
          Select all{search.trim() ? " results" : ""}
        </Checkbox>
      </Space>

      <Spin spinning={loading}>
        {loadError ? (
          <Empty description="Unable to load user roles" />
        ) : (
          <List
            dataSource={filtered}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    search ? "No roles match your search" : "No roles available"
                  }
                />
              ),
            }}
            renderItem={(role) => (
              <List.Item>
                <Checkbox
                  checked={selected.has(role.id)}
                  disabled={disabled}
                  onChange={(e) => toggleMany([role.id], e.target.checked)}
                >
                  <strong>{role.name}</strong>
                  {role.description && (
                    <div style={{ opacity: 0.65 }}>{role.description}</div>
                  )}
                </Checkbox>
              </List.Item>
            )}
          />
        )}
      </Spin>
    </Card>
  );
}
