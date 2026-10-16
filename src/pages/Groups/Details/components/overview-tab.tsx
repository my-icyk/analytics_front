import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import { Space, Statistic, Tag, Typography } from "antd";
import type { Group } from "@/types/groups";

const { Text } = Typography;

export default function GroupOverview(group: Group) {
  const stats = [
    {
      title: "Rules",
      value: group.rules_count,
    },
    {
      title: "Repartitions",
      value: group.repartitions_count,
    },
  ];

  return (
    <ProCard ghost direction="column" gutter={[16, 16]}>
      <ProCard
        bordered
        headerBordered
        title={group.name}
        extra={<Tag color="blue">ID: {group.id}</Tag>}
      >
        <ProDescriptions<Group>
          column={{ xs: 1, md: 2 }}
          dataSource={group}
          columns={[
            { title: "Division", dataIndex: "division" },
            { title: "Group type", dataIndex: "type" },
          ]}
        />
      </ProCard>

      <ProCard ghost gutter={[16, 16]} wrap>
        {stats.map(({ title, value }) => (
          <ProCard
            key={title}
            bordered
            colSpan={{ xs: 24, sm: 12, lg: 8 }}
            hoverable
          >
            <Statistic title={title} value={value ?? 0} />
          </ProCard>
        ))}
      </ProCard>
    </ProCard>
  );
}
