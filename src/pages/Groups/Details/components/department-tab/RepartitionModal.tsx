// RepartitionModal.tsx
import { useEffect, useState } from "react";
import { DatePicker, Form, Modal } from "antd";
import type { LabeledValue } from "antd/es/select";
import dayjs, { type Dayjs } from "dayjs";

import { DebounceSelect } from "@/components/DebounceSelect";
import { lookupDepartments, lookupGroups } from "@/services/groups";
import type { RepartitionCreate, RepartitionUpdate } from "@/types/departments";

const DATE_FORMAT = "YYYY-MM-DD";

/** Existing record, with labels so the selects can display names instead of ids. */
export type RepartitionInitialValues = RepartitionUpdate & {
  department_name?: string;
};

interface FormValues {
  department: LabeledValue;
  period: [Dayjs, Dayjs | null];
}

export interface RepartitionModalProps {
  open: boolean;
  initialValues?: RepartitionInitialValues;
  onCancel: () => void;
  /** Reject to keep the modal open. The caller is responsible for showing the error. */
  onSubmit: (payload: RepartitionCreate | RepartitionUpdate) => Promise<void>;
}

function toFormValues(record: RepartitionInitialValues): FormValues {
  return {
    department: {
      value: record.department_id,
      label: record.department_name ?? record.department_id,
    },
    period: [
      dayjs(record.valid_from),
      record.valid_to ? dayjs(record.valid_to) : null,
    ],
  };
}

function toPayload(values: FormValues): RepartitionCreate {
  const [from, to] = values.period;

  return {
    department_id: Number(values.department.value),
    valid_from: from.format(DATE_FORMAT),
    valid_to: to ? to.format(DATE_FORMAT) : null,
  };
}

export function RepartitionModal({
  open,
  initialValues,
  onCancel,
  onSubmit,
}: RepartitionModalProps) {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    form.resetFields(); // clear anything left from the previous open
    if (initialValues) {
      form.setFieldsValue(toFormValues(initialValues));
    }
  }, [open, initialValues, form]);

  const handleOk = async () => {
    let values: FormValues;

    try {
      values = await form.validateFields();
    } catch {
      return; // validation errors are already shown on the fields
    }

    const base = toPayload(values);

    setSubmitting(true);
    try {
      await onSubmit(initialValues ? { id: initialValues.id, ...base } : base);
    } catch {
      // The parent reports the error and rejects to keep the modal open.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={initialValues ? "Edit repartition" : "Create repartition"}
      open={open}
      okText={initialValues ? "Save" : "Create"}
      confirmLoading={submitting}
      onOk={handleOk}
      onCancel={onCancel}
      maskClosable={!submitting}
      keyboard={!submitting}
      destroyOnHidden
    >
      <Form<FormValues>
        form={form}
        layout="vertical"

        requiredMark="optional"
        disabled={submitting}
      >
        <Form.Item
          name="department"
          label="Department"
          rules={[{ required: true, message: "Select a department" }]}
        >
          <DebounceSelect
            fetchOptions={lookupDepartments}
            placeholder="Search department"
            allowClear
          />
        </Form.Item>

        <Form.Item
          name="period"
          label="Valid period"
          rules={[{ required: true, message: "Select the valid period" }]}
        >
          <DatePicker.RangePicker
            style={{ width: "100%" }}
            format={DATE_FORMAT}
            allowEmpty={[false, true]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
