import { ModalForm, ProFormText } from "@ant-design/pro-components";

import type { Division, DivisionCreate } from "@/types/divisions";
import { createDivision, updateDivision } from "@/services/divisions";

type Props = {
  open: boolean;
  division?: Division | null;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function DivisionFormModal({
  open,
  division,
  onCancel,
  onSuccess,
}: Props) {
  const isEdit = !!division;

  return (
    <ModalForm<DivisionCreate>
      title={isEdit ? "Edit Division" : "Create Division"}
      width={400}
      open={open}
      onOpenChange={(visible) => {
        if (!visible) onCancel();
      }}
      initialValues={{
        name: division?.name ?? "",
      }}
      modalProps={{
        destroyOnHidden: true,
        onCancel,
      }}
      submitter={{
        searchConfig: {
          submitText: isEdit ? "Save" : "Create",
          resetText: "Cancel",
        },
        resetButtonProps: {
          onClick: onCancel,
        },
      }}
      onFinish={async (values) => {
        if (division) {
          await updateDivision(division.id, values);
        } else {
          await createDivision(values);
        }

        onSuccess();
        return true;
      }}
    >
      <ProFormText
        width="md"
        name="name"
        label="Division Name"
        placeholder="Enter a division name"
        rules={[{ required: true, message: "Enter a division name" }]}
      />
    </ModalForm>
  );
}
