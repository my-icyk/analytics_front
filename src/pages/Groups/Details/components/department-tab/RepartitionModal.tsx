// RepartitionModal.tsx
import { useState } from "react";
import { DatePicker, Form, Modal } from "antd";
import type { LabeledValue } from "antd/es/select";
import dayjs, { type Dayjs } from "dayjs";
import type { RepartitionCreate, RepartitionUpdate } from "@/types/departments";
import { lookupDepartments, lookupGroups } from "@/services/groups";
import { DebounceSelect } from "@/components/DebounceSelect";

const DATE_FORMAT = "YYYY-MM-DD";

/** Existing record, with labels so the selects can display names instead of ids. */
export type RepartitionInitialValues = RepartitionUpdate & {
  department_name?: string;
  group_name?: string;
};

interface FormValues {
  department: LabeledValue;
  group: LabeledValue;
  period: [Dayjs, Dayjs];
}

export interface RepartitionModalProps {
  open: boolean;
  initialValues?: RepartitionInitialValues;
  onCancel: () => void;
  /** Throw/reject to keep the modal open (e.g. on API error). */
  onSubmit: (payload: RepartitionCreate | RepartitionUpdate) => Promise<void>;
}

export function RepartitionModal({
  open,
  initialValues,
  onCancel,
  onSubmit,
}: RepartitionModalProps) {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const isEdit = initialValues !== undefined;

  const formInitialValues: Partial<FormValues> | undefined = initialValues && {
    department: {
      value: initialValues.department_id,
      label: initialValues.department_name ?? initialValues.department_id,
    },
    group: {
      value: initialValues.group_id,
      label: initialValues.group_name ?? initialValues.group_id,
    },
    period: [dayjs(initialValues.valid_from), dayjs(initialValues.valid_to)],
  };

  const handleOk = async () => {
    const values = await form.validateFields(); // rejects on validation errors
    const [from, to] = values.period;

    const base: RepartitionCreate = {
      department_id: Number(values.department.value),
      group_id: Number(values.group.value),
      valid_from: from.format(DATE_FORMAT),
      valid_to: to.format(DATE_FORMAT),
    };

    setSubmitting(true);
    try {
      await onSubmit(isEdit ? { id: initialValues.id, ...base } : base);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit repartition" : "Create repartition"}
      open={open}
      okText={isEdit ? "Save" : "Create"}
      confirmLoading={submitting}
      onOk={handleOk}
      onCancel={onCancel}
      maskClosable={!submitting}
      keyboard={!submitting}
      destroyOnHidden // form remounts on each open → always fresh initial values
    >
      <Form<FormValues>
        form={form}
        layout="vertical"
        initialValues={formInitialValues}
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
          name="group"
          label="Group"
          rules={[{ required: true, message: "Select a group" }]}
        >
          <DebounceSelect
            fetchOptions={lookupGroups}
            placeholder="Search group"
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
            allowEmpty={[false, false]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
