
import { Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';

import type { GroupCreate } from '@/types/groups';
import { createGroup } from '@/services/groups';

type Props = {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function CreateGroupModal({
  open,
  onCancel,
  onSuccess,
}: Props) {
  const [form] = Form.useForm<GroupCreate>();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await createGroup(values);
    onSuccess();
  };

  return (
    <Modal
      title="Create Group"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Create"
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Group Name"
          rules={[{ required: true, message: 'Enter a group name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="division_id"
          label="Division"
          rules={[{ required: true, message: 'Select a division' }]}
        >
          <Select
            placeholder="Select a division"
            options={[]}
          />
        </Form.Item>

        <Form.Item
          name="group_type_id"
          label="Group Type"
          rules={[{ required: true, message: 'Select a group type' }]}
        >
          <Select
            placeholder="Select a group type"
            options={[]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
