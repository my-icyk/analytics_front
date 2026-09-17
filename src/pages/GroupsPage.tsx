import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Edit3,
  ExternalLink,
  FilterX,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import type {
  Division,
  Group,
  GroupCreate,
  GroupFilterParams,
  GroupType,
} from "../types/finance";
import { GroupFormModal } from "../components/finance/GroupFormModal";
import { Slicer, type SlicerOption } from "../components/common/Slicer";

type GroupsPageProps = {
  groups: Group[];
  divisions: Division[];
  groupTypes: GroupType[];
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onOpenGroup: (group: Group) => void;
  onCreateGroup: (payload: GroupCreate) => Promise<void>;
  onUpdateGroup: (groupId: number, payload: GroupCreate) => Promise<void>;
  onDeleteGroup: (group: Group) => Promise<void>;
  onFilterChange?: (filters: GroupFilterParams) => Promise<Group[]> | void;
  error: string;
};

export function GroupsPage({
  groups: initialGroups,
  divisions,
  groupTypes,
  canCreate,
  canEdit,
  canDelete,
  onOpenGroup,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
  onFilterChange,
  error,
}: GroupsPageProps) {
  const [displayedGroups, setDisplayedGroups] =
    useState<Group[]>(initialGroups);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedGroupIds, setSelectedGroupIds] = useState<(string | number)[]>(
    [],
  );
  const [selectedDivisionIds, setSelectedDivisionIds] = useState<
    (string | number)[]
  >([]);
  const [selectedGroupTypeIds, setSelectedGroupTypeIds] = useState<
    (string | number)[]
  >([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [modalError, setModalError] = useState("");

  const isMountedRef = useRef(false);

  // Sync displayed groups if initialGroups changes from parent
  useEffect(() => {
    if (!onFilterChange) {
      setDisplayedGroups(initialGroups);
    }
  }, [initialGroups, onFilterChange]);

  // Execute server-side filter request when filter props change
  const fetchFilteredGroups = useCallback(async () => {
    if (!onFilterChange) return;
    setLoading(true);
    setLocalError("");
    try {
      const filters: GroupFilterParams = {};
      if (selectedGroupIds.length > 0) {
        filters.id = selectedGroupIds.map((v) => Number(v));
      }
      if (selectedDivisionIds.length > 0) {
        filters.division_id = selectedDivisionIds.map((v) => Number(v));
      }
      if (selectedGroupTypeIds.length > 0) {
        filters.group_type_id = selectedGroupTypeIds.map((v) => Number(v));
      }
      if (search.trim()) {
        filters.search = search.trim();
      }

      const result = await onFilterChange(filters);
      if (result) {
        setDisplayedGroups(result);
      }
    } catch (err) {
      setLocalError(
        err instanceof Error
          ? err.message
          : "Failed to filter groups from server",
      );
    } finally {
      setLoading(false);
    }
  }, [
    onFilterChange,
    selectedGroupIds,
    selectedDivisionIds,
    selectedGroupTypeIds,
    search,
  ]);

  // Trigger server-side fetching with debounce for search
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    if (!onFilterChange) return;

    const timer = setTimeout(() => {
      void fetchFilteredGroups();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchFilteredGroups, onFilterChange]);

  const divisionOptions: SlicerOption[] = useMemo(() => {
    return divisions.map((d) => ({
      id: d.id,
      label: d.name,
      badge: initialGroups.filter((g) => g.division?.id === d.id).length,
    }));
  }, [divisions, initialGroups]);

  const groupTypeOptions: SlicerOption[] = useMemo(() => {
    return groupTypes.map((gt) => ({
      id: gt.id,
      label: gt.name,
      badge: initialGroups.filter((g) => g.group_type?.id === gt.id).length,
    }));
  }, [groupTypes, initialGroups]);

  const groupOptions: SlicerOption[] = useMemo(() => {
    return initialGroups.map((g) => ({
      id: g.id,
      label: g.name,
      subLabel: `${g.division?.name ?? "—"} · ${g.group_type?.name ?? "—"}`,
    }));
  }, [initialGroups]);

  const hasAnyFilter =
    Boolean(search) ||
    selectedGroupIds.length > 0 ||
    selectedDivisionIds.length > 0 ||
    selectedGroupTypeIds.length > 0;

  const handleClearAllFilters = () => {
    setSearch("");
    setSelectedGroupIds([]);
    setSelectedDivisionIds([]);
    setSelectedGroupTypeIds([]);
  };

  // Fallback client-side filtering if onFilterChange is not passed
  const visibleGroups = useMemo(() => {
    if (onFilterChange) {
      return displayedGroups;
    }
    return initialGroups.filter((g) => {
      if (selectedGroupIds.length > 0 && !selectedGroupIds.includes(g.id)) {
        return false;
      }
      if (
        selectedDivisionIds.length > 0 &&
        (!g.division || !selectedDivisionIds.includes(g.division.id))
      ) {
        return false;
      }
      if (
        selectedGroupTypeIds.length > 0 &&
        (!g.group_type || !selectedGroupTypeIds.includes(g.group_type.id))
      ) {
        return false;
      }
      if (search) {
        const q = search.toLowerCase().trim();
        const matches =
          g.name.toLowerCase().includes(q) ||
          g.division?.name?.toLowerCase().includes(q) ||
          g.group_type?.name?.toLowerCase().includes(q) ||
          String(g.id).includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [
    onFilterChange,
    displayedGroups,
    initialGroups,
    selectedGroupIds,
    selectedDivisionIds,
    selectedGroupTypeIds,
    search,
  ]);

  const handleOpenCreate = () => {
    setEditingGroup(null);
    setModalError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (group: Group) => {
    setEditingGroup(group);
    setModalError("");
    setModalOpen(true);
  };

  const handleSaveGroup = async (payload: GroupCreate) => {
    try {
      if (editingGroup) {
        await onUpdateGroup(editingGroup.id, payload);
      } else {
        await onCreateGroup(payload);
      }
      setModalOpen(false);
      if (onFilterChange) {
        void fetchFilteredGroups();
      }
    } catch (err) {
      setModalError(
        err instanceof Error ? err.message : "Failed to save group",
      );
      throw err;
    }
  };

  const handleDelete = async (group: Group) => {
    if (
      window.confirm(`Are you sure you want to delete group "${group.name}"?`)
    ) {
      await onDeleteGroup(group);
      if (onFilterChange) {
        void fetchFilteredGroups();
      }
    }
  };

  const displayError = error || localError;

  return (
    <section className="management-panel">
      <div className="section-heading">
        <div>
          <h2>Finance Groups</h2>
          <p>
            Configure business groups, divisional alignment, and cost centers.
          </p>
        </div>
        {canCreate && (
          <button className="primary-button" onClick={handleOpenCreate}>
            <Plus size={17} /> New group
          </button>
        )}
      </div>

      {displayError && <p className="auth-error">{displayError}</p>}

      <div className="slicers-bar">
        <div className="search-box">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="slicers-group">
          <Slicer
            title="Group"
            options={groupOptions}
            selectedValues={selectedGroupIds}
            onChange={setSelectedGroupIds}
            multiSelect={true}
            placeholder="All groups"
            searchPlaceholder="Filter groups..."
          />

          <Slicer
            title="Division"
            options={divisionOptions}
            selectedValues={selectedDivisionIds}
            onChange={setSelectedDivisionIds}
            multiSelect={true}
            placeholder="All divisions"
            searchPlaceholder="Filter divisions..."
          />

          <Slicer
            title="Group Type"
            options={groupTypeOptions}
            selectedValues={selectedGroupTypeIds}
            onChange={setSelectedGroupTypeIds}
            multiSelect={true}
            placeholder="All types"
            searchPlaceholder="Filter types..."
          />
        </div>

        {hasAnyFilter && (
          <button
            type="button"
            className="slicers-reset-btn"
            onClick={handleClearAllFilters}
            title="Clear all active filters"
          >
            <FilterX size={14} /> Clear filters
          </button>
        )}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Group Name</th>
              <th>Division</th>
              <th>Group Type</th>
              <th style={{ width: "120px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleGroups.map((group) => (
              <tr key={group.id}>
                <td>{group.id}</td>
                <td>
                  <button
                    className="link-button"
                    onClick={() => onOpenGroup(group)}
                  >
                    <strong>{group.name}</strong>
                  </button>
                </td>
                <td>
                  <span className="domain-pill finance">
                    {group.division?.name ?? "—"}
                  </span>
                </td>
                <td>
                  <span className="domain-pill auth">
                    {group.group_type?.name ?? "—"}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="secondary-button icon-action-button"
                      title="Open group details"
                      aria-label="Open group details"
                      onClick={() => onOpenGroup(group)}
                    >
                      <ExternalLink size={14} />
                    </button>
                    {canEdit && (
                      <button
                        className="secondary-button icon-action-button"
                        title="Edit group"
                        aria-label="Edit group"
                        onClick={() => handleOpenEdit(group)}
                      >
                        <Edit3 size={14} />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="danger-button icon-action-button"
                        title="Delete group"
                        aria-label="Delete group"
                        onClick={() => void handleDelete(group)}
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
        {loading && (
          <div className="empty-state">Loading groups from server...</div>
        )}
        {!loading && visibleGroups.length === 0 && (
          <div className="empty-state">
            {initialGroups.length === 0
              ? "No finance groups found."
              : "No groups matching active slicers & search."}
          </div>
        )}
      </div>

      {modalOpen && (
        <GroupFormModal
          group={editingGroup}
          divisions={divisions}
          groupTypes={groupTypes}
          error={modalError}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSaveGroup}
        />
      )}
    </section>
  );
}
