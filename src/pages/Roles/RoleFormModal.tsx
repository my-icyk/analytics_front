import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

import type { RoleListItem, RoleCreate } from "@/types/auth";
import { createRole, updateRole } from "@/services/roles";

type Props = {
  open: boolean;
  role?: RoleListItem | null; // set = edit, empty = create
  onCancel: () => void;
  onSuccess: () => void;
};

export default function RoleFormModal({
  open,
  role,
  onCancel,
  onSuccess,
}: Props) {
  const [form] = Form.useForm<RoleCreate>();
  const isEdit = !!role;

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (role) form.setFieldsValue(role); // prefill on edit
    }
  }, [open, role, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (role) {
      await updateRole(role.id, values);
    } else {
      await createRole(values);
    }
    onSuccess();
  };

  return (
    <Modal
      title={isEdit ? "Edit Role" : "Create Role"}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={isEdit ? "Save" : "Create"}
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
        <Form.Item name="description" label="Role Description">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
