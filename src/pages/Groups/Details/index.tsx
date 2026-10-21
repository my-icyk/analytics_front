import { useState } from "react";
import { useRequest } from "ahooks";
import { PageContainer } from "@ant-design/pro-components";
import { useParams } from "@umijs/max";
import { Button } from "antd";
import { getGroup } from "@/services/groups";
import GroupOverview from "./components/overview-tab";
import RulesTab from "./components/rules-tab";
import DepartmentTab from "./components/department-tab";
import GroupFormModal from "../GroupFormModal";
import { useTabParam } from "@/hooks/useTabParam";

import { GroupTABS, GroupTabKey } from "@/constants/groups";
export default function GroupDetails() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useTabParam(
    GroupTABS,
    GroupTabKey.Overview,
  );
  const [editOpen, setEditOpen] = useState(false);

  const {
    data: group,
    loading,
    refresh,
  } = useRequest(() => getGroup(Number(id)), {
    ready: !!id,
    refreshDeps: [id],
  });

  const handleEditSuccess = () => {
    setEditOpen(false);
    refresh(); // reload group data so header + tabs show the changes
  };

  return (
    <PageContainer
      loading={loading}
      header={{ title: group?.name ?? "Group", ghost: true }}
      tabList={GroupTABS}
      tabActiveKey={activeTab}
      onTabChange={setActiveTab}
      extra={[
        <Button key="edit" type="primary" onClick={() => setEditOpen(true)}>
          Edit Group
        </Button>,
        <Button key="delete" danger>
          Delete
        </Button>,
      ]}
    >
      {group && (
        <>
          {activeTab === GroupTabKey.Overview && <GroupOverview {...group} />}
          {activeTab === GroupTabKey.Departments && (
            <DepartmentTab groupId={group.id} />
          )}
          {activeTab === GroupTabKey.Rules && <RulesTab groupId={group.id} />}

          <GroupFormModal
            key={group.id}
            group={group}
            open={editOpen}
            onCancel={() => setEditOpen(false)}
            onSuccess={handleEditSuccess}
          />
        </>
      )}
    </PageContainer>
  );
}
