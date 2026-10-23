import {
  ModalForm,
  ProFormDatePicker,
  ProFormTextArea,
} from "@ant-design/pro-components";
import dayjs from "dayjs";
import type { SnapshotSave } from "@/types/finance/snapshots";

type Props = {
  open: boolean;
  saving?: boolean;
  onCancel: () => void;
  onSubmit: (values: SnapshotSave) => Promise<unknown>;
};

export default function SaveSnapshotModal({
  open,
  saving,
  onCancel,
  onSubmit,
}: Props) {
  return (
    <ModalForm<SnapshotSave>
      title="Create snapshot"
      width="min(420px, 95vw)"
      open={open}
      layout="vertical"
      modalProps={{ destroyOnHidden: true, onCancel }}
      submitter={{
        searchConfig: { submitText: "Create", resetText: "Cancel" },
        submitButtonProps: { loading: saving },
        resetButtonProps: { onClick: onCancel },
      }}
      onFinish={async ({ end_of_month }) => {
        try {
          await onSubmit({ end_of_month });
          return true;
        } catch {
          return false; // keep open, the global handler showed the reason
        }
      }}
    >
      <ProFormDatePicker.Month
        name="end_of_month"
        label="Month"
        placeholder="Select month"
        rules={[{ required: true, message: "Select a month" }]}
        // the API gets the last day of the selected month
        transform={(v: string) => ({
          end_of_month: dayjs(v).endOf("month").format("YYYY-MM-DD"),
        })}
      />
    </ModalForm>
  );
}
