import {
  ModalForm,
  ProFormText,
  ProFormSwitch,
} from "@ant-design/pro-components";

import { createUser, updateUser } from "@/services/users";
import type { User, UserCreate, UserUpdate } from "@/types/user";

type Props = {
  open: boolean;
  user?: User | null;
  onCancel: () => void;
  onSuccess: () => void;
};

type FormValues = {
  username: string;
  email: string;
  name: string;
  password?: string;
  is_active?: boolean;
};

export default function UserFormModal({
  open,
  user,
  onCancel,
  onSuccess,
}: Props) {
  const isEdit = !!user;

  const handleSubmit = async (values: FormValues) => {
    if (user) {
      const payload: UserUpdate = {
        username: values.username,
        email: values.email,
        name: values.name,
        is_active: values.is_active ?? user.is_active,
      };

      await updateUser(user.id, payload);
    } else {
      const payload: UserCreate = {
        username: values.username,
        email: values.email,
        name: values.name,
        password: values.password!,
      };

      await createUser(payload);
    }

    onSuccess();
    return true;
  };

  return (
    <ModalForm<FormValues>
      key={user?.id ?? "create"}
      title={isEdit ? "Edit User" : "Create User"}
      open={open}
      onOpenChange={(visible) => {
        if (!visible) onCancel();
      }}
      onFinish={handleSubmit}
      modalProps={{
        destroyOnHidden: true,
        okText: isEdit ? "Save" : "Create",
      }}
      initialValues={
        user
          ? {
              username: user.username,
              email: user.email,
              name: user.name,
              is_active: user.is_active,
            }
          : {}
      }
      layout="vertical"
    >
      <ProFormText
        name="name"
        label="Name"
        placeholder="Enter full name"
        rules={[{ required: true, message: "Enter a name" }]}
      />

      <ProFormText
        name="username"
        label="Username"
        placeholder="Enter username"
        fieldProps={{ autoComplete: "off" }}
        rules={[
          { required: true, message: "Enter a username" },
          { min: 6, message: "At least 6 characters" },
          {
            pattern: /^[a-z0-9.-]+$/,
            message: "Only lowercase letters, numbers, dots and hyphens",
          },
        ]}
      />

      <ProFormText
        name="email"
        label="Email"
        placeholder="Enter email"
        rules={[
          { required: true, message: "Enter an email" },
          { type: "email", message: "Enter a valid email" },
        ]}
      />

      {!isEdit && (
        <ProFormText.Password
          name="password"
          label="Password"
          placeholder="Enter password"
          fieldProps={{ autoComplete: "new-password" }}
          rules={[
            { required: true, message: "Enter a password" },
            { min: 8, message: "At least 8 characters" },
          ]}
        />
      )}

      {isEdit && <ProFormSwitch name="is_active" label="Active" />}
    </ModalForm>
  );
}
