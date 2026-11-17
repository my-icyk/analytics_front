import { useRequest } from "@umijs/max";
import { DatePicker, Form, Input, Modal, Typography, message } from "antd";
import type { Dayjs } from "dayjs";
import type { ReactNode } from "react";

import { cancelCredit, deleteCredit, payOffCredit } from "@/services/hr";
import type { Credit } from "@/types/hr";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type CreditActionType = "payoff" | "cancel" | "delete";

export type CreditAction = {
  type: CreditActionType;
  credit: Credit;
};

type ActionModalProps = {
  open: boolean;
  employeeId: number;
  credit?: Credit | null;
  onSuccess: () => void;
  onCancel: () => void;
};

/* ------------------------------------------------------------------ */
/* Base modal: owns loading, validation, success message, reset        */
/* ------------------------------------------------------------------ */

type BaseProps<V extends object> = ActionModalProps & {
  title: string;
  successMessage: string;
  okText?: string;
  okDanger?: boolean;
  submit: (credit: Credit, values: V) => Promise<unknown>;
  children: ReactNode;
};

function BaseCreditActionModal<V extends object>({
  open,
  credit,
  title,
  successMessage,
  okText,
  okDanger,
  submit,
  children,
  onSuccess,
  onCancel,
}: BaseProps<V>) {
  const [form] = Form.useForm<V>();

  const { loading, run } = useRequest(
    (values: V) => submit(credit as Credit, values),
    {
      manual: true,
      onSuccess: () => {
        message.success(successMessage);
        form.resetFields();
        onSuccess();
      },
    },
  );

  const handleOk = () => {
    if (!credit) return;
    form
      .validateFields()
      .then(run)
      .catch(() => {
        /* validation errors are shown by the form itself */
      });
  };

  return (
    <Modal
      title={title}
      open={open}
      okText={okText}
      okButtonProps={{ danger: okDanger }}
      confirmLoading={loading}
      destroyOnClose
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" preserve={false}>
        {children}
      </Form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Individual actions                                                  */
/* ------------------------------------------------------------------ */

export function PayOffModal({ employeeId, ...props }: ActionModalProps) {
  return (
    <BaseCreditActionModal<{ paid_off_on?: Dayjs }>
      {...props}
      employeeId={employeeId}
      title="Pay Off Credit"
      okText="Pay off"
      successMessage="Credit paid off successfully"
      submit={(credit, values) =>
        payOffCredit(employeeId, credit.id, {
          paid_off_on: values.paid_off_on?.format("YYYY-MM-DD"),
        })
      }
    >
      <Form.Item
        name="paid_off_on"
        label="Payment Date (Optional)"
        tooltip="Leave empty to use today's date"
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>
    </BaseCreditActionModal>
  );
}

export function CancelCreditModal({ employeeId, ...props }: ActionModalProps) {
  return (
    <BaseCreditActionModal<{ reason?: string }>
      {...props}
      employeeId={employeeId}
      title="Cancel Credit"
      okText="Cancel credit"
      okDanger
      successMessage="Credit cancelled successfully"
      submit={(credit, values) =>
        cancelCredit(employeeId, credit.id, {
          reason: values.reason || undefined,
        })
      }
    >
      <Form.Item name="reason" label="Cancellation Reason (Optional)">
        <Input.TextArea
          rows={3}
          placeholder="Why is this credit being cancelled?"
        />
      </Form.Item>
    </BaseCreditActionModal>
  );
}

export function DeleteCreditModal({ employeeId, ...props }: ActionModalProps) {
  return (
    <BaseCreditActionModal<Record<string, never>>
      {...props}
      employeeId={employeeId}
      title="Delete Credit"
      okText="Delete"
      okDanger
      successMessage="Credit deleted successfully"
      submit={(credit) => deleteCredit(employeeId, credit.id)}
    >
      <Typography.Text>
        This permanently removes the credit. This cannot be undone.
      </Typography.Text>
    </BaseCreditActionModal>
  );
}

/* ------------------------------------------------------------------ */
/* Single entry point used by the page                                 */
/* ------------------------------------------------------------------ */

type CreditActionModalsProps = {
  employeeId: number;
  action: CreditAction | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function CreditActionModals({
  employeeId,
  action,
  onClose,
  onSuccess,
}: CreditActionModalsProps) {
  const common = {
    employeeId,
    credit: action?.credit,
    onCancel: onClose,
    onSuccess: () => {
      onClose();
      onSuccess();
    },
  };

  return (
    <>
      <PayOffModal {...common} open={action?.type === "payoff"} />
      <CancelCreditModal {...common} open={action?.type === "cancel"} />
      <DeleteCreditModal {...common} open={action?.type === "delete"} />
    </>
  );
}
