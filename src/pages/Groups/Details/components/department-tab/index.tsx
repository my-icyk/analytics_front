import { useMemo } from "react";
import { message } from "antd";
import { useRequest } from "ahooks";

import { getRepartitions } from "@/services/groups";
import {
  createRepartition,
  updateRepartition,
  deleteRepartition,
} from "@/services/repartition";
import { useLocalFilter } from "@/hooks/useLocalFilter";
import { useEditModal } from "@/hooks/useEditModal";
import { EntityTable } from "@/components/EntityTable";
import type { Repartition, RepartitionCreate } from "@/types/departments";
import { RepartitionModal } from "./RepartitionModal";
import { getColumns } from "./columns";

export default function DepartmentTab({ groupId }: { groupId: number }) {
  const {
    data: repartitions = [],
    loading,
    refresh,
  } = useRequest(() => getRepartitions(groupId), {
    refreshDeps: [groupId],
    onError: () => message.error("Failed to load repartitions"),
  });

  const { rows, setFilters, resetFilters } = useLocalFilter(repartitions);
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
        data={rows}
        loading={loading}
        createLabel="New repartition"
        onCreate={modal.openCreate}
        onFilter={setFilters}
        onReset={resetFilters}
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
