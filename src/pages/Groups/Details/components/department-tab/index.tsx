import { useMemo } from "react";
import { message } from "antd";
import { useRequest } from "ahooks";

import { getRepartitions } from "@/services/groups";
import {
  createRepartition,
  updateRepartition,
  deleteRepartition,
} from "@/services/repartition";
import { useEditModal } from "@/hooks/useEditModal";
import { EntityTable } from "@/components/EntityTable";
import type { Repartition, RepartitionCreate } from "@/types/departments";
import { RepartitionModal } from "./RepartitionModal";
import { getColumns } from "./columns";
import { useAccess } from "@umijs/max";
import { PERMISSIONS } from "../../../../../../config/permissions";

export default function DepartmentTab({ groupId }: { groupId: number }) {
  const access = useAccess();
  const canCreate = access[PERMISSIONS.FINANCE.DEPARTMENT_REPARTITION.CREATE];
  const {
    data: repartitions = [],
    loading,
    refresh,
  } = useRequest(() => getRepartitions(groupId), {
    refreshDeps: [groupId],
    onError: () => message.error("Failed to load repartitions"),
  });

  const modal = useEditModal<Repartition>();

  const { runAsync: saveRepartition, loading: saving } = useRequest(
    (payload: RepartitionCreate) =>
      modal.record
        ? // URL targets the group the record currently belongs to (this tab's
          // group); the body carries the possibly changed group_id.
          updateRepartition(groupId, modal.record.id, payload)
        : createRepartition(groupId, payload),
    {
      manual: true,
      onSuccess: () => {
        message.success("Saved");
        modal.close();
        refresh();
      },
      onError: () => message.error("Could not save the repartition"),
    },
  );

  const { run: removeRepartition } = useRequest(
    (id: number) => deleteRepartition(groupId, id),
    {
      manual: true,
      onSuccess: () => {
        message.success("Repartition deleted");
        refresh();
      },
      onError: () => message.error("Could not delete the repartition"),
    },
  );

  const columns = useMemo(
    () => getColumns({ onEdit: modal.openEdit, onDelete: removeRepartition }),
    [modal.openEdit, removeRepartition],
  );
  return (
    <>
      <EntityTable<Repartition>
        columns={columns}
        data={repartitions}
        loading={loading}
        createLabel="New repartition"
        onCreate={canCreate ? modal.openCreate : undefined}
      />
      <RepartitionModal
        open={modal.open}
        initialValues={modal.record}
        saving={saving}
        onCancel={modal.close}
        onSubmit={saveRepartition}
      />
    </>
  );
}
