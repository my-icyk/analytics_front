import { SaveOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Input, Space, Spin, Tag, message } from "antd";
import { useRequest } from "ahooks";
import { useCallback, useMemo, useState } from "react";

import { usePermissions } from "@/hooks/useReferenceData";
import { assignRolePermissions, getRolePermissions } from "@/services/roles";
import { PermissionsTree } from "./PermissionsTree";
import { areSetsEqual, buildPermissionTree } from "./permissionTree";

export default function PermissionsTable({ roleId }: { roleId: number }) {
  const { data: all = [], loading: loadingAll } = usePermissions();

  const [initial, setInitial] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");

  const {
    loading: loadingRole,
    error: loadError,
    refresh: refreshRole,
  } = useRequest(() => getRolePermissions(roleId), {
    refreshDeps: [roleId],
    onBefore: () => {
      setInitial(new Set());
      setSelected(new Set());
    },
    onSuccess: (permissions) => {
      const ids = new Set(permissions.map((p) => p.id));
      setInitial(ids);
      setSelected(new Set(ids));
    },
  });

  const { loading: saving, runAsync: savePermissions } = useRequest(
    assignRolePermissions,
    { manual: true },
  );

  const tree = useMemo(() => buildPermissionTree(all, search), [all, search]);
  const dirty = !areSetsEqual(selected, initial);
  const loading = loadingAll || loadingRole;
  const disabled = loading || saving || !!loadError;

  const toggle = useCallback((ids: number[], checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });
  }, []);

  const save = async () => {
    if (disabled || !dirty) return;
    try {
      await savePermissions(roleId, [...selected]);
      message.success("Permissions saved");
      refreshRole(); // refetch, and onSuccess resets initial + selected
    } catch {
      message.error("Failed to save permissions");
    }
  };

  return (
    <Card
      title={
        <Space>
          Permissions
          <Tag color={dirty ? "orange" : "blue"}>
            {selected.size} of {all.length} selected
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
            onClick={save}
          >
            Save
          </Button>
        </Space>
      }
    >
      <Input.Search
        allowClear
        placeholder="Search permissions"
        value={search}
        disabled={loading}
        style={{ marginBottom: 16 }}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Spin spinning={loading}>
        {loadError ? (
          <Empty description="Unable to load role permissions" />
        ) : (
          <PermissionsTree
            tree={tree}
            selected={selected}
            searching={search.trim().length > 0}
            disabled={disabled}
            onToggle={toggle}
          />
        )}
      </Spin>
    </Card>
  );
}
