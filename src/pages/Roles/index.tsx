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
import RoleFormModal from "./RoleFormModal";
import { history } from "@umijs/max";

export default function RolesPage() {
  const handleView = (record: Role) => {
    history.push(`roles/${record.id}`);
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const access = useAccess();

  const actionRef = useRef<ActionType>();
  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setModalOpen(true);
  };
  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id); // Your API function

      message.success("Role deleted successfully");

      actionRef.current?.reload();
    } catch {
      message.error("Failed to delete role");
    }
  };

  const columns = useMemo(
    () => getColumns(handleDelete, handleEdit, handleView, access),
    [access],
  );
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
            onClick={() => {
              setSelectedRole(null);
              setModalOpen(true);
            }}
          >
            Create Role
          </Button>,
        ]}
      />
      <RoleFormModal
        open={modalOpen}
        role={selectedRole} // Pass the selected role for editing, null for creating a new role
        onCancel={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
}
