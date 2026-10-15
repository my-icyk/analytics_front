import { Form, Input, Modal, Switch } from "antd";
import { useEffect, useState } from "react";

import { createUser, updateUser } from "@/services/users";
import type { User, UserCreate, UserUpdate } from "@/types/user";

type Props = {
  open: boolean;
  user?: User | null; // set = edit, empty = create
  onCancel: () => void;
  onSuccess: () => void;
};

type FormValues = {
  username: string;
  email: string;
  name: string;
  password?: string;
  is_active: boolean;
};

export default function UserFormModal({
  open,
  user,
  onCancel,
  onSuccess,
}: Props) {
  const [form] = Form.useForm<FormValues>();
  const [saving, setSaving] = useState(false);
  const isEdit = !!user;

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        name: user.name,
        is_active: user.is_active,
      }); // password is never prefilled
    }
  }, [open, user, form]);

  const handleSubmit = async () => {
    const { password, is_active, ...rest } = await form.validateFields();
    setSaving(true);
    try {
      if (user) {
        await updateUser(user.id, { ...rest, is_active });
      } else {
        await createUser({ ...rest, password: password! });
      }
      onSuccess();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit User" : "Create User"}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={isEdit ? "Save" : "Create"}
      confirmLoading={saving}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Enter a name" }]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: "Enter a username" },
            {
              min: 6,
              message: "Username must contain at least 6 characters.",
            },
            {
              pattern: /^[a-z0-9.-]+$/,
              message:
                "Use only lowercase letters, numbers, dots (.) and hyphens (-). No spaces allowed.",
            },
          ]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: false, message: "Enter an email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        {!isEdit && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Enter a password" },
              { min: 8, message: "At least 8 characters" },
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        )}
        {isEdit && (
          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
