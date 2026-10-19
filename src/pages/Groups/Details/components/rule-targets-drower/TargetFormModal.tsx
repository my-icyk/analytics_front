import {
  ModalForm,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
} from "@ant-design/pro-components";
import { lookupGroups } from "@/services/groups";
import type { Target, TargetCreate } from "@/types/rules";
import { ALLOCATION_OPTIONS } from "@/types/rules";
import { Typography } from "antd";

type Props = {
  open: boolean;
  initialValues?: Target; // undefined = create mode
  saving?: boolean;
  onCancel: () => void;
  onSubmit: (values: TargetCreate) => Promise<unknown>;
};

export default function TargetFormModal({
  open,
  initialValues,
  saving,
  onCancel,
  onSubmit,
}: Props) {
  return (
    <ModalForm<TargetCreate>
      title={initialValues ? "Edit target" : "Create target"}
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
              group: {
                value: initialValues.group_id,
                label: initialValues.group_name,
              },
              allocation_type: initialValues.allocation_type,
              percent_value: initialValues.percent_value,
            }
          : {}
      }
      onFinish={async ({ group_id, allocation_type, percent_value }) => {
        try {
          // Build the payload explicitly: no leftover `group` object, and
          // PROPORTIONAL always sends null even if a value was typed before.
          await onSubmit({
            group_id,
            allocation_type,
            percent_value:
              allocation_type === "PROPORTIONAL" ? null : percent_value,
          });
          return true; // close
        } catch {
          return false; // keep open, the page already showed the error
        }
      }}
    >
      <ProFormSelect
        name="group"
        label="Target group"
        placeholder="Search group"
        showSearch
        allowClear={false}
        debounceTime={300}
        request={({ keyWords }) => lookupGroups(keyWords ?? "")}
        fieldProps={{ labelInValue: true }}
        // form holds { value, label }, the API gets group_id
        transform={(v) => ({ group_id: Number(v.value) })}
        rules={[{ required: true, message: "Select a group" }]}
      />

      <ProFormSelect
        name="allocation_type"
        label="Allocation type"
        options={ALLOCATION_OPTIONS}
        allowClear={false}
        rules={[{ required: true, message: "Select an allocation type" }]}
      />

      <ProFormDependency name={["allocation_type"]}>
        {({ allocation_type }) =>
          allocation_type === "PROPORTIONAL" ? (
            <Typography.Paragraph type="secondary">
              Proportional targets have no percentage. They share whatever is
              left after the direct and static targets.
            </Typography.Paragraph>
          ) : (
            <ProFormDigit
              name="percent_value"
              label="Percentage"
              min={0}
              max={100}
              fieldProps={{ precision: 2, step: 0.01 }}
              rules={[{ required: true, message: "Enter a percentage" }]}
            />
          )
        }
      </ProFormDependency>
    </ModalForm>
  );
}
