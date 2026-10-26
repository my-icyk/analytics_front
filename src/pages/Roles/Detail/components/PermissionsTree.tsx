import { Checkbox, Collapse, Empty, Flex, Space, Tag } from "antd";
import { memo, useState } from "react";
import {
  toArray,
  type PermissionLeaf,
  type PermissionTree,
} from "./permissionTree";

type ToggleHandler = (ids: number[], checked: boolean) => void;

type GroupCheckboxProps = {
  label: string;
  ids: number[];
  selected: Set<number>;
  disabled: boolean;
  onToggle: ToggleHandler;
};

const GroupCheckbox = memo(function GroupCheckbox({
  label,
  ids,
  selected,
  disabled,
  onToggle,
}: GroupCheckboxProps) {
  const count = ids.filter((id) => selected.has(id)).length;

  return (
    <Space>
      {/* stop the click so toggling the checkbox doesn't open/close the panel */}
      <span onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={ids.length > 0 && count === ids.length}
          indeterminate={count > 0 && count < ids.length}
          disabled={disabled || ids.length === 0}
          onChange={(e) => onToggle(ids, e.target.checked)}
        >
          <strong>{label}</strong>
        </Checkbox>
      </span>
      <Tag>
        {count}/{ids.length}
      </Tag>
    </Space>
  );
});

type Props = {
  tree: PermissionTree;
  selected: Set<number>;
  searching: boolean;
  disabled: boolean;
  onToggle: ToggleHandler;
};

export function PermissionsTree({
  tree,
  selected,
  searching,
  disabled,
  onToggle,
}: Props) {
  const [openDomains, setOpenDomains] = useState<string[]>([]);
  const [openResources, setOpenResources] = useState<Record<string, string[]>>(
    {},
  );

  if (tree.size === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No permissions found"
      />
    );
  }

  const renderLeaves = (leaves: PermissionLeaf[]) => (
    <Flex wrap gap={16}>
      {leaves.map(({ permission, action }) => (
        <Checkbox
          key={permission.id}
          title={permission.name}
          checked={selected.has(permission.id)}
          disabled={disabled}
          onChange={(e) => onToggle([permission.id], e.target.checked)}
        >
          {action}
        </Checkbox>
      ))}
    </Flex>
  );

  const renderResources = (
    domain: string,
    resources: Map<string, PermissionLeaf[]>,
  ) => (
    <Collapse
      size="small"
      activeKey={
        searching ? [...resources.keys()] : (openResources[domain] ?? [])
      }
      onChange={(keys) =>
        setOpenResources((prev) => ({ ...prev, [domain]: toArray(keys) }))
      }
      items={[...resources.entries()].map(([resource, leaves]) => ({
        key: resource,
        label: (
          <GroupCheckbox
            label={resource}
            ids={leaves.map((l) => l.permission.id)}
            selected={selected}
            disabled={disabled}
            onToggle={onToggle}
          />
        ),
        children: renderLeaves(leaves),
      }))}
    />
  );

  return (
    <Collapse
      activeKey={searching ? [...tree.keys()] : openDomains}
      onChange={(keys) => setOpenDomains(toArray(keys))}
      items={[...tree.entries()].map(([domain, resources]) => ({
        key: domain,
        label: (
          <GroupCheckbox
            label={domain}
            ids={[...resources.values()].flat().map((l) => l.permission.id)}
            selected={selected}
            disabled={disabled}
            onToggle={onToggle}
          />
        ),
        children: renderResources(domain, resources),
      }))}
    />
  );
}
