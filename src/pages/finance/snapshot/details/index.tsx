import { useState } from "react";
import { PageContainer } from "@ant-design/pro-components";
import { history, useAccess, useParams } from "@umijs/max";
import { Button, Result, Space, Tag } from "antd";
import { LockOutlined, SyncOutlined, UnlockOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import dayjs from "dayjs";

import { SNAPSHOT_TABS, SnapshotTabKey } from "@/constants/finance/snapshots";
import { getSnapshot } from "@/services/finance/snapshots";

import { useTabParam } from "@/hooks/useTabParam";
import { PERMISSIONS } from "../../../../../config/permissions";
import HistoryTab from "./HistoryTab";
import ResultsTab from "./ResultsTab";
import { useSnapshotAction } from "@/hooks/finance/useSnapshotAction";
import SnapshotActionModal from "@/pages/finance/snapshot/SnapshotActionModal";

export default function SnapshotDetailsPage() {
  const snapshotId = Number(useParams<{ id: string }>().id);
  const [activeTab, setActiveTab] = useTabParam(
    SNAPSHOT_TABS,
    SnapshotTabKey.Results,
  );

  const access = useAccess();
  const canLock = access[PERMISSIONS.FINANCE.SNAPSHOT.LOCK];
  const canUnlock = access[PERMISSIONS.FINANCE.SNAPSHOT.UNLOCK];
  const canUpdate = access[PERMISSIONS.FINANCE.SNAPSHOT.UPDATE];

  const {
    data: snapshot,
    loading,
    refresh,
  } = useRequest(() => getSnapshot(snapshotId), {
    ready: Number.isInteger(snapshotId),
    refreshDeps: [snapshotId],
  });

  // An action changes the header, the results and the history together.
  // Tabs stay mounted once opened, so they reload when this key changes.
  const [refreshKey, setRefreshKey] = useState(0);
  const reloadAll = () => {
    refresh();
    setRefreshKey((k) => k + 1);
  };

  const action = useSnapshotAction(reloadAll);

  if (!Number.isInteger(snapshotId)) {
    return <Result status="404" title="Snapshot not found" />;
  }

  const monthLabel = snapshot
    ? dayjs(snapshot.end_of_month).format("MMMM YYYY")
    : "Snapshot";

  const tabContent = snapshot && {
    [SnapshotTabKey.Results]: (
      <ResultsTab
        snapshot={snapshot}
        refreshKey={refreshKey}
        onChanged={refresh} // posted_count in the header
      />
    ),
    [SnapshotTabKey.History]: (
      <HistoryTab snapshotId={snapshot.id} refreshKey={refreshKey} />
    ),
  };

  return (
    <PageContainer
      title={snapshot ? monthLabel : ""}
      tags={
        snapshot && (
          <Tag color={snapshot.is_locked ? "red" : "green"}>
            {snapshot.is_locked ? "Locked" : "Open"}
          </Tag>
        )
      }
      loading={loading && !snapshot}
      onBack={() => history.push("/finance/snapshots")}

      subTitle={
        snapshot &&
        `Updated ${dayjs(snapshot.updated_at).format("DD.MM.YYYY HH:mm")}`
      }
      extra={
        snapshot && (
          <Space>
            {!snapshot.is_locked && canUpdate && (
              <Button
                icon={<SyncOutlined />}
                disabled={action.saving}
                onClick={() => action.open("update", snapshot)}
              >
                Update
              </Button>
            )}
            {!snapshot.is_locked && canLock && (
              <Button
                icon={<LockOutlined />}
                disabled={action.saving}
                onClick={() => action.open("lock", snapshot)}
              >
                Lock
              </Button>
            )}
            {snapshot.is_locked && canUnlock && (
              <Button
                icon={<UnlockOutlined />}
                disabled={action.saving}
                onClick={() => action.open("unlock", snapshot)}
              >
                Unlock
              </Button>
            )}
          </Space>
        )
      }
      tabList={SNAPSHOT_TABS}
      tabActiveKey={activeTab}
      onTabChange={setActiveTab}
    >
      {tabContent?.[activeTab]}

      <SnapshotActionModal
        open={!!action.target}
        title={action.config?.title}
        okText={action.config?.okText}
        notesRequired={action.config?.notesRequired}
        saving={action.saving}
        onCancel={action.close}
        onSubmit={action.submit}
      />
    </PageContainer>
  );
}
