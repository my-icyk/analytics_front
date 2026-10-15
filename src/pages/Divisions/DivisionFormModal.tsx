import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

import type { Division, DivisionCreate } from "@/types/divisions";
import { createDivision, updateDivision } from "@/services/divisions";

type Props = {
  open: boolean;
  division?: Division | null; // set = edit, empty = create
  onCancel: () => void;
  onSuccess: () => void;
};

export default function DivisionFormModal({
  open,
  division,
  onCancel,
  onSuccess,
}: Props) {
  const [form] = Form.useForm<DivisionCreate>();
  const isEdit = !!division;

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (division) form.setFieldsValue(division); // prefill on edit
    }
  }, [open, division, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (division) {
      await updateDivision(division.id, values);
    } else {
      await createDivision(values);
    }
    onSuccess();
  };

  return (
    <Modal
      title={isEdit ? "Edit Division" : "Create Division"}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={isEdit ? "Save" : "Create"}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Division Name"
          rules={[{ required: true, message: "Enter a division name" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
