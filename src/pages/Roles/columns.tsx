import { Role } from "@/types/auth";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import type { ProColumns } from "@ant-design/pro-components";
import { useAccess } from "@umijs/max";
import { Popconfirm, Button } from "antd";
import { PERMISSIONS } from "../../../config/permissions";
import { numberSorter, stringSorter } from "@/utils/sorters";

export const getColumns = (
  handleDelete: (id: number) => void,
  handleEdit: (role: Role) => void,
  handleView: (role: Role) => void,
  access: ReturnType<typeof useAccess>,
): ProColumns<Role>[] => [
  {
    title: "ID",
    dataIndex: "id",
    search: false,
    width: 50,
    sorter: numberSorter<Role>("id"),
  },
  {
    title: "Name",
    dataIndex: "name",
    search: true,
    sorter: stringSorter<Role>("name"),
  },
  {
    title: "Users",
    dataIndex: "users_count",
    search: false,
    sorter: numberSorter<Role>("users_count"),
  },
  {
    title: "Permissions",
    dataIndex: "permissions_count",
    search: false,
    sorter: numberSorter<Role>("permissions_count"),
  },

  {
    title: "Actions",
    width: 300,
    valueType: "option",
    render: (_, record) => [
      access[PERMISSIONS.AUTH.ROLES.READ] && (
        <Button
          key="view-button"
          type="link"
          onClick={() => handleView(record)}
        >
          View
        </Button>
      ),
      access[PERMISSIONS.AUTH.ROLES.UPDATE] && (
        <Button
          key="edit-button"
          type="link"
          onClick={() => handleEdit(record)}
        >
          Edit
        </Button>
      ),
      access[PERMISSIONS.AUTH.ROLES.DELETE] && (
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
        </Popconfirm>
      ),
    ],
  },
];
