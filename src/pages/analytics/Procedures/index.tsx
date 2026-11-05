import { getProcedures, deleteProcedure } from "@/services/analytics/procedure";
import { Procedure } from "@/types/analytics";
import { ProcedureFormModal } from "./ProcedureFormModal";

import { ActionType, PageContainer } from "@ant-design/pro-components";
import { useAccess } from "@umijs/max";
import { useMemo, useRef, useState } from "react";
import { getColumns } from "./columns";
import { EntityTable } from "@/components/EntityTable";
import { useRequest } from "@umijs/max";
import { useDeleteEntity } from "@/hooks/useDeleteEntity";

export default function Procedures() {
  type ProcedureModalState =
    { mode: "create" } | { mode: "edit"; id: number } | null;

  // Inside your Procedures page
  const actionRef = useRef<ActionType>(null);
  const [modal, setModal] = useState<ProcedureModalState>(null);

  const {
    data: procudures = [],
    loading,
    refresh,
  } = useRequest<{ data: Procedure[] }>(getProcedures);
  const access = useAccess();

  const { run: removeDivision } = useDeleteEntity<Procedure>({
    remove: deleteProcedure,
    entityName: "Procedure",
    label: (d) => d.name,
    onDone: refresh,
  });

  const columns = useMemo(
    () =>
      getColumns(
        access,
        (id) => removeDivision(id),
        (id) => setModal({ mode: "edit", id: Number(id) }),
      ),
    [access],
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
