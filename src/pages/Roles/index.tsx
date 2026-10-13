import { PageContainer, ProTable } from "@ant-design/pro-components";
import { useMemo, useRef, useState } from "react";
import type { ActionType } from "@ant-design/pro-components";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constants/app";
import { getRoles, deleteRole } from "@/services/roles";
import type { Role } from "@/types/auth";
import { getColumns } from "./columns";

import { useAccess } from "@umijs/max";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CreateRoleModal from "./CreateRoleMoldal";

export default function RolesPage() {
  const [createOpen, setCreateOpen] = useState(false);

  const access = useAccess();

  const canDeleteRole = access["finance:role:delete"];

  const actionRef = useRef<ActionType>();

  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id); // Your API function

      message.success("Role deleted successfully");

      actionRef.current?.reload();
    } catch {
      message.error("Failed to delete role");
    }
  };

  const columns = useMemo(() => getColumns(handleDelete), [canDeleteRole]);
  return (
    <PageContainer>
      <ProTable<Role>
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
          name,
        }) => {
          const { data, total, success } = await getRoles({
            page: current,
            limit: pageSize,
            name: name,
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
            Create Role
          </Button>,
        ]}
      />
      <CreateRoleModal
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
