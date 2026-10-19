import { lookupDivisions } from "@/services/divisions";
import { createGroup, updateGroup } from "@/services/groups";
import { LookupOption } from "@/types/common";
import { Group, GroupCreate } from "@/types/groups";

import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";

type Props = {
  types: LookupOption[];
  open: boolean;
  group?: Group;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function GroupFormModal({
  open,
  group,
  types,
  onCancel,
  onSuccess,
}: Props) {
  return (
    <ModalForm<GroupCreate>
      title={group ? "Edit Group" : "Create Group"}
      open={open}
      initialValues={group}
      modalProps={{ destroyOnClose: true, onCancel }}
      onFinish={async (values) => {
        await (group ? updateGroup(group.id, values) : createGroup(values));
        onSuccess();
        return true; // true = close the modal
      }}
    >
      <ProFormText
        name="name"
        label="Group Name"
        rules={[{ required: true }]}
      />

      <ProFormSelect
        name="division_id"
        label="Division"
        showSearch
        debounceTime={300}
        request={({ keyWords }) => lookupDivisions(keyWords ?? "")}
        rules={[{ required: true }]}
      />

      <ProFormSelect
        name="group_type_id"
        label="Group Type"
        options={types}
        rules={[{ required: true }]}
      />
    </ModalForm>
  );
}
