import type { ProColumns } from "@ant-design/pro-components";
import { Button, Tag } from "antd";
import type { User } from "@/types/user";
import { useAccess } from "@@/plugin-access";
import { history } from "@umijs/max";
import { PERMISSIONS } from "../../../config/permissions";

/** Table columns of the Users page, kept apart so index.tsx stays short. */
export const getColumns = (
  access: ReturnType<typeof useAccess>,
): ProColumns<User>[] => [
  { title: "ID", dataIndex: "id" },
  { title: "Username", dataIndex: "username" },
  {
    title: "Admin",
    dataIndex: "is_admin",
    render: (_, user) => (
      <Tag color={user.is_admin ? "gold" : "default"}>
        {user.is_admin ? "admin" : "user"}
      </Tag>
    ),
  },
  {
    title: "Actions",
    valueType: "option",
    render: (_, record) => [
      access[PERMISSIONS.AUTH.USERS.READ] && (
        <Button
          key="view"
          type="link"
          onClick={() => history.push(`users/${record.id}`)}
        >
          View
        </Button>
      ),
      // ...edit, delete
    ],
  },
];
