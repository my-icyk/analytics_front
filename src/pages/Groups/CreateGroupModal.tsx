import { Form, Input, Modal, Select } from "antd";
import { useCallback } from "react";
import { lookupDivisions } from "@/services/divisions";
import { createGroup, updateGroup } from "@/services/groups";
import { DebounceSelect } from "@/components/DebounceSelect";
import type { Group, GroupCreate } from "@/types/groups";

type Option = { label: string; value: number };

// The form holds the division as { label, value } because the select uses labelInValue
type FormValues = Omit<GroupCreate, "division_id"> & {
  division_id?: Option;
};

type Props = {
  types: Option[];
  open: boolean;
  group?: Group;
  onCancel: () => void;
  onSuccess: () => void;
};

const toInitialValues = (group?: Group): Partial<FormValues> | undefined =>
  group
    ? {
        name: group.name,
        division_id: group.division_id
          ? { value: group.division_id, label: group.division_name }
          : undefined,
        group_type_id: group.group_type_id,
      }
    : undefined;

export default function GroupFormModal({
  open,
  group,
  types,
  onCancel,
  onSuccess,
}: Props) {
  const [form] = Form.useForm<FormValues>();
  const isEdit = !!group;

  const loadDivisions = useCallback(
    (search: string) => lookupDivisions(search),
    [],
  );

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: GroupCreate = {
      ...values,
      division_id: values.division_id!.value,
    };

    if (group) {
      await updateGroup(group.id, payload);
    } else {
      await createGroup(payload);
    }
    onSuccess();
  };

  return (
    <Modal
      title={isEdit ? "Edit Group" : "Create Group"}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={isEdit ? "Save" : "Create"}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={toInitialValues(group)}
      >
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
