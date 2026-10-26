import { ArrowRightOutlined } from "@ant-design/icons";
import { history } from "@umijs/max";
import { Checkbox, Empty, List, Typography } from "antd";

import type { Role } from "@/types/auth";

const { Link, Text } = Typography;

type Props = {
  roles: Role[];
  selected: Set<number>;
  disabled: boolean;
  search: string;
  onToggle: (ids: number[], checked: boolean) => void;
};

export default function RoleList({
  roles,
  selected,
  disabled,
  search,
  onToggle,
}: Props) {
  return (
    <List
      dataSource={roles}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              search ? "No roles match your search" : "No roles available"
            }
          />
        ),
      }}
      renderItem={(role) => (
        <List.Item
          style={{
            padding: "14px 16px",
            borderRadius: 8,
          }}
          extra={
            <ArrowRightOutlined
              style={{ color: "#999", cursor: "pointer" }}
              onClick={() => history.push(`/auth/roles/${role.id}`)}
            />
          }
        >
          <Checkbox
            checked={selected.has(role.id)}
            disabled={disabled}
            onChange={(event) => onToggle([role.id], event.target.checked)}
            style={{ marginRight: 12 }}
          />

          <List.Item.Meta
            title={
              <Link onClick={() => history.push(`/auth/roles/${role.id}`)}>
                {role.name}
              </Link>
            }
            description={
              <Text type="secondary">
                {role.description || "No description"}
              </Text>
            }
          />
        </List.Item>
      )}
    />
  );
}
