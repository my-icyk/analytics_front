import {
  ModalForm,
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormText,
} from "@ant-design/pro-components";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { Rule, RuleCreate } from "@/types/rules";

type Props = {
  open: boolean;
  initialValues?: Rule; // undefined = create mode
  onCancel: () => void;
  onSubmit: (values: RuleCreate) => Promise<void>;
};

export default function RuleFormModal({
  open,
  initialValues,
  onCancel,
  onSubmit,
}: Props) {
  return (
    <ModalForm<RuleCreate>
      title={initialValues ? "Edit Rule" : "Create Rule"}
      width="min(400px, 95vw)"
      open={open}
      modalProps={{ destroyOnClose: true, onCancel }}
      initialValues={
        initialValues
          ? {
              name: initialValues.name,
              valid_from: dayjs(initialValues.valid_from) as unknown as string,
              valid_to: initialValues.valid_to
                ? (dayjs(initialValues.valid_to) as unknown as string)
                : undefined,
              percent_value: initialValues.percent_value,
            }
          : {}
      }
      onFinish={async (values) => {
        try {
          await onSubmit(values);
          return true;
        } catch {
          return false; // page already showed the error; keep modal open
        }
      }}
    >
      <ProFormText name="name" label="Rule Name" rules={[{ required: true }]} />

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

      <ProFormDigit
        name="percent_value"
        label="Percentage"
        min={0}
        max={100}
        fieldProps={{
          precision: 2,
          step: 0.01,
        }}
        rules={[{ required: true, message: "Enter a percentage" }]}
      />
    </ModalForm>
  );
}
