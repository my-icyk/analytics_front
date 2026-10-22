import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import { Statistic, Tag } from "antd";
import type { Group } from "@/types/groups";

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
    <ProCard ghost direction="column">
      <ProCard
        headerBordered
        title={group.name}
        extra={<Tag color="blue">ID: {group.id}</Tag>}
      >
        <ProDescriptions<Group>
          column={{ xs: 1, md: 2 }}
          dataSource={group}
          columns={[
            { title: "Division", dataIndex: "division_name" },
            { title: "Group type", dataIndex: "group_type_name" },
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
