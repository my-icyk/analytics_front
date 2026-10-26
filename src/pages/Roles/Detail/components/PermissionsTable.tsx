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
import { useEffect, useMemo, useRef, useState } from "react";

import { assignRolePermissions, getRolePermissions } from "@/services/roles";
import { usePermissions } from "@/hooks/useReferenceData";
import type { Permission } from "@/types/auth";

type PermissionLeaf = {
  permission: Permission;
  action: string;
};

type PermissionTree = Map<string, Map<string, PermissionLeaf[]>>;

type GroupCheckboxProps = {
  label: string;
  ids: number[];
  selected: Set<number>;
  disabled?: boolean;
  onToggle: (ids: number[], checked: boolean) => void;
};

function parsePermission(name: string) {
  const parts = name.split(":");

  if (parts.length === 1) {
    return {
      domain: "other",
      resource: "general",
      action: name,
    };
  }

  return {
    domain: parts[0],
    resource: parts.slice(1, -1).join(":") || "general",
    action: parts[parts.length - 1],
  };
}

function buildPermissionTree(
  permissions: Permission[],
  search: string,
): PermissionTree {
  const query = search.trim().toLowerCase();
  const tree: PermissionTree = new Map();

  for (const permission of permissions) {
    if (query && !permission.name.toLowerCase().includes(query)) {
      continue;
    }

    const { domain, resource, action } = parsePermission(permission.name);

    if (!tree.has(domain)) {
      tree.set(domain, new Map());
    }

    const resources = tree.get(domain)!;

    if (!resources.has(resource)) {
      resources.set(resource, []);
    }

    resources.get(resource)!.push({ permission, action });
  }

  return new Map(
    [...tree.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([domain, resources]) => [
        domain,
        new Map(
          [...resources.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([resource, leaves]) => [
              resource,
              leaves.sort((a, b) => a.action.localeCompare(b.action)),
            ]),
        ),
      ]),
  );
}

function areSetsEqual(a: Set<number>, b: Set<number>): boolean {
  return a.size === b.size && [...a].every((id) => b.has(id));
}

function GroupCheckbox({
  label,
  ids,
  selected,
  disabled = false,
  onToggle,
}: GroupCheckboxProps) {
  const count = ids.filter((id) => selected.has(id)).length;

  return (
    <Space>
      <span onClick={(event) => event.stopPropagation()}>
        <Checkbox
          checked={ids.length > 0 && count === ids.length}
          indeterminate={count > 0 && count < ids.length}
          disabled={disabled || ids.length === 0}
          onChange={(event) => onToggle(ids, event.target.checked)}
        >
          <strong>{label}</strong>
        </Checkbox>
      </span>

      <Tag>
        {count}/{ids.length}
      </Tag>
    </Space>
  );
}

type PermissionsTreeProps = {
  tree: PermissionTree;
  selected: Set<number>;
  search: string;
  disabled: boolean;
  onToggle: (ids: number[], checked: boolean) => void;
};

function PermissionsTree({
  tree,
  selected,
  search,
  disabled,
  onToggle,
}: PermissionsTreeProps) {
  const [openDomains, setOpenDomains] = useState<string[]>([]);
  const [openResources, setOpenResources] = useState<Record<string, string[]>>(
    {},
  );

  const searching = search.trim().length > 0;

  const domainKeys = [...tree.keys()];

  const renderResources = (
    domain: string,
    resources: Map<string, PermissionLeaf[]>,
  ) => {
    const resourceKeys = [...resources.keys()];

    return (
      <Collapse
        size="small"
        activeKey={searching ? resourceKeys : (openResources[domain] ?? [])}
        onChange={(keys) =>
          setOpenResources((prev) => ({
            ...prev,
            [domain]: keys,
          }))
        }
        items={[...resources.entries()].map(([resource, leaves]) => {
          const ids = leaves.map(({ permission }) => permission.id);

          return {
            key: resource,
            label: (
              <GroupCheckbox
                label={resource}
                ids={ids}
                selected={selected}
                disabled={disabled}
                onToggle={onToggle}
              />
            ),
            children: (
              <Flex wrap gap={16}>
                {leaves.map(({ permission, action }) => (
                  <Checkbox
                    key={permission.id}
                    title={permission.name}
                    checked={selected.has(permission.id)}
                    disabled={disabled}
                    onChange={(event) =>
                      onToggle([permission.id], event.target.checked)
                    }
                  >
                    {action}
                  </Checkbox>
                ))}
              </Flex>
            ),
          };
        })}
      />
    );
  };

  if (tree.size === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No permissions found"
      />
    );
  }

  return (
    <Collapse
      activeKey={searching ? domainKeys : openDomains}
      onChange={setOpenDomains}
      items={[...tree.entries()].map(([domain, resources]) => {
        const ids = [...resources.values()]
          .flat()
          .map(({ permission }) => permission.id);

        return {
          key: domain,
          label: (
            <GroupCheckbox
              label={domain}
              ids={ids}
              selected={selected}
              disabled={disabled}
              onToggle={onToggle}
            />
          ),
          children: renderResources(domain, resources),
        };
      })}
    />
  );
}

export default function PermissionsTable({ roleId }: { roleId: number }) {
  const { data: all = [], loading: loadingAll } = usePermissions();

  const [initial, setInitial] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [search, setSearch] = useState("");
  const [loadingRole, setLoadingRole] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);

  // Invalidates old requests when the role changes.
  const requestVersion = useRef(0);

  // Keep a ref to the currently displayed role for async safety.
  const currentRoleId = useRef(roleId);
  currentRoleId.current = roleId;

  useEffect(() => {
    const version = ++requestVersion.current;
    let cancelled = false;

    setLoadingRole(true);
    setLoadError(false);
    setInitial(new Set());
    setSelected(new Set());

    const load = async () => {
      try {
        const permissions = await getRolePermissions(roleId);

        if (cancelled || version !== requestVersion.current) {
          return;
        }

        const ids = new Set<number>(permissions.map((p) => p.id));

        setInitial(ids);
        setSelected(new Set(ids));
      } catch {
        if (!cancelled && version === requestVersion.current) {
          setLoadError(true);
          message.error("Failed to load role permissions");
        }
      } finally {
        if (!cancelled && version === requestVersion.current) {
          setLoadingRole(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
      requestVersion.current++;
    };
  }, [roleId]);

  const tree = useMemo(() => buildPermissionTree(all, search), [all, search]);

  const dirty = !areSetsEqual(initial, selected);
  const loading = loadingAll || loadingRole;
  const disabled = loading || saving || loadError;

  const toggle = (ids: number[], checked: boolean) => {
    if (disabled) return;

    setSelected((prev) => {
      const next = new Set(prev);

      for (const id of ids) {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      }

      return next;
    });
  };

  const reset = () => {
    if (disabled) return;
    setSelected(new Set(initial));
  };

  const save = async () => {
    if (disabled || !dirty) return;

    const ids = [...selected];
    const savedRoleId = roleId;
    const version = requestVersion.current;

    setSaving(true);

    try {
      await assignRolePermissions(savedRoleId, ids);

      // Do not update another role's state.
      if (
        version !== requestVersion.current ||
        currentRoleId.current !== savedRoleId
      ) {
        return;
      }

      setInitial(new Set(ids));
      message.success("Permissions saved");
    } catch {
      if (
        version === requestVersion.current &&
        currentRoleId.current === savedRoleId
      ) {
        message.error("Failed to save permissions");
      }
    } finally {
      setSaving(false);
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
            onClick={reset}
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
        onChange={(event) => setSearch(event.target.value)}
      />

      <Spin spinning={loading}>
        {loadError ? (
          <Empty description="Unable to load role permissions" />
        ) : (
          <PermissionsTree
            tree={tree}
            selected={selected}
            search={search}
            disabled={disabled}
            onToggle={toggle}
          />
        )}
      </Spin>
    </Card>
  );
}
