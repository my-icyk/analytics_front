// RepartitionModal.tsx
import {
  ModalForm,
  ProFormDatePicker,
  ProFormDependency,
  ProFormSelect,
} from "@ant-design/pro-components";
import type { Dayjs } from "dayjs";
import { lookupDepartments } from "@/services/groups";
import type { RepartitionCreate, RepartitionUpdate } from "@/types/departments";
import { Rule } from "antd/es/form";

/** Existing record, with the label so the select shows a name instead of an id. */
export type RepartitionInitialValues = RepartitionUpdate & {
  department_name?: string;
};

export interface RepartitionModalProps {
  open: boolean;
  initialValues?: RepartitionInitialValues;
  onCancel: () => void;
  /** Reject to keep the modal open. The caller shows the error. */
  onSubmit: (payload: RepartitionCreate | RepartitionUpdate) => Promise<void>;
}

export function RepartitionModal({
  open,
  initialValues,
  onCancel,
  onSubmit,
}: RepartitionModalProps) {
  const isEdit = !!initialValues;

  return (
    <ModalForm<RepartitionCreate>
      title={isEdit ? "Edit repartition" : "Create repartition"}
      width={400}
      open={open}
      layout="vertical"
      requiredMark="optional"
      modalProps={{ destroyOnHidden: true, onCancel }}
      submitter={{ searchConfig: { submitText: isEdit ? "Save" : "Create" } }}
      initialValues={
        initialValues && {
          ...initialValues,
          department: {
            value: initialValues.department_id,
            label: initialValues.department_name ?? initialValues.department_id,
          },
        }
      }
      onFinish={async (values) => {
        try {
          await onSubmit(isEdit ? { id: initialValues.id, ...values } : values);
          return true; // close
        } catch {
          return false; // keep open, the parent already showed the error
        }
      }}
    >
      <ProFormSelect
        name="department"
        label="Department"
        placeholder="Search department"
        showSearch
        allowClear
        debounceTime={300}
        request={({ keyWords }) => lookupDepartments(keyWords ?? "")}
        fieldProps={{ labelInValue: true }}
        // form holds { value, label }, the API gets department_id
        transform={(v) => ({ department_id: Number(v.value) })}
        rules={[{ required: true, message: "Select a department" }]}
      />

      <ProFormDatePicker
        name="valid_from"
        label="Valid from"
        width="100%"
        rules={[{ required: true, message: "Select the start date" }]}
        fieldProps={{
          format: "DD.MM.YYYY",
        }}
      />

      <ProFormDependency name={["valid_from"]}>
        {({ valid_from }: { valid_from?: Dayjs }) => (
          <ProFormDatePicker
            name="valid_to"
            label="Valid until (optional)"
            tooltip="Leave empty for no end date"
            width="100%"
            fieldProps={{
              disabledDate: (d: Dayjs) =>
                !!valid_from && d.isBefore(valid_from, "day"),
              format: "DD.MM.YYYY",
            }}
            transform={(v: string | undefined) => ({
              valid_to: v ?? null,
            })}
          />
        )}
      </ProFormDependency>
    </ModalForm>
  );
}
