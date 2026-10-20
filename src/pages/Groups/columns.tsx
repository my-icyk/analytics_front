import { Group, GroupType } from "@/types/groups";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import type { ProColumns } from "@ant-design/pro-components";
import { Popconfirm, Tag, Button } from "antd";
import { history } from "@umijs/max";
import { Link } from "@umijs/max";
import { GroupTabKey } from "@/constants/groups";

/** Table columns of the Users page, kept apart so index.tsx stays short. */
export const getColumns = (
  groupTypes: GroupType[],
  divisionOptions: { label: string; value: number }[],
  handleDelete: (id: number) => void,
): ProColumns<Group>[] => [
  { title: "ID", dataIndex: "id", search: false },
  {
    title: "Name",
    dataIndex: "name",
    key: "search",
    render: (_, group) => <Link to={`${group.id}`}>{group.name}</Link>,
  },
  {
    title: "Division",
    valueType: "select",
    fieldProps: {
      options: divisionOptions,
      allowClear: true,
      mode: "multiple",
      placeholder: "Select Divisions",
    },
    render: (_, group) => <Tag color="blue">{group.division_name}</Tag>,
  },
  {
    title: "Group Type",
    dataIndex: "group_type_name",
    key: "group_type_ids",
    valueType: "select",

    fieldProps: {
      options: groupTypes,
      fieldNames: { label: "name", value: "id" },
      allowClear: true,
      mode: "multiple",
      placeholder: "Select Group Types",
    },
    render: (_, group) => <Tag color="green">{group.group_type_name}</Tag>,
  },
  {
    title: "Repartition",
    key: "repartition_count",
    render: (_, group) => (
      <Link to={`${group.id}?tab=${GroupTabKey.Departments}`}>
        {group.repartitions_count}
      </Link>
    ),
  },
  {
    title: "Rules",
    key: "rules_count",
    render: (_, group) => (
      <Link to={`${group.id}?tab=${GroupTabKey.Rules}`}>
        {group.rules_count}
      </Link>
    ),
  },

  {
    title: "Actions",
    valueType: "option",
    render: (_, record) => [
      <Button
        key="view"
        type="link"
        onClick={() => history.push(`groups/${record.id}`)}
      >
        View
      </Button>,
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
