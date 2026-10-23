import { Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRequest } from "ahooks";
import dayjs from "dayjs";

import { SnapshotAction } from "@/constants/finance/snapshots";
import { getSnapshotHistory } from "@/services/finance/snapshots";
import type { SnapshotHistory } from "@/types/finance/snapshots";

const ACTION_COLORS: Record<SnapshotAction, string> = {
  [SnapshotAction.Created]: "blue",
  [SnapshotAction.Updated]: "gold",
  [SnapshotAction.Locked]: "red",
  [SnapshotAction.Unlocked]: "green",
};

const columns: ColumnsType<SnapshotHistory> = [
  {
    title: "Date",
    dataIndex: "created_at",
    width: 170,
    render: (v: string) => dayjs(v).format("DD.MM.YYYY HH:mm"),
  },
  {
    title: "Action",
    dataIndex: "action_type",
    width: 130,
    render: (v: SnapshotAction) => <Tag color={ACTION_COLORS[v]}>{v}</Tag>,
  },
  { title: "User", dataIndex: "user_name", width: 180 },
  {
    title: "Notes",
    dataIndex: "notes",
  },
];

type Props = {
  snapshotId: number;
  refreshKey: number; // bumped by the page after lock / unlock / update
};

export default function HistoryTab({ snapshotId, refreshKey }: Props) {
  const { data: history = [], loading } = useRequest(
    () => getSnapshotHistory(snapshotId),
    { refreshDeps: [snapshotId, refreshKey] },
  );

  return (
    <Table<SnapshotHistory>
      rowKey="id"
      columns={columns}
      dataSource={history}
      loading={loading}
      pagination={{ pageSize: 10, hideOnSinglePage: true }}
    />
  );
}
