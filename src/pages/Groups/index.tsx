import { PageContainer, ProTable } from "@ant-design/pro-components";
import { useMemo, useRef, useState } from "react";
import type { ActionType } from "@ant-design/pro-components";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constants/app";
import { fetchGroups, deleteGroup } from "@/services/groups";
import type { Group } from "@/types/groups";
import { getColumns } from "./columns";

import { useAccess } from "@umijs/max";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PERMISSIONS } from "../../../config/permissions";
import GroupFormModal from "./GroupFormModal";
import { useDivisions, useGroupTypes } from "@/hooks/useReferenceData";

export default function GroupsPage() {
  const [createOpen, setCreateOpen] = useState(false);

  const access = useAccess();

  const canDeleteGroup = access[PERMISSIONS.FINANCE.GROUP.DELETE];
  const handleEdit = (record: Group) => {
    // Implement your edit logic here
  };

  const actionRef = useRef<ActionType>();

  const handleDelete = async (record: Group) => {
    try {
      await deleteGroup(record.id); // Your API function

      message.success(`Group ${record.name} deleted successfully`);

      actionRef.current?.reload();
    } catch {
      message.error(`Failed to delete group ${record.name}`);
    }
  };

  const { data: types = [] } = useGroupTypes();

  const { data: divisions = [] } = useDivisions();

  const columns = useMemo(
    () => getColumns(types, divisions, handleEdit, handleDelete),
    [types, divisions, canDeleteGroup],
  );
  return (
    <PageContainer>
      <ProTable<Group>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        form={{ syncToUrl: true }}
        search={{
          labelWidth: "auto",
          searchText: "Filter",
          resetText: "Reset",
        }}
        pagination={{
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          defaultPageSize: DEFAULT_PAGE_SIZE,
          showTotal: (total) => `Total ${total} items`,
          showSizeChanger: true,
        }}
        request={async ({
          current = 1,
          pageSize = DEFAULT_PAGE_SIZE,
          group_type_ids,
          division_ids,
          search,
        }) => {
          const { data, total, success } = await fetchGroups({
            page: current,
            limit: pageSize,
            group_type_ids,
            division_ids,
            search,
          });
          return { data, total, success };
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOpen(true)}
          >
            Create Group
          </Button>,
        ]}
      />
      <GroupFormModal
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onSuccess={() => {
          setCreateOpen(false);
          actionRef.current?.reload();
        }}
        types={types}
      />
    </PageContainer>
  );
}
