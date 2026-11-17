import { useCallback, useRef, useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType } from "@ant-design/pro-components";

import { getCreditColumns } from "./creditColumns";
import { getCredits } from "@/services/hr";
import type { PageQuery } from "@/types/api";
import type { CreditFilters, Credit } from "@/types/hr";
import CreditFormModal from "../../CreditFormModal";
import {
  CreditActionModals,
  type CreditAction,
  type CreditActionType,
} from "../../ActionModals";
import { ServerTable } from "@/components/tables/ServerTable";

export default function CreditsTab({ employee_id }: { employee_id: number }) {
  const actionRef = useRef<ActionType>();

  // Create / edit modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>();

  // Pay off / cancel / delete modals (one state for all of them)
  const [action, setAction] = useState<CreditAction | null>(null);

  const reload = () => actionRef.current?.reload();

  const openCreate = () => {
    setEditingId(undefined);
    setFormOpen(true);
  };

  const openEdit = (credit: Credit) => {
    setEditingId(credit.id);
    setFormOpen(true);
  };

  const openAction = (type: CreditActionType, credit: Credit) =>
    setAction({ type, credit });

  const columns = getCreditColumns({
    onEdit: openEdit,
    onAction: openAction,
  });

  const fetcher = useCallback(
    (params: PageQuery & CreditFilters) => getCredits(employee_id, params),
    [employee_id],
  );

  return (
    <>
      <ServerTable<Credit, CreditFilters>
        key={employee_id}
        actionRef={actionRef}
        columns={columns}
        fetcher={fetcher}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreate}
          >
            Add credit
          </Button>,
        ]}
      />

      <CreditFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        employee_id={employee_id}
        credit_id={editingId}
        onSuccess={reload}
      />

      <CreditActionModals
        employeeId={employee_id}
        action={action}
        onClose={() => setAction(null)}
        onSuccess={reload}
      />
    </>
  );
}
