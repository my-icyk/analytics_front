import { Role } from "@/types/auth";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import type { ProColumns } from "@ant-design/pro-components";
import { Popconfirm, Tag, Button } from "antd";

export const getColumns = (
  handleDelete: (id: number) => void,
): ProColumns<Role>[] => [
  { title: "ID", dataIndex: "id", search: false },
  { title: "Name", dataIndex: "name" },

  {
    title: "Actions",
    valueType: "option",
    render: (_, record) => [
      <Popconfirm
        key="delete"
        title="Delete this role?"
        description={`Are you sure you want to delete role:"${record.name}"?`}
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
