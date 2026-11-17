import dayjs from "dayjs";
import { message } from "antd";
import {
  ModalForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormTextArea,
} from "@ant-design/pro-components";

import type { CreditCreate, CreditUpdate } from "@/types/hr";
import { createCredit, getCredit, updateCredit } from "@/services/hr";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credit_id?: number; // undefined => create mode
  employee_id: number;
  onSuccess?: () => void;
};

type FormValues = {
  credit_amount: number;
  nr_months: number;
  start_month: dayjs.Dayjs;
  comments?: string;
};

export default function CreditFormModal({
  open,
  onOpenChange,
  credit_id,
  employee_id,
  onSuccess,
}: Props) {
  const isEdit = credit_id !== undefined;

  return (
    <ModalForm<FormValues>
      title={isEdit ? "Edit Credit" : "Create Credit"}
      open={open}
      onOpenChange={onOpenChange}
      width={380}
      layout="vertical"
      modalProps={{ destroyOnClose: true, maskClosable: false }}
      // re-run `request` if the edited credit changes
      params={{ credit_id }}
      request={
        isEdit
          ? async () => {
              const credit = await getCredit(employee_id, credit_id);
              // map the API model to the form shape (only the form fields)
              return {
                credit_amount: Number(credit.credit_amount), // API sends a string
                nr_months: credit.nr_months,
                start_month: dayjs(credit.start_month), // picker needs dayjs
                comments: credit.comments ?? undefined,
              };
            }
          : undefined
      }
      onFinish={async (values) => {
        const payload = {
          ...values,
          // the API uses a string for the amount
          credit_amount: String(values.credit_amount),
          // ProForm may already have turned the date into a string (dateFormatter),
          // so normalize with dayjs() instead of assuming a dayjs object
          start_month: dayjs(values.start_month)
            .startOf("month")
            .format("YYYY-MM-DD"),
        };

        try {
          if (isEdit) {
            await updateCredit(employee_id, credit_id, payload as CreditUpdate);
          } else {
            await createCredit(employee_id, payload as CreditCreate);
          }
        } catch {
          message.error("Could not save the credit");
          return false; // keep the modal open on failure
        }

        message.success(isEdit ? "Credit updated" : "Credit created");
        onSuccess?.();
        return true; // closes the modal
      }}
    >
      <ProFormDigit
        name="credit_amount"
        label="Credit Amount"
        width="md"
        rules={[{ required: true, message: "Credit amount is required" }]}
        fieldProps={{ min: 0.01, step: 0.01, precision: 2 }}
      />

      <ProFormDigit
        name="nr_months"
        label="Number of Months"
        width="md"
        rules={[{ required: true, message: "Number of months is required" }]}
        fieldProps={{ min: 1, step: 1, precision: 0 }}
      />

      <ProFormDatePicker
        picker="month"
        name="start_month"
        width="md"
        label="Start Month"
        rules={[{ required: true, message: "Start month is required" }]}
      />

      <ProFormTextArea
        name="comments"
        label="Comments"
        width="md"
        rules={[
          { max: 500, message: "Comments must be at most 500 characters" },
        ]}
        fieldProps={{ rows: 3, placeholder: "Optional comments" }}
      />
    </ModalForm>
  );
}
