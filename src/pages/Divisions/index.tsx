import { useMemo } from "react";
import { PageContainer } from "@ant-design/pro-components";
import { useAccess } from "@umijs/max";
import { useDeleteEntity } from "@/hooks/useDeleteEntity";

import {
  createDivision,
  updateDivision,
  deleteDivision,
} from "@/services/divisions";
import { useDivisions } from "@/hooks/useReferenceData";
import { useEditModal } from "@/hooks/useEditModal";
import { useSaveEntity } from "@/hooks/useSaveEntity";
import { EntityTable } from "@/components/EntityTable";
import type { Division } from "@/types/divisions";
import DivisionFormModal from "./DivisionFormModal";
import { getColumns } from "./columns";
import { PERMISSIONS } from "../../../config/permissions";

export default function DivisionsPage() {
  const access = useAccess();
  const canCreate = access[PERMISSIONS.FINANCE.DIVISION.CREATE];
  const modal = useEditModal<Division>();
  const { data: divisions = [], loading, hardRefresh } = useDivisions();

  const { run: removeDivision } = useDeleteEntity<Division>({
    remove: deleteDivision,
    entityName: "Division",
    label: (d) => d.name,
    onDone: hardRefresh,
  });

  const { runAsync: saveDivision, loading: saving } = useSaveEntity({
    record: modal.record,
    create: createDivision,
    update: updateDivision,
    entityName: "Division",
    onDone: () => {
      modal.close();
      hardRefresh();
    },
  });

  const columns = useMemo(
    () => getColumns(removeDivision, modal.openEdit, access),
    [removeDivision, modal.openEdit, access],
  );

  return (
    <PageContainer>
      <EntityTable<Division>
        columns={columns}
        data={divisions}
        loading={loading}
        createLabel="New division"
        onCreate={canCreate ? modal.openCreate : undefined}
      />
      <DivisionFormModal
        open={modal.open}
        initialValues={modal.record}
        saving={saving}
        onCancel={modal.close}
        onSubmit={saveDivision}
      />
    </PageContainer>
  );
}
