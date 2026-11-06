import {
  getProcedures,
  deleteProcedure,
  runProcedure,
} from "@/services/analytics/procedure";
import { Procedure } from "@/types/analytics";
import { ProcedureFormModal } from "./ProcedureFormModal";

import { PageContainer } from "@ant-design/pro-components";
import { useAccess } from "@umijs/max";
import { useMemo } from "react";
import { useEntityModal } from "@/hooks/useEntityModal";
import { getColumns } from "./columns";
import { EntityTable } from "@/components/EntityTable";
import { useRequest } from "@umijs/max";
import { useDeleteEntity } from "@/hooks/useDeleteEntity";
import { useRunEntity } from "@/hooks/useRunEntity";

export default function Procedures() {
  const { can } = useAccess();
  const { data: procedures = [], loading, refresh } = useRequest(getProcedures);
  const modal = useEntityModal();

  const { run: removeProcedure } = useDeleteEntity<Procedure>({
    remove: deleteProcedure,
    entityName: "Procedure",
    label: (p) => p.name,
    onDone: refresh,
  });

  const { run: runProcedureRow, pendingIds: runningIds } =
    useRunEntity<Procedure>({
      run: runProcedure,
      entityName: "Procedure",
      label: (p) => p.name,
      onDone: refresh,
    });

  const columns = useMemo(
    () =>
      getColumns({
        can,
        onEdit: modal.openEdit,
        onDelete: removeProcedure,
        onRun: runProcedureRow,
        runningIds,
      }),
    [can, modal.openEdit, removeProcedure, runProcedureRow, runningIds],
  );

  return (
    <PageContainer>
      <EntityTable<Procedure>
        columns={columns}
        data={procedures}
        loading={loading}
        createLabel="New procedure"
        onCreate={modal.openCreate}
        onRefresh={refresh}
      />
      {modal.isOpen && (
        <ProcedureFormModal
          open
          onOpenChange={(open) => !open && modal.close()}
          id={modal.editId}
          onSuccess={refresh}
        />
      )}
    </PageContainer>
  );
}
