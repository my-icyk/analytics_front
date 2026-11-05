import { FOLDER_TYPE_ID } from "@/constants/groups";
import {
  useDivisions,
  useGroupTypes,
  useFolderGroups,
} from "@/hooks/useReferenceData";
import { createGroup, updateGroup } from "@/services/groups";
import { Group, GroupCreate } from "@/types/groups";

import {
  ModalForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";

type Props = {
  open: boolean;
  group?: Group;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function GroupFormModal({
  open,
  group,
  onCancel,
  onSuccess,
}: Props) {
  const { data: divisions = [] } = useDivisions();
  const { data: types = [] } = useGroupTypes();
  const { data: folders = [] } = useFolderGroups();

  return (
    <ModalForm<GroupCreate>
      title={group ? "Edit Group" : "Create Group"}
      open={open}
      initialValues={group}
      modalProps={{ destroyOnHidden: true, onCancel }}
      onFinish={async (values) => {
        // an empty select gives undefined, which JSON drops, so the backend never clears the parent
        const payload = { ...values, parent_id: values.parent_id ?? null };
        await (group ? updateGroup(group.id, payload) : createGroup(payload));
        onSuccess();
        return true;
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
        options={divisions}
        fieldProps={{ fieldNames: { label: "name", value: "id" } }}
        rules={[{ required: true }]}
      />

      <ProFormSelect
        name="group_type_id"
        label="Group Type"
        options={types}
        fieldProps={{
          fieldNames: { label: "name", value: "id" },
        }}
        rules={[{ required: true }]}
      />

      <ProFormDependency name={["group_type_id"]}>
        {({ group_type_id }) =>
          group_type_id === FOLDER_TYPE_ID ? null : (
            <ProFormSelect
              name="parent_id"
              label="Parent folder"
              placeholder="No parent"
              showSearch
              options={folders.filter((f) => f.id !== group?.id)}
              fieldProps={{
                allowClear: true,
                fieldNames: { label: "name", value: "id" },
                optionFilterProp: "name",
              }}
            />
          )
        }
      </ProFormDependency>
    </ModalForm>
  );
}
