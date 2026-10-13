import { useParams } from "@umijs/max";
import { Card, Tabs, Descriptions } from "antd";
import PermissionsTable from "./components/PermissionsTable";

export default function RoleDetailsPage() {
  const { id } = useParams();
  return (
    <>
      {/* Top section: Role information */}
      <Card title="Role Information">
        <Descriptions column={3}>
          <Descriptions.Item label="Role">Role</Descriptions.Item>
          <Descriptions.Item label="Id">{id}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Bottom section: Related data */}
      <Card style={{ marginTop: 16 }}>
        <Tabs
          items={[
            {
              key: "permissions",
              label: "Permissions",
              children: <PermissionsTable roleId={Number(id)} />,
            },
            // {
            //   key: "users",
            //   label: "Users",
            //   children: <UsersTables />,
            // },
          ]}
        />
      </Card>
    </>
  );
}
