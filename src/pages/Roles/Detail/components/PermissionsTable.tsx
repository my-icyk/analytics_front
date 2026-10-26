import { SaveOutlined, UndoOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  Empty,
  Flex,
  Input,
  Space,
  Spin,
  Tag,
  message,
} from "antd";
import { useEffect, useMemo, useState } from "react";

import { assignRolePermissions, getRolePermissions } from "@/services/roles";
import { Permission } from "@/types/auth";
import { usePermissions } from "@/hooks/useReferenceData";

type Leaf = { permission: Permission; action: string };
type Tree = Map<string, Map<string, Leaf[]>>; // domain -> resource -> actions

function parse(name: string) {
  const parts = name.split(":");
  if (parts.length === 1)
    return { domain: "other", resource: "general", action: name };
  return {
    domain: parts[0],
    resource: parts.slice(1, -1).join(":") || "general",
    action: parts[parts.length - 1],
  };
}

function buildTree(all: Permission[], search: string): Tree {
  const q = search.trim().toLowerCase();
  const tree: Tree = new Map();
  for (const p of all) {
    if (q && !p.name.toLowerCase().includes(q)) continue;
    const { domain, resource, action } = parse(p.name);
    const resources = tree.get(domain) ?? new Map<string, Leaf[]>();
    resources.set(resource, [
      ...(resources.get(resource) ?? []),
      { permission: p, action },
    ]);
    tree.set(domain, resources);
  }
  return tree;
}

// Checkbox for a group of ids: checked / indeterminate / unchecked
function GroupCheckbox({
  label,
  ids,
  checked,
  onToggle,
}: {
  label: string;
  ids: number[];
  checked: Set<number>;
  onToggle: (ids: number[], on: boolean) => void;
}) {
  const count = ids.filter((id) => checked.has(id)).length;
  return (
    <>
      {/* stopPropagation: clicking the checkbox must not open/close the panel */}
      <span onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={count === ids.length}
          indeterminate={count > 0 && count < ids.length}
          onChange={(e) => onToggle(ids, e.target.checked)}
        >
          <strong>{label}</strong>
        </Checkbox>
      </span>
      <Tag>
        {count}/{ids.length}
      </Tag>
    </>
  );
}

export default function PermissionsTable({ roleId }: { roleId: number }) {
  const { data: all = [], loading: loadingAll } = usePermissions();

  const [initial, setInitial] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [loadingRole, setLoadingRole] = useState(false);
  const [saving, setSaving] = useState(false);

  // only the role's permissions are fetched here (they change at runtime)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingRole(true);
      try {
        const assigned = await getRolePermissions(roleId);
        if (cancelled) return;
        const ids = new Set(assigned.map((p) => p.id));
        setInitial(ids);
        setChecked(new Set(ids));
      } finally {
        if (!cancelled) setLoadingRole(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [roleId]);

  const tree = useMemo(
    () =>
      [...buildTree(all, search).entries()].sort(([a], [b]) =>
        a.localeCompare(b),
      ),
    [all, search],
  );

  const dirty =
    checked.size !== initial.size ||
    [...checked].some((id) => !initial.has(id));

  const toggle = (ids: number[], on: boolean) =>
    setChecked((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (on ? next.add(id) : next.delete(id)));
      return next;
    });

  const save = async () => {
    setSaving(true);
    try {
      await assignRolePermissions(roleId, [...checked]);
      setInitial(new Set(checked));
      message.success("Permissions saved");
    } finally {
      setSaving(false);
    }
  };

  const renderResources = (resources: Map<string, Leaf[]>) => (
    <Collapse
      size="small"
      key={search ? "search" : "idle"}
      defaultActiveKey={search ? [...resources.keys()] : []}
      items={[...resources.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([resource, leaves]) => ({
          key: resource,
          label: (
            <GroupCheckbox
              label={resource}
              ids={leaves.map((l) => l.permission.id)}
              checked={checked}
              onToggle={toggle}
            />
          ),
          children: (
            <Flex wrap gap={16}>
              {leaves.map(({ permission, action }) => (
                <Checkbox
                  key={permission.id}
                  title={permission.name}
                  checked={checked.has(permission.id)}
                  onChange={(e) => toggle([permission.id], e.target.checked)}
                >
                  {action}
                </Checkbox>
              ))}
            </Flex>
          ),
        }))}
    />
  );

  return (
    <Card
      title={
        <Space>
          Permissions
          <Tag color={dirty ? "orange" : "blue"}>
            {checked.size} of {all.length} selected
          </Tag>
        </Space>
      }
      extra={
        <Space>
          <Button
            icon={<UndoOutlined />}
            disabled={!dirty}
            onClick={() => setChecked(new Set(initial))}
          >
            Reset
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            disabled={!dirty}
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
        style={{ marginBottom: 16 }}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Spin spinning={loadingAll || loadingRole}>
        {tree.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No permissions found"
          />
        ) : (
          <Collapse
            key={search ? "search" : "idle"}
            defaultActiveKey={search ? tree.map(([domain]) => domain) : []}
            items={tree.map(([domain, resources]) => ({
              key: domain,
              label: (
                <GroupCheckbox
                  label={domain}
                  ids={[...resources.values()]
                    .flat()
                    .map((l) => l.permission.id)}
                  checked={checked}
                  onToggle={toggle}
                />
              ),
              children: renderResources(resources),
            }))}
          />
        )}
      </Spin>
    </Card>
  );
}
