import { SaveOutlined, UndoOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Empty,
  Flex,
  Input,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";

import RoleList from "./RoleList";
import { useUserRoles } from "./useUserRoles";

export default function UserRolesTab({ userId }: { userId: number }) {
  const {
    allRoles,
    filtered,
    selected,
    search,
    setSearch,
    selectableIds,
    selectedCount,
    dirty,
    loading,
    saving,
    disabled,
    loadError,
    toggle,
    reset,
    save,
  } = useUserRoles(userId);

  const allSelected =
    selectableIds.length > 0 && selectedCount === selectableIds.length;

  const partiallySelected =
    selectedCount > 0 && selectedCount < selectableIds.length;

  return (
    <Card
      title={
        <Space>
          <Typography.Text strong>Assigned Roles</Typography.Text>
          <Tag color={dirty ? "orange" : "blue"}>
            {selected.size} / {allRoles.length}
          </Tag>
          {dirty && <Tag color="warning">Unsaved changes</Tag>}
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
            loading={saving}
            disabled={!dirty || disabled}
            onClick={save}
          >
            Save Changes
          </Button>
        </Space>
      }
    >
      <Flex
        align="center"
        justify="space-between"
        gap={16}
        wrap="wrap"
        style={{ marginBottom: 16 }}
      >
        <Input.Search
          allowClear
          placeholder="Search roles..."
          value={search}
          disabled={loading}
          style={{ maxWidth: 320 }}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Checkbox
          checked={allSelected}
          indeterminate={partiallySelected}
          disabled={disabled || selectableIds.length === 0}
          onChange={(event) => toggle(selectableIds, event.target.checked)}
        >
          Select all{search.trim() ? " results" : ""}
        </Checkbox>
      </Flex>

      <Spin spinning={loading}>
        {loadError ? (
          <Empty description="Unable to load user roles" />
        ) : (
          <RoleList
            roles={filtered}
            selected={selected}
            disabled={disabled}
            search={search}
            onToggle={toggle}
          />
        )}
      </Spin>
    </Card>
  );
}
