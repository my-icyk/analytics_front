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
import CreateGroupModal from "./CreateGroupModal";

export default function GroupsPage() {
  const [createOpen, setCreateOpen] = useState(false);

  const access = useAccess();

  const canDeleteGroup = access["finance:group:delete"];

  const actionRef = useRef<ActionType>();

  const handleDelete = async (id: number) => {
    try {
      await deleteGroup(id); // Your API function

      message.success("Group deleted successfully");

      actionRef.current?.reload();
    } catch {
      message.error("Failed to delete group");
    }
  };

  const columns = useMemo(() => getColumns(handleDelete), [canDeleteGroup]);
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
        }) => {
          const { list, total } = await fetchGroups({
            page: current,
            limit: pageSize,
            group_type_ids,
          });
          return { data: list, total, success: true };
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
      <CreateGroupModal
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onSuccess={() => {
          setCreateOpen(false);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
}
