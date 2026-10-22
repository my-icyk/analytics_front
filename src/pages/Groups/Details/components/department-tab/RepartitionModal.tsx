import {
  ModalForm,
  ProFormDatePicker,
  ProFormDependency,
  ProFormSelect,
} from "@ant-design/pro-components";
import { useDepartments } from "@/hooks/useReferenceData";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { Repartition, RepartitionCreate } from "@/types/departments";

type Props = {
  open: boolean;
  initialValues?: Repartition; // undefined = create mode
  saving?: boolean;
  onCancel: () => void;
  onSubmit: (values: RepartitionCreate) => Promise<unknown>;
};

export function RepartitionModal({
  open,
  initialValues,
  saving,
  onCancel,
  onSubmit,
}: Props) {
  const { data: departments = [] } = useDepartments();
  return (
    <ModalForm<RepartitionCreate>
      title={initialValues ? "Edit repartition" : "Create repartition"}
      width="min(400px, 95vw)"
      open={open}
      layout="vertical"
      requiredMark="optional"
      modalProps={{ destroyOnHidden: true, onCancel }}
      submitter={{ submitButtonProps: { loading: saving } }}
      initialValues={
        initialValues
          ? {
              // labelInValue: the select shows a name instead of an id
              department: {
                value: initialValues.department_id,
                label: `${initialValues.department_name} (${initialValues.department_id})`,
              },
              valid_from: dayjs(initialValues.valid_from),
              valid_to: initialValues.valid_to
                ? dayjs(initialValues.valid_to)
                : undefined,
            }
          : {}
      }
      onFinish={async (values) => {
        try {
          await onSubmit(values);
          return true; // close
        } catch {
          return false; // keep open, the page already showed the error
        }
      }}
    >
      <ProFormSelect
        name="department"
        label="Department"
        placeholder="Search department"
        showSearch
        allowClear
        fieldProps={{
          options: departments.map((d) => ({
            value: d.id,
            label: `${d.name} (${d.id})`,
          })),
          optionFilterProp: "label", // search matches code, name and brand
        }}
        transform={(value) => ({ department_id: Number(value) })}
        rules={[{ required: true, message: "Select a department" }]}
      />

      <ProFormDatePicker
        name="valid_from"
        label="Valid from"
        width="100%"
        rules={[{ required: true, message: "Select the start date" }]}
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
