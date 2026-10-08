import { Edit3, ExternalLink, Plus, Trash2 } from "lucide-react";

import { usePermissions } from "../auth/AuthContext";
import { DepartmentRepartition } from "../features/finance/repartitions";

type GroupDeparmentSectionProps = {
  allocations: DepartmentRepartition[];
  onCreate: () => void;
  onOpen: (department: DepartmentRepartition) => void;
  onEdit: (department: DepartmentRepartition) => void;
  onDelete: (department: DepartmentRepartition) => void;
};

export function GroupDeparmentSection({
  allocations,
  onCreate,
  onOpen,
  onEdit,
  onDelete,
}: GroupDeparmentSectionProps) {
  const { can } = usePermissions();

  return (
    <div className="detail-section">
      <div className="section-heading">
        <div>
          <h3>Allocated Departments</h3>
        </div>
        {can("finance:department_repartition:create") && (
          <button type="button" className="primary-button" onClick={onCreate}>
            <Plus size={16} /> New department
          </button>
        )}
      </div>

      {allocations.length === 0 ? (
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
              {allocations.map((allocations) => (
                <tr key={allocations.id}>
                  <td>{allocations.id}</td>
                  <td>{allocations.department_name}</td>
                  <td>{allocations.department_code}</td>
                  <td>{allocations.valid_from}</td>
                  <td>
                    {allocations.valid_to || (
                      <span className="badge badge-active">Ongoing</span>
                    )}
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        className="secondary-button icon-action-button"
                        title="Manage targets"
                        aria-label="Manage targets"
                        onClick={() => onOpen(allocations)}
                      >
                        <ExternalLink size={14} />
                      </button>
                      {can("finance:department_repartition:update") && (
                        <button
                          type="button"
                          className="secondary-button icon-action-button"
                          title="Edit department"
                          aria-label="Edit department"
                          onClick={() => onEdit(allocations)}
                        >
                          <Edit3 size={14} />
                        </button>
                      )}
                      {can("finance:department_repartition:delete") && (
                        <button
                          type="button"
                          className="danger-button icon-action-button"
                          title="Delete department"
                          aria-label="Delete department"
                          onClick={() => onDelete(allocations)}
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
    </div>
  );
}
