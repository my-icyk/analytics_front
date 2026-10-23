import { useMemo, useState } from "react";
import { PageContainer } from "@ant-design/pro-components";
import { useAccess } from "@umijs/max";
import { message } from "antd";
import { useRequest } from "ahooks";

import { getSnapshots, saveSnapshot } from "@/services/finance/snapshots";

import { EntityTable } from "@/components/EntityTable";
import type { Snapshot } from "@/types/finance/snapshots";
import { PERMISSIONS } from "../../../../config/permissions";
import { useSnapshotAction } from "@/hooks/finance/useSnapshotAction";
import { getColumns } from "./columns";
import SaveSnapshotModal from "./SaveSnapshotModal";
import SnapshotActionModal from "./SnapshotActionModal";

export default function SnapshotsPage() {
  const access = useAccess();
  // Adjust to your real permission names.
  const canSave = access[PERMISSIONS.FINANCE.SNAPSHOT.SAVE];
  const canLock = access[PERMISSIONS.FINANCE.SNAPSHOT.LOCK];
  const canUnlock = access[PERMISSIONS.FINANCE.SNAPSHOT.UNLOCK];
  const canUpdate = access[PERMISSIONS.FINANCE.SNAPSHOT.UPDATE];

  const { data: snapshots = [], loading, refresh } = useRequest(getSnapshots);

  // save (create the snapshot for a month)
  const [saveOpen, setSaveOpen] = useState(false);
  const { runAsync: save, loading: saving } = useRequest(saveSnapshot, {
    manual: true,
    onSuccess: () => {
      message.success("Snapshot saved");
      setSaveOpen(false);
      refresh();
    },
  });

  // lock / unlock / update
  const action = useSnapshotAction(refresh);

  const columns = useMemo(
    () =>
      getColumns({
        canLock,
        canUnlock,
        canUpdate,
        busy: action.saving,
        onAction: action.open,
      }),
    [canLock, canUnlock, canUpdate, action.saving, action.open],
  );

  return (
    <PageContainer>
      <EntityTable<Snapshot>
        columns={columns}
        data={snapshots}
        loading={loading}
        createLabel="New snapshot"
        onCreate={canSave ? () => setSaveOpen(true) : undefined}
      />

      <SaveSnapshotModal
        open={saveOpen}
        saving={saving}
        onCancel={() => setSaveOpen(false)}
        onSubmit={save}
      />

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
