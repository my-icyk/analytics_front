import { Edit3, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { usePermissions } from "../../../../auth/AuthContext";
import {
  DepartmentRepartitionCreate,
  DepartmentRepartitionUpdate,
  useDepartments,
  useRepartitionByGroup,
  useCreateRepartition,
  useUpdateRepartition,
  useDeleteRepartition,
  DepartmentRepartition,
} from "..";
import { Group } from "../../groups";
import { GroupDepartmentAllocationForm } from "../GroupDepartmentAllocationForm";
import { PERMISSIONS } from "../../../../constants/permissions";
import { Column, DataTable } from "../../../../components/DataTable";
import { TableActions } from "../../../../components/TableActions";

type GroupDeparmentSectionProps = {
  group: Group;
};

export function GroupDeparmentSection({ group }: GroupDeparmentSectionProps) {
  const { can } = usePermissions();
  const canCreate = can(PERMISSIONS.FINANCE.DEPARTMENT_REPARTITION.CREATE);
  const canEdit = can(PERMISSIONS.FINANCE.DEPARTMENT_REPARTITION.UPDATE);
  const canDelete = can(PERMISSIONS.FINANCE.DEPARTMENT_REPARTITION.DELETE);

  const { data: departments = [] } = useDepartments();
  const {
    data: repartitions = [],
    isLoading,
    isFetching,
    error,
  } = useRepartitionByGroup(group.id);
  const createRepartition = useCreateRepartition();
  const updateRepartition = useUpdateRepartition();
  const deleteRepartition = useDeleteRepartition();

  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
  const [modalError, setModalError] = useState("");
  const [editingRepartition, setEditingRepartition] = useState<any | null>(
    null,
  );
  const handleOpenCreateAllocation = () => {
    setEditingRepartition(null);
    setModalError("");
    setAllocationModalOpen(true);
  };

  const handleOpenEditAllocation = (repartition: any) => {
    setEditingRepartition(repartition);
    setModalError("");
    setAllocationModalOpen(true);
  };

  const handleCreate = async (
    groupId: number,
    payload: DepartmentRepartitionCreate,
  ) => {
    try {
      await createRepartition.mutateAsync({ groupId, payload });
      setAllocationModalOpen(false);
    } catch (err) {
      setModalError(
        err instanceof Error ? err.message : "Failed to allocate department",
      );
      throw err;
    }
  };

  const handleUpdate = async (
    groupId: number,
    repartitionId: number,
    payload: DepartmentRepartitionUpdate,
  ) => {
    try {
      await updateRepartition.mutateAsync({ groupId, repartitionId, payload });
      setAllocationModalOpen(false);
    } catch (err) {
      setModalError(
        err instanceof Error
          ? err.message
          : "Failed to update department allocation",
      );
      throw err;
    }
  };

  async function handleDelete(repartition: DepartmentRepartition) {
    const confirmed = window.confirm(
      `Are you sure you want to delete department "${repartition.department_name}"?`,
    );
    if (!confirmed) return;

    try {
      await deleteRepartition.mutateAsync({
        groupId: group.id,
        repartitionId: repartition.id,
      });
    } catch (err) {
      setModalError(
        err instanceof Error
          ? err.message
          : "Failed to delete department allocation",
      );
    }
  }

  const columns: Column<DepartmentRepartition>[] = [
    { key: "id", header: "ID", render: (g) => g.id, width: "60px" },
    {
      key: "department_name",
      header: "Name",
      render: (g) => g.department_name,
    },
    {
      key: "department_code",
      header: "Code",
      render: (g) => g.department_code,
    },
    { key: "valid_from", header: "From", render: (g) => g.valid_from },
    { key: "valid_to", header: "To", render: (g) => g.valid_to || "Ongoing" },
  ];

  return (
    <section className="detail-section">
      <div className="section-heading">
        <div>
          <h3>Allocated Departments</h3>
        </div>
        {canCreate && (
          <button
            type="button"
            className="primary-button"
            onClick={handleOpenCreateAllocation}
          >
            <Plus size={16} /> New department
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={repartitions}
        rowKey={(r) => r.id}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyText="No finance groups found."
        renderActions={(repartition) => (
          <TableActions
            onEdit={
              canEdit ? () => handleOpenEditAllocation(repartition) : undefined
            }
            onDelete={canDelete ? () => handleDelete(repartition) : undefined}
          />
        )}
      />

      {allocationModalOpen && (
        <GroupDepartmentAllocationForm
          repartition={editingRepartition}
          groupId={group.id}
          departments={departments}
          error={modalError}
          onClose={() => setAllocationModalOpen(false)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}
    </section>
  );
}
