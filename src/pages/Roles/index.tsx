import { PageContainer } from "@ant-design/pro-components";
import { history, useAccess } from "@umijs/max";
import { message } from "antd";
import { useMemo, useState } from "react";

import { EntityTable } from "@/components/EntityTable";
import { useRoles } from "@/hooks/useReferenceData";
import { deleteRole } from "@/services/roles";
import type { Role } from "@/types/auth";

import { getColumns } from "./columns";
import RoleFormModal from "./RoleFormModal";

export default function RolesPage() {
  const access = useAccess();
  const { data: roles = [], loading, refresh } = useRoles();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleView = (role: Role) => {
    history.push(`/auth/roles/${role.id}`);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id);
      message.success("Role deleted successfully");
      refresh();
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
      <EntityTable<Role>
        columns={columns}
        data={roles}
        loading={loading}
        createLabel="Create Role"
        onCreate={handleCreate}
      />

      <RoleFormModal
        open={modalOpen}
        role={selectedRole}
        onCancel={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          refresh();
        }}
      />
    </PageContainer>
  );
}
