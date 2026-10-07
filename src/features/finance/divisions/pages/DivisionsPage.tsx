import { useMemo, useState } from "react";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import {
  useCreateDivision,
  useDivisions,
  useRemoveDivision,
  useUpdateDivision,
  type Division,
  type DivisionCreate,
} from "..";
import { DivisionFormModal } from "../../../../components/finance/DivisionFormModal";
import { usePermissions } from "../../../../auth/AuthContext";

type DivisionsPageProps = {};

export function DivisionsPage({}: DivisionsPageProps) {
  const { can } = usePermissions();
  const { data: divisions = [], isLoading, error: loadError } = useDivisions();
  const createDivision = useCreateDivision();
  const updateDivision = useUpdateDivision();
  const removeDivision = useRemoveDivision();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [modalError, setModalError] = useState("");
  const [pageError, setPageError] = useState("");

  const visibleDivisions = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return divisions;
    return divisions.filter((division) =>
      division.name.toLowerCase().includes(term),
    );
  }, [divisions, search]);

  const handleOpenCreate = () => {
    setEditingDivision(null);
    setModalError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (division: Division) => {
    setEditingDivision(division);
    setModalError("");
    setModalOpen(true);
  };

  const handleSaveDivision = async (payload: DivisionCreate) => {
    try {
      if (editingDivision) {
        await updateDivision.mutateAsync({
          id: editingDivision.id,
          data: payload,
        });
      } else {
        await createDivision.mutateAsync(payload);
      }
      setModalOpen(false);
    } catch (err) {
      setModalError(
        err instanceof Error ? err.message : "Failed to save division",
      );
      throw err;
    }
  };

  const handleDelete = async (division: Division) => {
    if (
      !window.confirm(
        `Are you sure you want to delete division "${division.name}"?`,
      )
    )
      return;
    try {
      await removeDivision.mutateAsync(division.id);
      setPageError("");
    } catch (err) {
      setPageError(
        err instanceof Error ? err.message : "Failed to delete division",
      );
    }
  };

  const displayError =
    pageError || (loadError instanceof Error ? loadError.message : "");

  return (
    <section className="management-panel">
      <div className="section-heading">
        <div>
          <h2>Finance Divisions</h2>
          <p>Manage the divisions available for group assignment.</p>
        </div>
        {can("finance:division:create") && (
          <button className="primary-button" onClick={handleOpenCreate}>
            <Plus size={17} /> New division
          </button>
        )}
      </div>

      {displayError && <p className="auth-error">{displayError}</p>}

      <div className="slicers-bar">
        <div className="search-box">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search divisions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Division Name</th>
              <th style={{ width: "120px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleDivisions.map((division) => (
              <tr key={division.id}>
                <td>{division.id}</td>
                <td>
                  <strong>{division.name}</strong>
                </td>
                <td>
                  <div className="table-actions">
                    {can("finance:division:update") && (
                      <button
                        className="secondary-button icon-action-button"
                        title="Edit division"
                        aria-label="Edit division"
                        onClick={() => handleOpenEdit(division)}
                      >
                        <Edit3 size={14} />
                      </button>
                    )}
                    {can("finance:division:delete") && (
                      <button
                        className="danger-button icon-action-button"
                        title="Delete division"
                        aria-label="Delete division"
                        onClick={() => void handleDelete(division)}
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
        {isLoading && (
          <div className="empty-state">Loading divisions from server...</div>
        )}
        {!isLoading && visibleDivisions.length === 0 && (
          <div className="empty-state">
            {divisions.length === 0
              ? "No divisions found."
              : "No divisions matching search."}
          </div>
        )}
      </div>

      {modalOpen && (
        <DivisionFormModal
          division={editingDivision}
          error={modalError}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSaveDivision}
        />
      )}
    </section>
  );
}
