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
  const { data: users = [], loading, hardRefresh } = useUsers();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleDelete = async (user: User) => {
    try {
      await deleteUser(user.id);
      message.success(`User "${user.username}" deleted`);
      await hardRefresh();
    } catch (error) {
      // Your global request error handler can display the error.
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
    hardRefresh();
  };

  const columns = useMemo(
    () => getColumns(access, handleEdit, handleDelete),
    [access],
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
