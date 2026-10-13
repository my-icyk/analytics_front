import { Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";

import type { RoleCreate } from "@/types/auth";
import { createRole } from "@/services/roles";

type Props = {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function CreateRoleModal({ open, onCancel, onSuccess }: Props) {
  const [form] = Form.useForm<RoleCreate>();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await createRole(values);
    onSuccess();
  };

  return (
    <Modal
      title="Create Role"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Create"
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Role Name"
          rules={[{ required: true, message: "Enter a role name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Role Description"
          rules={[{ required: false, message: "Enter a role description" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
