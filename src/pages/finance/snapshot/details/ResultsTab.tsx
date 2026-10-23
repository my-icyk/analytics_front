import { useMemo } from "react";
import { useAccess } from "@umijs/max";
import { Switch } from "antd";
import type { ProColumns } from "@ant-design/pro-components";
import { useRequest } from "ahooks";

import { EntityTable } from "@/components/EntityTable";

import { stringSorter } from "@/utils/sorters";
import { PERMISSIONS } from "../../../../../config/permissions";
import { Snapshot, SnapshotResult } from "@/types/finance/snapshots";
import {
  getSnapshotResults,
  setResultPosted,
} from "../../../../services/finance/snapshots";

type Props = {
  snapshot: Snapshot;
  refreshKey: number; // bumped by the page after lock / unlock / update
  onChanged: () => void; // refresh the header (posted_count)
};

export default function ResultsTab({ snapshot, refreshKey, onChanged }: Props) {
  const access = useAccess();
  // Adjust to your real permission name.
  const canPost = access[PERMISSIONS.FINANCE.SNAPSHOT.POST];
  const readOnly = snapshot.is_locked || !canPost;

  const {
    data: results = [],
    loading,
    refresh,
  } = useRequest(() => getSnapshotResults(snapshot.id), {
    refreshDeps: [snapshot.id, refreshKey],
  });

  // One row per request. The switch is controlled by the row's value, so if
  // the request fails it simply stays where it was. The error toast comes
  // from the global handler.
  const {
    run: toggle,
    loading: toggling,
    params,
  } = useRequest(
    (row: SnapshotResult, value: boolean) =>
      setResultPosted(snapshot.id, row.id, value),
    {
      manual: true,
      onSuccess: () => {
        refresh();
        onChanged();
      },
    },
  );
  const savingId = toggling ? params[0]?.id : undefined;

  const columns = useMemo<ProColumns<SnapshotResult>[]>(
    () => [
      {
        title: "Group",
        dataIndex: "group_name",
        sorter: stringSorter<SnapshotResult>("group_name"),
      },
      {
        title: "Division",
        dataIndex: "division_name",
        sorter: stringSorter<SnapshotResult>("division_name"),
      },
      {
        title: "Posted",
        dataIndex: "is_posted",
        width: 130,
        valueEnum: {
          true: { text: "Posted" },
          false: { text: "Not posted" },
        },
        render: (_, row) => (
          <Switch
            checked={row.is_posted}
            loading={savingId === row.id}
            disabled={readOnly || (toggling && savingId !== row.id)}
            onChange={(value) => toggle(row, value)}
            aria-label={`Posted: ${row.group_name}`}
          />
        ),
      },
    ],
    [readOnly, savingId, toggling, toggle],
  );

  return (
    <EntityTable<SnapshotResult>
      columns={columns}
      data={results}
      loading={loading}
    />
  );
}
