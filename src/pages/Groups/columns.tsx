import { Group } from "@/types/groups";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import type { ProColumns } from "@ant-design/pro-components";
import { Popconfirm, Tag, Button } from "antd";

/** Table columns of the Users page, kept apart so index.tsx stays short. */
export const getColumns = (
  handleDelete: (id: number) => void,
): ProColumns<Group>[] => [
  { title: "ID", dataIndex: "id", search: false },
  { title: "Name", dataIndex: "name" },
  {
    title: "Division",
    dataIndex: "division",
    key: "division_ids",
    valueType: "select",
    valueEnum: {
      1: { text: "Nerepartizat" },
      26: { text: "B2B" },
      27: { text: "B2C" },
    },
    fieldProps: {
      mode: "multiple",
      placeholder: "Select Divisions",
    },
    render: (_, group) => <Tag color="blue">{group.division.name}</Tag>,
  },
  {
    title: "Group Type",
    dataIndex: "group_type",
    key: "group_type_ids",
    valueType: "select",
    valueEnum: {
      1: { text: "Nerepartizat" },
      26: { text: "B2B" },
      27: { text: "B2C" },
    },
    fieldProps: {
      mode: "multiple",
      placeholder: "Select Group Types",
    },
    render: (_, group) => <Tag color="green">{group.group_type.name}</Tag>,
  },
  {
    title: "Actions",
    valueType: "option",
    render: (_, record) => [
      <Popconfirm
        key="delete"
        title="Delete this group?"
        description={`Are you sure you want to delete "${record.name}"?`}
        onConfirm={() => handleDelete(record.id)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <Button
          key="delete-button"
          type="link"
          danger
          icon={<DeleteOutlined />}
        >
          Delete
        </Button>
      </Popconfirm>,
    ],
  },
];
