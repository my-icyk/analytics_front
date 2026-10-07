import { useMemo, useState } from "react";
import { FilterX, Plus, Search } from "lucide-react";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../../../../constants/config";
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
import type { Group, GroupCreate, GroupFilterParams } from "../groups.types";
import { Column, DataTable } from "../../../../components/DataTable";
import { Pagination } from "../../../../components/Pagination";
import { TableActions } from "../../../../components/TableActions";

type GroupsPageProps = {
  onOpenGroup: (group: Group) => void;
};

export function GroupsPage({ onOpenGroup }: GroupsPageProps) {
  const { can } = usePermissions();
  const canCreate = can(PERMISSIONS.FINANCE.GROUP.CREATE);
  const canEdit = can(PERMISSIONS.FINANCE.GROUP.UPDATE);
  const canDelete = can(PERMISSIONS.FINANCE.GROUP.DELETE);
  const canView = can(PERMISSIONS.FINANCE.GROUP.READ);

  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [selectedDivisionIds, setSelectedDivisionIds] = useState<
    (string | number)[]
  >([]);
  const [selectedGroupTypeIds, setSelectedGroupTypeIds] = useState<
    (string | number)[]
  >([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [modalError, setModalError] = useState("");
  const [actionError, setActionError] = useState("");

  const filters = useMemo<GroupFilterParams>(() => {
    const trimmedSearch = debouncedSearch.trim();

    return {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      ...(trimmedSearch && { search: trimmedSearch }),
      ...(selectedDivisionIds.length > 0 && {
        division_id: selectedDivisionIds.map(Number),
      }),
      ...(selectedGroupTypeIds.length > 0 && {
        group_type_id: selectedGroupTypeIds.map(Number),
      }),
    };
  }, [
    page,
    pageSize,
    debouncedSearch,
    selectedDivisionIds,
    selectedGroupTypeIds,
  ]);

  const { data, isLoading, isFetching, error } = useGroups(filters);
  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();
  const deleteGroup = useRemoveGroup();

  const groups = data?.items ?? [];
  const total = data?.total ?? 0;

  const { data: groupTypes = [] } = useGroupTypes();
  const { data: divisions = [] } = useDivisions();

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPage(DEFAULT_PAGE);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(DEFAULT_PAGE);
  }

  function handleDivisionChange(selected: (string | number)[]) {
    setSelectedDivisionIds(selected);
    setPage(DEFAULT_PAGE);
  }

  function handleGroupTypeChange(selected: (string | number)[]) {
    setSelectedGroupTypeIds(selected);
    setPage(DEFAULT_PAGE);
  }

  const divisionOptions: SlicerOption[] = useMemo(
    () =>
      divisions.map((d) => ({
        id: d.id,
        label: d.name,
        badge: d.group_count,
      })),
    [divisions, groups],
  );

  const groupTypeOptions: SlicerOption[] = useMemo(
    () =>
      groupTypes.map((gt) => ({
        id: gt.id,
        label: gt.name,
        badge: gt.group_count,
      })),
    [groupTypes, groups],
  );

  const hasAnyFilter =
    Boolean(search) ||
    selectedDivisionIds.length > 0 ||
    selectedGroupTypeIds.length > 0;

  function handleClearAllFilters() {
    setSearch("");
    setSelectedDivisionIds([]);
    setSelectedGroupTypeIds([]);
    setPage(DEFAULT_PAGE);
  }

  function handleOpenCreate() {
    setEditingGroup(null);
    setModalError("");
    setModalOpen(true);
  }

  function handleOpenEdit(group: Group) {
    setEditingGroup(group);
    setModalError("");
    setModalOpen(true);
  }

  async function handleSaveGroup(payload: GroupCreate) {
    try {
      if (editingGroup) {
        await updateGroup.mutateAsync({ groupId: editingGroup.id, payload });
      } else {
        await createGroup.mutateAsync(payload);
      }
      setModalOpen(false);
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
      if (groups.length === 1 && page > DEFAULT_PAGE) {
        setPage(page - 1);
      }
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete group",
      );
    }
  }

  const queryError =
    error instanceof Error
      ? error.message
      : error
        ? "Failed to load groups"
        : "";
  const displayError = actionError || queryError;

  //TODO: De revazut cum d eintegrat link sau alte chestii
  const columns: Column<Group>[] = [
    { key: "id", header: "ID", render: (g) => g.id, width: "60px" },
    {
      key: "name",
      header: "Group Name",
      render: (g) => (
        <button className="link-button" onClick={() => onOpenGroup(g)}>
          <strong>{g.name}</strong>
        </button>
      ),
    },
    {
      key: "division",
      header: "Division",
      render: (g) => (
        <span className="domain-pill finance">{g.division?.name ?? "—"}</span>
      ),
    },
    {
      key: "group_type",
      header: "Group Type",
      render: (g) => (
        <span className="domain-pill auth">{g.group_type?.name ?? "—"}</span>
      ),
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

      {displayError && <p className="auth-error">{displayError}</p>}

      <div className="slicers-bar">
        <div className="search-box">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search keyword..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="slicers-group">
          <Slicer
            title="Division"
            options={divisionOptions}
            selectedValues={selectedDivisionIds}
            onChange={handleDivisionChange}
            multiSelect={true}
            placeholder="All divisions"
            searchPlaceholder="Filter divisions..."
          />

          <Slicer
            title="Group Type"
            options={groupTypeOptions}
            selectedValues={selectedGroupTypeIds}
            onChange={handleGroupTypeChange}
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
        data={groups}
        rowKey={(g) => g.id}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyText="No finance groups found."
        renderActions={(group) => (
          <TableActions
            onOpen={canView ? () => onOpenGroup(group) : undefined}
            onEdit={canEdit ? () => handleOpenEdit(group) : undefined}
            onDelete={canDelete ? () => void handleDelete(group) : undefined}
            openLabel={`Open group ${group.name}`}
            editLabel={`Edit group ${group.name}`}
            deleteLabel={`Delete group ${group.name}`}
          />
        )}
        footer={
          <Pagination
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            loading={isFetching}
            entityLabel="groups"
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
