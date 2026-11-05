// pages/analytics/Procedures/components/ProcedureFormModal.tsx
import {
  ModalForm,
  ProFormDigit,
  ProFormSwitch,
  ProFormText,
} from "@ant-design/pro-components";
import { message } from "antd";

import type { ProcedureUpdate } from "@/types/analytics";
import {
  getProcedure,
  updateProcedure,
  createProcedure,
} from "@/services/analytics/procedure";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: number;
  onSuccess?: () => void;
};

type FormValues = Omit<ProcedureUpdate, "is_active"> & { is_active?: boolean };

export function ProcedureFormModal({
  open,
  onOpenChange,
  id,
  onSuccess,
}: Props) {
  const isEdit = id !== undefined;

  return (
    <ModalForm<FormValues>
      title={isEdit ? "Edit procedure" : "New procedure"}
      open={open}
      onOpenChange={onOpenChange}
      width={480}
      layout="vertical"
      modalProps={{ destroyOnClose: true, maskClosable: false }}
      request={isEdit ? () => getProcedure(id) : undefined}
      onFinish={async (values) => {
        if (isEdit) {
          await updateProcedure(id, values as ProcedureUpdate);
        } else {
          const { name, exec_order } = values;
          await createProcedure({ name, exec_order });
        }
        message.success(isEdit ? "Procedure updated" : "Procedure created");
        onSuccess?.();
        return true;
      }}
    >
      <ProFormText
        name="name"
        label="Name"
        placeholder="Procedure name"
        rules={[
          { required: true, whitespace: true, message: "Name is required" },
        ]}
      />

      <ProFormDigit
        name="exec_order"
        label="Execution order"
        min={0}
        fieldProps={{ precision: 0 }}
        rules={[{ required: true, message: "Execution order is required" }]}
        extra="Lower numbers run first."
      />

      {isEdit && (
        <ProFormSwitch
          name="is_active"
          label="Active"
          checkedChildren="Yes"
          unCheckedChildren="No"
        />
      )}
    </ModalForm>
  );
}
