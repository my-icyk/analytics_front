import { useMemo, useState } from "react";
import { useRequest } from "ahooks";
import { PageContainer } from "@ant-design/pro-components";
import { useParams } from "@umijs/max";
import { Button } from "antd";
import { getGroup, getGroupTypes } from "@/services/groups";
import GroupOverview from "./components/overview-tab";
import RulesTab from "./components/rules-tab";
import DepartmentTab from "./components/department-tab";
import GroupFormModal from "../GroupFormModal";
import { useTabParam } from "@/hooks/useTabParam";
import { useGroupTypes } from "@/hooks/useReferenceData";

enum TabKey {
  Overview = "overview",
  Departments = "departments",
  Rules = "rules",
}

const TABS = [
  { tab: "Overview", key: TabKey.Overview },
  { tab: "Departments", key: TabKey.Departments },
  { tab: "Rules", key: TabKey.Rules },
];

export default function GroupDetails() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useTabParam(TABS, TabKey.Overview);
  const [editOpen, setEditOpen] = useState(false);

  const { data: types = [] } = useGroupTypes();
  const groupTypeOptions = useMemo(
    () => types.map((t) => ({ label: t.name, value: t.id })),
    [types],
  );

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
      tabList={TABS}
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
          {activeTab === TabKey.Overview && <GroupOverview {...group} />}
          {activeTab === TabKey.Departments && (
            <DepartmentTab groupId={group.id} />
          )}
          {activeTab === TabKey.Rules && <RulesTab groupId={group.id} />}

          <GroupFormModal
            key={group.id}
            group={group}
            open={editOpen}
            types={groupTypeOptions}
            onCancel={() => setEditOpen(false)}
            onSuccess={handleEditSuccess}
          />
        </>
      )}
    </PageContainer>
  );
}
