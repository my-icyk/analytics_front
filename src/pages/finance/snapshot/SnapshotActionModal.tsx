import { ModalForm, ProFormTextArea } from "@ant-design/pro-components";

type Props = {
  open: boolean;
  title?: string;
  okText?: string;
  notesRequired?: boolean;
  saving?: boolean;
  onCancel: () => void;
  onSubmit: (note: string) => Promise<unknown>;
};

/** Notes-only confirmation, shared by lock, unlock and update. */
export default function SnapshotActionModal({
  open,
  title,
  okText,
  notesRequired,
  saving,
  onCancel,
  onSubmit,
}: Props) {
  return (
    <ModalForm<{ note: string }>
      title={title}
      width="min(420px, 95vw)"
      open={open}
      layout="vertical"
      modalProps={{ destroyOnHidden: true, onCancel }}
      submitter={{
        searchConfig: { submitText: okText ?? "Confirm", resetText: "Cancel" },
        submitButtonProps: { loading: saving },
        resetButtonProps: { onClick: onCancel },
      }}
      onFinish={async ({ note }) => {
        try {
          await onSubmit(note?.trim() ?? "");
          return true; // close
        } catch {
          return false; // keep open, the global handler showed the reason
        }
      }}
    >
      <ProFormTextArea
        name="note"
        label="Note"
        placeholder="Why are you doing this?"
        fieldProps={{ rows: 3, maxLength: 500, showCount: true }}
        rules={[
          {
            required: notesRequired,
            whitespace: true,
            message: "Enter a note",
          },
        ]}
      />
    </ModalForm>
  );
}
