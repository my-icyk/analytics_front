import {
  getProcedures,
  deleteProcedure,
  runProcedure,
} from "@/services/analytics/procedure";
import { Procedure } from "@/types/analytics";
import { ProcedureFormModal } from "./ProcedureFormModal";

import { PageContainer } from "@ant-design/pro-components";
import { useAccess } from "@umijs/max";
import { useMemo, useState } from "react";
import { getColumns } from "./columns";
import { EntityTable } from "@/components/EntityTable";
import { useRequest } from "@umijs/max";
import { useDeleteEntity } from "@/hooks/useDeleteEntity";
import { message } from "antd";

export default function Procedures() {
  const { can } = useAccess();
  const {
    data: procudures = [],
    loading,
    refresh,
  } = useRequest<{ data: Procedure[] }>(getProcedures);

  type ProcedureModalState =
    { mode: "create" } | { mode: "edit"; id: number } | null;

  const [modal, setModal] = useState<ProcedureModalState>(null);

  const [runningIds, setRunningIds] = useState<number[]>([]);

  const handleRun = async (procedure: Procedure) => {
    setRunningIds((ids) => [...ids, procedure.id]);
    try {
      await runProcedure(procedure.id);
      message.success(`"${procedure.name}" started`);
      refresh(); // refetch the list so last_status / last_run update
    } catch {
      message.error("Failed to start");
    } finally {
      setRunningIds((ids) => ids.filter((id) => id !== procedure.id));
    }
  };

  const { run: removeDivision } = useDeleteEntity<Procedure>({
    remove: deleteProcedure,
    entityName: "Procedure",
    label: (d) => d.name,
    onDone: refresh,
  });

  const columns = useMemo(
    () =>
      getColumns(
        can,
        (id) => removeDivision(id),
        (id) => setModal({ mode: "edit", id: Number(id) }),
        handleRun,
        runningIds,
      ),
    [can],
  );
  return (
    <PageContainer>
      <EntityTable<Procedure>
        columns={columns}
        data={procudures}
        loading={loading}
        createLabel="New procedure"
        onCreate={() => setModal({ mode: "create" })}
      />
      {modal && (
        <ProcedureFormModal
          open={modal !== null}
          onOpenChange={(open) => {
            if (!open) setModal(null);
          }}
          id={modal?.mode === "edit" ? modal.id : undefined}
          onSuccess={refresh}
        />
      )}
    </PageContainer>
  );
}
