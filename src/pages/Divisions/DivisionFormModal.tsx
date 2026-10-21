import { ModalForm, ProFormText } from "@ant-design/pro-components";
import type { Division, DivisionCreate } from "@/types/divisions";

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
      initialValues={{ name: initialValues?.name ?? "" }}
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
    </ModalForm>
  );
}
