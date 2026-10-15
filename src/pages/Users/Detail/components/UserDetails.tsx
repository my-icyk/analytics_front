import { User } from "@/types/user";
import { Descriptions, Tag } from "antd";

type UserDetailsProps = {
  user: User;
};

export function UserDetails({ user }: UserDetailsProps) {
  return (
    <Descriptions
      bordered
      column={1}
      labelStyle={{ width: "10%", textAlign: "right" }}
    >
      <Descriptions.Item label="ID">{user.id}</Descriptions.Item>

      <Descriptions.Item label="Username">{user.username}</Descriptions.Item>

      <Descriptions.Item label="Name">{user.name}</Descriptions.Item>

      <Descriptions.Item label="Email">{user.email}</Descriptions.Item>

      <Descriptions.Item label="Admin">
        {user.is_admin ? "Yes" : "No"}
      </Descriptions.Item>

      <Descriptions.Item label="Active">
        <Tag color={user.is_active ? "success" : "error"}>
          {user.is_active ? "Active" : "Inactive"}
        </Tag>
      </Descriptions.Item>
    </Descriptions>
  );
}
