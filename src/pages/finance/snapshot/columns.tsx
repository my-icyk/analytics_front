import type { ReactNode } from "react";
import { Link } from "@umijs/max";
import { Button, Tag, Tooltip } from "antd";
import { LockOutlined, SyncOutlined, UnlockOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import dayjs from "dayjs";

import { snapshotUrl } from "@/constants/finance/snapshots";
import type { SnapshotActionKey } from "@/hooks/finance/useSnapshotAction";
import type { Snapshot } from "@/types/finance/snapshots";
import { dateSorter, numberSorter } from "@/utils/sorters";

type GetColumnsParams = {
  canLock: boolean;
  canUnlock: boolean;
  canUpdate: boolean;
  busy: boolean; // one action at a time: disable the buttons while one runs
  onAction: (key: SnapshotActionKey, snapshot: Snapshot) => void;
};

function ActionButton(props: {
  title: string;
  icon: ReactNode;
  disabled: boolean;
  onClick: () => void;
  itemLabel: string;
}) {
  return (
    <Tooltip title={props.title}>
      <Button
        type="text"
        size="small"
        icon={props.icon}
        disabled={props.disabled}
        aria-label={`${props.title} ${props.itemLabel}`}
        onClick={props.onClick}
      />
    </Tooltip>
  );
}

export function getColumns({
  canLock,
  canUnlock,
  canUpdate,
  busy,
  onAction,
}: GetColumnsParams): ProColumns<Snapshot>[] {
  return [
    {
      title: "Month",
      dataIndex: "end_of_month",
      search: false,
      sorter: dateSorter<Snapshot>("end_of_month"),
      defaultSortOrder: "descend",
      render: (_, s) => (
        <Link to={snapshotUrl(s.id)}>
          {dayjs(s.end_of_month).format("MMMM YYYY")}
        </Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_locked",
      width: 120,
      valueEnum: {
        true: { text: "Locked", status: "Error" },
        false: { text: "Open", status: "Success" },
      },
      render: (_, s) =>
        s.is_locked ? (
          <Tag color="red">Locked</Tag>
        ) : (
          <Tag color="green">Open</Tag>
        ),
    },
    {
      title: "Groups posted",
      dataIndex: "posted_count",
      search: false,
      align: "right",
      sorter: numberSorter<Snapshot>("posted_count"),
      render: (_, s) => (
        <Link to={snapshotUrl(s.id)}>
          {s.posted_count} / {s.groups_count}
        </Link>
      ),
    },
    {
      title: "Updated",
      dataIndex: "updated_at",
      search: false,
      sorter: dateSorter<Snapshot>("updated_at"),
      render: (_, s) => dayjs(s.updated_at).format("DD.MM.YYYY HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      valueType: "option",
      width: 120,
      align: "right",
      fixed: "right",
      render: (_, s) => {
        const label = dayjs(s.end_of_month).format("MMMM YYYY");
        return [
          // open snapshot: update or lock
          !s.is_locked && canUpdate && (
            <ActionButton
              key="update"
              title="Update"
              icon={<SyncOutlined />}
              itemLabel={label}
              disabled={busy}
              onClick={() => onAction("update", s)}
            />
          ),
          !s.is_locked && canLock && (
            <ActionButton
              key="lock"
              title="Lock"
              icon={<LockOutlined />}
              itemLabel={label}
              disabled={busy}
              onClick={() => onAction("lock", s)}
            />
          ),
          // locked snapshot: only unlock
          s.is_locked && canUnlock && (
            <ActionButton
              key="unlock"
              title="Unlock"
              icon={<UnlockOutlined />}
              itemLabel={label}
              disabled={busy}
              onClick={() => onAction("unlock", s)}
            />
          ),
        ];
      },
    },
  ];
}
