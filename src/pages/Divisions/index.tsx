import { PageContainer, ProTable } from "@ant-design/pro-components";
import { useMemo, useRef } from "react";
import type { ActionType } from "@ant-design/pro-components";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constants/app";
import { getDivisions, deleteDivision } from "@/services/divisions";
import type { Division } from "@/types/divisions";
import { getColumns } from "./columns";

import { useAccess } from "@umijs/max";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DivisionFormModal from "./DivisionFormModal";
import { useEditModal } from "@/hooks/useEditModal";
import { useDivisions } from "@/hooks/useReferenceData";
import { EntityTable } from "@/components/EntityTable";

export default function DivisionsPage() {
  const modal = useEditModal<Division>();
  const { data: divisions = [] } = useDivisions();

  const access = useAccess();

  const actionRef = useRef<ActionType>();

  const handleDelete = async (division: Division) => {
    try {
      await deleteDivision(division.id); // Your API function

      message.success(`Division "${division.name}" deleted successfully`);

      actionRef.current?.reload();
    } catch {
      message.error(`Failed to delete division "${division.name}"`);
    }
  };

  const columns = useMemo(
    () => getColumns(handleDelete, modal.openEdit, access),
    [access, modal.openEdit],
  );
  return (
    <PageContainer>
      <EntityTable<Division>
        columns={columns}
        data={divisions}
        loading={false}
        createLabel="New Division"
        onCreate={modal.openCreate}
      />
      <DivisionFormModal
        open={modal.open}
        division={modal.record ?? null}
        onCancel={modal.close}
        onSuccess={() => {
          modal.close();
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
}
