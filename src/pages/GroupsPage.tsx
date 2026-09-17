import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  GroupPage,
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
  onFilterChange?: (filters: GroupFilterParams) => Promise<GroupPage> | void;
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
  const [total, setTotal] = useState<number>(initialGroups.length);
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);
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

  // Sync displayed groups if initialGroups changes from parent and no onFilterChange
  useEffect(() => {
    if (!onFilterChange) {
      setDisplayedGroups(initialGroups);
      setTotal(initialGroups.length);
    }
  }, [initialGroups, onFilterChange]);

  // Execute server-side filter request when filter props or pagination change
  const fetchFilteredGroups = useCallback(
    async (currentOffset = offset, currentLimit = limit) => {
      if (!onFilterChange) return;
      setLoading(true);
      setLocalError("");
      try {
        const filters: GroupFilterParams = {
          limit: currentLimit,
          offset: currentOffset,
        };
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
        if (result && "items" in result) {
          setDisplayedGroups(result.items);
          setTotal(result.total);
          setOffset(result.offset);
          setLimit(result.limit);
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
    },
    [
      onFilterChange,
      offset,
      limit,
      selectedGroupIds,
      selectedDivisionIds,
      selectedGroupTypeIds,
      search,
    ],
  );

  // Trigger server-side fetching when search or slicers change (resets offset to 0)
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      if (onFilterChange) {
        void fetchFilteredGroups(0, limit);
      }
      return;
    }
    if (!onFilterChange) return;

    const timer = setTimeout(() => {
      setOffset(0);
      void fetchFilteredGroups(0, limit);
    }, 250);

    return () => clearTimeout(timer);
  }, [
    selectedGroupIds,
    selectedDivisionIds,
    selectedGroupTypeIds,
    search,
    limit,
    onFilterChange,
  ]);

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
        void fetchFilteredGroups(offset, limit);
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
        const nextOffset =
          displayedGroups.length === 1 && offset > 0
            ? Math.max(0, offset - limit)
            : offset;
        setOffset(nextOffset);
        void fetchFilteredGroups(nextOffset, limit);
      }
    }
  };

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
    if (onFilterChange) {
      void fetchFilteredGroups(newOffset, limit);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setOffset(0);
    if (onFilterChange) {
      void fetchFilteredGroups(0, newLimit);
    }
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const canPrev = offset > 0;
  const canNext = offset + limit < total;

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
            {total === 0
              ? "No finance groups found."
              : "No groups matching active slicers & search."}
          </div>
        )}
      </div>

      <div className="table-pagination">
        <div className="pagination-info">
          {total === 0 ? (
            <span>0 groups</span>
          ) : (
            <span>
              Showing <strong>{offset + 1}</strong>–
              <strong>{Math.min(offset + limit, total)}</strong> of{" "}
              <strong>{total}</strong> groups
            </span>
          )}
        </div>

        <div className="pagination-controls">
          <div className="pagination-size">
            <span>Show:</span>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              disabled={loading}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="pagination-buttons">
            <button
              type="button"
              className="pagination-btn"
              title="First page"
              aria-label="First page"
              disabled={!canPrev || loading}
              onClick={() => handlePageChange(0)}
            >
              <ChevronsLeft size={14} />
            </button>
            <button
              type="button"
              className="pagination-btn"
              title="Previous page"
              aria-label="Previous page"
              disabled={!canPrev || loading}
              onClick={() => handlePageChange(Math.max(0, offset - limit))}
            >
              <ChevronLeft size={14} />
            </button>

            <span className="pagination-current">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              className="pagination-btn"
              title="Next page"
              aria-label="Next page"
              disabled={!canNext || loading}
              onClick={() => handlePageChange(offset + limit)}
            >
              <ChevronRight size={14} />
            </button>
            <button
              type="button"
              className="pagination-btn"
              title="Last page"
              aria-label="Last page"
              disabled={!canNext || loading}
              onClick={() => handlePageChange((totalPages - 1) * limit)}
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
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
