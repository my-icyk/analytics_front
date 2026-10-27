import { useState } from "react";
import { Button, Form, Input, Modal, App, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";

import { changePassword, resetPassword } from "@/services/users";

type PasswordModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode: "change" | "reset";
  userId?: number;
};

type FormValues = {
  current_password?: string;
  new_password: string;
  confirm_password: string;
};

export default function PasswordModal({
  open,
  onClose,
  onSuccess,
  mode,
  userId,
}: PasswordModalProps) {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const isReset = mode === "reset";

  const handleSubmit = async (values: FormValues) => {
    if (isReset && userId == null) {
      message.error("User ID is required");
      return;
    }

    setLoading(true);

    try {
      if (isReset) {
        await resetPassword(userId!, {
          new_password: values.new_password,
        });
      } else {
        await changePassword({
          current_password: values.current_password!,
          new_password: values.new_password,
        });
      }

      message.success(
        isReset
          ? "Password reset successfully"
          : "Password changed successfully",
      );

      form.resetFields();
      onClose();
      onSuccess?.();
    } catch (error) {
      // Your Umi request error handler can display API errors.
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={isReset ? "Reset Password" : "Change Password"}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={440}
      centered
      afterClose={() => form.resetFields()}
    >
      <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
        {isReset
          ? "Set a new password for this user."
          : "Update your password to keep your account secure."}
      </Typography.Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        {!isReset && (
          <Form.Item
            name="current_password"
            label="Current password"
            rules={[
              {
                required: true,
                message: "Enter your current password",
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Current password"
              autoComplete="current-password"
            />
          </Form.Item>
        )}

        <Form.Item
          name="new_password"
          label="New password"
          rules={[
            {
              required: true,
              message: "Enter a new password",
            },
            {
              min: 12,
              message: "Password must contain at least 12 characters",
            },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="New password"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="confirm_password"
          label="Confirm new password"
          dependencies={["new_password"]}
          rules={[
            {
              required: true,
              message: "Confirm the new password",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="Confirm new password"
            autoComplete="new-password"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
          style={{ marginTop: 8 }}
        >
          {isReset ? "Reset Password" : "Change Password"}
        </Button>
      </Form>
    </Modal>
  );
}
