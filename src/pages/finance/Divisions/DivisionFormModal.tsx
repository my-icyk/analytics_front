import {
  ModalForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from "@ant-design/pro-components";
import type { Division, DivisionCreate } from "@/types/divisions";
import { useCompanies } from "@/hooks/useReferenceData";

type Props = {
  open: boolean;
  initialValues?: Division; // undefined = create mode
  saving?: boolean;
  onCancel: () => void;
  onSubmit: (values: DivisionCreate) => Promise<unknown>;
};

export default function DivisionFormModal({
  open,
  initialValues,
  saving,
  onCancel,
  onSubmit,
}: Props) {
  const isEdit = !!initialValues;
  const { data: companies, loading: companiesLoading } = useCompanies();

  return (
    <ModalForm<DivisionCreate>
      title={isEdit ? "Edit division" : "Create division"}
      width="min(400px, 95vw)"
      open={open}
      layout="vertical"
      modalProps={{ destroyOnHidden: true, onCancel }}
      submitter={{
        searchConfig: {
          submitText: isEdit ? "Save" : "Create",
          resetText: "Cancel",
        },
        submitButtonProps: { loading: saving },
        resetButtonProps: { onClick: onCancel },
      }}
      initialValues={{
        name: initialValues?.name ?? "",
        company_id: initialValues?.company_id,
        is_administrative: initialValues?.is_administrative ?? false,
      }}
      onFinish={async (values) => {
        try {
          await onSubmit(values);
          return true; // close
        } catch {
          return false; // keep open, the page already showed the error
        }
      }}
    >
      <ProFormText
        name="name"
        label="Division name"
        placeholder="Enter a division name"
        rules={[{ required: true, message: "Enter a division name" }]}
      />

      <ProFormSelect
        name="company_id"
        label="Company"
        placeholder="Select a company"
        options={(companies ?? []).map((c) => ({ value: c.id, label: c.name }))}
        fieldProps={{
          loading: companiesLoading,
          showSearch: true,
          optionFilterProp: "label",
        }}
        rules={[{ required: true, message: "Select a company" }]}
      />

      <ProFormSwitch
        name="is_administrative"
        label="Administrative expenses"
        tooltip="All groups in this division collect administrative expenses and must be cost centers"
      />
    </ModalForm>
  );
}
