import type { ProColumns } from "@ant-design/pro-components";
import { Tag } from "antd";
import { ViewActionButton } from "@/components/TableActions/ViewActionButton";
import type { User } from "@/types/user";
import { useAccess } from "@@/plugin-access";

import { PERMISSIONS } from "../../../config/permissions";
import { DeleteActionButton } from "@/components/DeleteActionButton";
import { EditActionButton } from "@/components/EditActionButton";

/** Table columns of the Users page, kept apart so index.tsx stays short. */
export const getColumns = (
  access: ReturnType<typeof useAccess>,
  onEdit: (user: User) => void,
  onDelete: (user: User) => void,
): ProColumns<User>[] => {
  const canOpen = access[PERMISSIONS.AUTH.USERS.READ];
  const canEdit = access[PERMISSIONS.AUTH.USERS.UPDATE];
  const canDelete = access[PERMISSIONS.AUTH.USERS.DELETE];
  return [
    { title: "ID", dataIndex: "id", search: false },
    { title: "Username", dataIndex: "username" },
    {
      title: "Admin",
      dataIndex: "is_admin",
      width: 120,
      valueEnum: {
        true: { text: "Admin" },
        false: { text: "User" },
      },
      render: (_, user) => (
        <Tag color={user.is_admin ? "gold" : "default"}>
          {user.is_admin ? "admin" : "user"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      valueType: "option",
      search: false,
      width: 120,
      render: (_, record) => [
        canOpen && (
          <ViewActionButton
            key="view-button"
            to={`${record.id}`}
            itemLabel={record.username}
          />
        ),
        canEdit && (
          <EditActionButton
            key="edit-button"
            itemLabel={record.name}
            onClick={() => onEdit(record)}
          />
        ),
        canDelete && (
          <DeleteActionButton
            key="delete-button"
            entityName="user"
            itemLabel={record.username}
            onConfirm={() => onDelete(record)}
          />
        ),
      ],
    },
  ];
};
