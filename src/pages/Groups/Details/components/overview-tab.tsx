import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import type { ProDescriptionsItemProps } from "@ant-design/pro-components";
import { InfoCircleTwoTone } from "@ant-design/icons";
import type { Group } from "@/types/groups";

const columns: ProDescriptionsItemProps<Group>[] = [
  { title: "Group ID", dataIndex: "id", copyable: true },
  { title: "Name", dataIndex: "name" },
  { title: "Division", dataIndex: "division_name" },
  { title: "Group Type", dataIndex: "group_type_name" },
];

export default function GroupOverview(group: Group) {
  return (
    <ProCard title="Group Information" extra={<InfoCircleTwoTone />} bordered>
      <ProDescriptions<Group> dataSource={group} columns={columns} />
    </ProCard>
  );
}
