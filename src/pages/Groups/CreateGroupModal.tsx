import { Form, Input, Modal, Select } from "antd";
import { useCallback, useEffect } from "react";
import { lookupDivisions } from "@/services/divisions";

import type { GroupCreate } from "@/types/groups";
import { createGroup } from "@/services/groups";
import { DebounceSelect } from "@/components/DebounceSelect";

type Props = {
  types: { label: string; value: number }[];
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function CreateGroupModal({
  open,
  onCancel,
  onSuccess,
  types,
}: Props) {
  const [form] = Form.useForm<GroupCreate>();

  const loadDivisions = useCallback(
    (search: string) => lookupDivisions(search),
    [],
  );

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
          rules={[{ required: true, message: "Enter a group name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="division_id"
          label="Division"
          rules={[{ required: true, message: "Select a division" }]}
          // form stores only the number...
          normalize={(option?: { value: number }) => option?.value}
          // ...while the select still receives { label, value }
          getValueProps={(id?: number) => ({
            value: id == null ? undefined : { value: id },
          })}
        >
          <DebounceSelect
            allowClear
            placeholder="Select a division"
            fetchOptions={loadDivisions}
          />
        </Form.Item>

        <Form.Item
          name="group_type_id"
          label="Group Type"
          rules={[{ required: true, message: "Select a group type" }]}
        >
          <Select placeholder="Select a group type" options={types} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
