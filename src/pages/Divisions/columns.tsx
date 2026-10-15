import { ProColumns } from "@ant-design/pro-components";
import type { Division } from "@/types/divisions";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export const getColumns = (
  handleDelete: (id: number) => void,
): ProColumns<Division>[] => [
  {
    title: "Division Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Actions",
    key: "actions",
    search: false,
    render: (_, record) => [
      <Popconfirm
        key="delete"
        title="Delete this division?"
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
