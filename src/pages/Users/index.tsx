import { useMemo, useState } from "react";
import { PageContainer } from "@ant-design/pro-components";
import { useAccess } from "@umijs/max";
import { message } from "antd";

import { EntityTable } from "@/components/EntityTable";
import { useUsers } from "@/hooks/useReferenceData";
import type { User } from "@/types/user";

import UserFormModal from "./UserFormModal";
import { getColumns } from "./columns";
import { deleteUser } from "@/services/users";

export default function UsersPage() {
  const access = useAccess();
  const { data: users = [], loading, refresh } = useUsers();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleDelete = async (user: User) => {
    try {
      await deleteUser(user.id);
      message.success(`User "${user.username}" deleted`);
      await refresh();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleSuccess = () => {
    setModalOpen(false);
    setEditingUser(null);
    refresh();
  };

  const columns = useMemo(
    () => getColumns(access, handleEdit, handleDelete),
    [access, handleEdit, handleDelete],
  );

  return (
    <PageContainer>
      <EntityTable<User>
        columns={columns}
        data={users}
        loading={loading}
        createLabel="Create User"
        onCreate={handleCreate}
      />

      <UserFormModal
        open={modalOpen}
        user={editingUser}
        onCancel={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </PageContainer>
  );
}
