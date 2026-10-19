import { createRule, updateRule } from "@/services/groups";
import type { Rule, RuleUpdate, RuleCreate } from "@/types/rules";
import {
  ProFormDatePicker,
  ProFormDependency,
  ProFormText,
  ProFormDigit,
} from "@ant-design/pro-components";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { ModalForm } from "@ant-design/pro-components";

type Props = {
  groupId: number;
  rule?: Rule;
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function RuleFormModal({
  groupId,
  rule,
  open,
  onCancel,
  onSuccess,
}: Props) {
  return (
    <ModalForm<RuleCreate>
      title={rule ? "Edit Rule" : "Create Rule"}
      width="min(400px, 95vw)"
      open={open}
      modalProps={{ destroyOnClose: true, onCancel }}
      onFinish={async (values) => {
        await (rule
          ? updateRule(groupId, rule.id, values)
          : createRule(groupId, values));
        onSuccess();
        return true;
      }}
      initialValues={
        rule
          ? {
              name: rule.name,
              valid_from: rule.valid_from,
              valid_to: rule.valid_to ? dayjs(rule.valid_to) : undefined,
            }
          : {}
      }
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
