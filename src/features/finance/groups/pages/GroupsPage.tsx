import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../../../../constants/config";
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
import { useDebouncedValue } from "../../../../hooks/useDebouncedValue";

import { GroupFormModal } from "../../../../components/finance/GroupFormModal";
import {
  Slicer,
  type SlicerOption,
} from "../../../../components/common/Slicer";
import { useDivisions } from "../../divisions";
import { usePermissions } from "../../../../auth/AuthContext";
import {
  useCreateGroup,
  useGroups,
  useGroupTypes,
  useRemoveGroup,
  useUpdateGroup,
} from "..";
import { PERMISSIONS } from "../../../../constants/permissions";
import {
  Group,
  GroupCreate,
  GroupFilterParams,
  GroupPage,
} from "../groups.types";
import { Column, DataTable } from "../../../../components/DataTable";
import { Pagination } from "../../../../components/Pagination";
import { TableActions } from "../../../../components/TableActions";
type GroupsPageProps = {
  groups: Group[];
  onOpenGroup: (group: Group) => void;
  onCreateGroup: (payload: GroupCreate) => Promise<void>;
  onUpdateGroup: (groupId: number, payload: GroupCreate) => Promise<void>;
  onDeleteGroup: (group: Group) => Promise<void>;
  onFilterChange?: (filters: GroupFilterParams) => Promise<GroupPage> | void;
};

export function GroupsPage({
  groups: initialGroups,
  onOpenGroup,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
  onFilterChange,
}: GroupsPageProps) {
  const [limit, setLimit] = useState<number>(DEFAULT_PAGE_SIZE);
  const [offset, setOffset] = useState<number>(0);
  //TODO: Why is used that const
  const [actionError, setActionError] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const { data: groupTypes = [] } = useGroupTypes();
  const { can } = usePermissions();

  const canCreate = can(PERMISSIONS.FINANCE.GROUP.CREATE);
  const canEdit = can(PERMISSIONS.FINANCE.GROUP.UPDATE);
  const canDelete = can(PERMISSIONS.FINANCE.GROUP.DELETE);
  const canView = can(PERMISSIONS.FINANCE.GROUP.READ);

  const { data: divisions = [] } = useDivisions();
  const [displayedGroups, setDisplayedGroups] =
    useState<Group[]>(initialGroups);

  const [localError, setLocalError] = useState("");

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
  // TODO: Trebuie sa fie separat cumva?
  function handlePageSizeChange(size: number) {
    setLimit(size);
    setOffset(DEFAULT_PAGE);
  }

  const filters = useMemo<GroupFilterParams>(() => {
    const trimmedSearch = debouncedSearch.trim();

    return {
      limit,
      offset,
      ...(trimmedSearch && {
        search: trimmedSearch,
      }),
      ...(selectedDivisionIds.length > 0 && {
        division_id: selectedDivisionIds.map(Number),
      }),
      ...(selectedGroupTypeIds.length > 0 && {
        group_type_id: selectedGroupTypeIds.map(Number),
      }),
    };
  }, [
    limit,
    offset,
    debouncedSearch,
    selectedDivisionIds,
    selectedGroupTypeIds,
  ]);

  const { data, isLoading, isFetching, error } = useGroups(filters);
  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();
  const deleteGroup = useRemoveGroup();
  // TODO: to do something
  const groups_data = data?.items ?? [];
  const [total, setTotal] = useState<number>(data?.total ?? 0);

  // Execute server-side filter request when filter props or pagination change

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

  const hasAnyFilter =
    Boolean(search) ||
    selectedDivisionIds.length > 0 ||
    selectedGroupTypeIds.length > 0;

  const handleClearAllFilters = () => {
    setSearch("");
    setSelectedDivisionIds([]);
    setSelectedGroupTypeIds([]);
  };

  // Fallback client-side filtering if onFilterChange is not passed
  const visibleGroups = useMemo(() => {
    if (onFilterChange) {
      return displayedGroups;
    }
    return initialGroups.filter((g) => {
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

  async function handleSaveGroup(payload: GroupCreate) {
    try {
      if (editingGroup) {
        await updateGroup.mutateAsync({ groupId: editingGroup.id, payload });
      } else {
        await createGroup.mutateAsync(payload);
      }
      setModalOpen(false);
      // if (onFilterChange) {
      //   void ();
      // }
    } catch (err) {
      setModalError(
        err instanceof Error ? err.message : "Failed to save group",
      );
      throw err;
    }
  }

  async function handleDelete(group: Group) {
    const confirmed = window.confirm(
      `Are you sure you want to delete group "${group.name}"?`,
    );
    if (!confirmed) return;
    setActionError("");
    try {
      await deleteGroup.mutateAsync(group.id);
      {
        setOffset(1);
      }
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete exception",
      );
    }
  }

  const displayError = error || localError;

  const columns: Column<Group>[] = [
    { key: "id", header: "ID", render: (u) => u.id },
    { key: "name", header: "Name", render: (u) => u.name },
    { key: "division", header: "Division", render: (u) => u.division.name },
    {
      key: "group_type",
      header: "Group Type",
      render: (u) => u.group_type.name,
    },
  ];

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

      {displayError && <p className="auth-error">"ERORR"</p>}

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

      <DataTable
        columns={columns}
        data={groups_data}
        rowKey={(u) => u.id}
        isLoading={isLoading}
        isFetching={isFetching}
        //TODO NEED TO ADD ERROR HANDLING
        // error={error}
        emptyText="No counter exceptions found."
        renderActions={(group) => (
          <TableActions
            onOpen={canView ? () => onOpenGroup(group) : undefined}
            onEdit={canEdit ? () => handleOpenEdit(group) : undefined}
            onDelete={canDelete ? () => void handleDelete(group) : undefined}
            //TODO: Oare am nevoie de labels?
            editLabel={`Edit group ${group.id}`}
            deleteLabel={`Delete group ${group.id}`}
            openLabel={`Open group ${group.id}`}
            // TODO: ADD DISABLE
          />
        )}
        footer={
          <Pagination
            total={total}
            page={offset}
            pageSize={limit}
            onPageChange={setOffset}
            onPageSizeChange={handlePageSizeChange}
            loading={isFetching}
            entityLabel="exceptions"
          />
        }
      />

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
