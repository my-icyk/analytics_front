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
} from "..";
import { Group } from "../../groups";
import { GroupDepartmentAllocationForm } from "../GroupDepartmentAllocationForm";
import { PERMISSIONS } from "../../../../constants/permissions";

type GroupDeparmentSectionProps = {
  group: Group;
};

export function GroupDeparmentSection({ group }: GroupDeparmentSectionProps) {
  const { can } = usePermissions();
  const canCreate = can(PERMISSIONS.FINANCE.DEPARTMENT_REPARTITION.CREATE);
  const canUpdate = can(PERMISSIONS.FINANCE.DEPARTMENT_REPARTITION.UPDATE);
  const canDelete = can(PERMISSIONS.FINANCE.DEPARTMENT_REPARTITION.DELETE);

  const { data: departments = [] } = useDepartments();
  const { data: repartitions = [] } = useRepartitionByGroup(group.id);
  const createRepartition = useCreateRepartition();
  const updateRepartition = useUpdateRepartition();
  const deleteRepartition = useDeleteRepartition();

  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
  const [modalError, setModalError] = useState("");

  const handleOpenCreateAllocation = () => {
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

      {repartitions.length === 0 ? (
        <div className="empty-state">
          No departments allocated to this group yet.
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Code</th>
                <th>From</th>
                <th>To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {repartitions.map((repartition) => (
                <tr key={repartition.id}>
                  <td>{repartition.id}</td>
                  <td>{repartition.department_name}</td>
                  <td>{repartition.department_code}</td>
                  <td>{repartition.valid_from}</td>
                  <td>
                    {repartition.valid_to || (
                      <span className="badge badge-active">Ongoing</span>
                    )}
                  </td>

                  <td>
                    <div className="table-actions">
                      {canUpdate && (
                        <button
                          type="button"
                          className="secondary-button icon-action-button"
                          title="Edit department"
                          aria-label="Edit department"
                        >
                          <Edit3 size={14} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          className="danger-button icon-action-button"
                          title="Delete department"
                          aria-label="Delete department"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {allocationModalOpen && (
        <GroupDepartmentAllocationForm
          repartition={null}
          groupId={group.id}
          departments={departments}
          error={modalError}
          onClose={() => setAllocationModalOpen(false)}
          onSubmit={handleCreate}
        />
      )}
    </section>
  );
}
