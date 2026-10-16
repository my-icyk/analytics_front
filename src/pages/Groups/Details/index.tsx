import { useRequest } from "ahooks";
import { PageContainer } from "@ant-design/pro-components";
import { history, useAccess, useParams } from "@umijs/max";
import { useState } from "react";
import { getGroup } from "@/services/groups";
import { Button } from "antd";
import GroupOverview from "./components/overview-tab";

export default function GroupDetails() {
  const [activeTab, setActiveTab] = useState("1");
  const { id } = useParams<{ id: string }>();

  const {
    data: group,
    loading,
    refresh,
  } = useRequest(() => getGroup(Number(id)), {
    ready: !!id,
    refreshDeps: [id],
  });

  return (
    <PageContainer
      header={{ title: group?.name ?? "Group", ghost: true }}

      tabList={[
        {
          tab: "Overview",
          key: "1",
        },
        {
          tab: "Departments",
          key: "2",
        },
        {
          tab: "Rules",
          key: "3",
        },
      ]}
      tabActiveKey={activeTab}
      onTabChange={(key) => setActiveTab(key)}

      extra={[
        <Button key="1" type="primary">
          Edit
        </Button>,
        <Button key="2" danger type="default">
          Delete
        </Button>,
      ]}
    >
      {activeTab === "1" && group && <GroupOverview {...group} />}
    </PageContainer>
  );
}
