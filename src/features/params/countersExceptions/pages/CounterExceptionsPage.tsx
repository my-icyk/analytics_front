import { Edit3, Plus, Trash2 } from "lucide-react";
import {
  useCounters,
  useCreateException,
  useDeleteException,
  useExceptions,
  useUpdateException,
} from "../countersExceptions.queries";
import {
  CounterException,
  CounterExceptionCreate,
} from "../countersExceptions.types";
import { ExceptionFormModal } from "../components/ExceptionFormModal";
import { Column, DataTable } from "../../../../components/DataTable";
import { useMemo, useState } from "react";
import { Pagination } from "../../../../components/Pagination";
import { Slicer, SlicerOption } from "../../../../components/common/Slicer";
import { formatDateTime } from "../../../../utils/utils";

export function CountersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCounterIds, setSelectedCounterIds] = useState<
    (string | number)[]
  >([]);
  const { data: countersData } = useCounters();
  const createException = useCreateException();
  const updateException = useUpdateException();
  const deleteException = useDeleteException();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingException, setEditingException] =
    useState<CounterException | null>(null);
  const [modalError, setModalError] = useState("");
  const [actionError, setActionError] = useState("");

  const counterId =
    selectedCounterIds.length > 0 ? Number(selectedCounterIds[0]) : undefined;

  const { data, isLoading, isFetching, error } = useExceptions({
    counterId,
    page,
    pageSize,
  });

  const exceptions = data?.items ?? [];
  const total = data?.total ?? 0;

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPage(1);
  }

  function handleCounterChange(selected: (string | number)[]) {
    setSelectedCounterIds(selected);
    setPage(1);
  }

  function handleOpenCreate() {
    setEditingException(null);
    setModalError("");
    setModalOpen(true);
  }

  function handleOpenEdit(exception: CounterException) {
    setEditingException(exception);
    setModalError("");
    setModalOpen(true);
  }

  async function handleSave(payload: CounterExceptionCreate) {
    try {
      if (editingException) {
        await updateException.mutateAsync({
          exceptionId: editingException.id,
          payload,
        });
      } else {
        await createException.mutateAsync(payload);
      }
      setModalOpen(false);
    } catch (err) {
      setModalError(
        err instanceof Error ? err.message : "Failed to save exception",
      );
      throw err;
    }
  }

  async function handleDelete(exception: CounterException) {
    const confirmed = window.confirm(
      `Are you sure you want to delete exception #${exception.id} for counter ${exception.counter_id}?`,
    );
    if (!confirmed) return;
    setActionError("");
    try {
      await deleteException.mutateAsync(exception.id);
      if (exceptions.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete exception",
      );
    }
  }

  const counterOptions: SlicerOption[] = useMemo(
    () =>
      (countersData ?? []).map((counter) => ({
        id: counter.id,
        label: `Counter ${counter.id}`,
        badge: counter.exception_count,
      })),
    [countersData],
  );

  const columns: Column<CounterException>[] = [
    { key: "id", header: "ID", render: (u) => u.id },
    { key: "counter_id", header: "Counter ID", render: (u) => u.counter_id },
    { key: "valid_from", header: "Valid From", render: (u) => u.valid_from },
    { key: "valid_to", header: "Valid To", render: (u) => u.valid_to },
    { key: "visitors", header: "Visitors", render: (u) => u.visitors },
    {
      key: "is_auto",
      header: "Auto",
      render: (u) => (u.is_auto ? "Yes" : "No"),
    },
    {
      key: "created_by",
      header: "Created By",
      render: (u) => u.created_by,
    },
    {
      key: "updated_at",
      header: "Updated At",
      render: (u) => formatDateTime(u.updated_at),
    },
  ];

  return (
    <section className="management-panel">
      <div className="section-heading">
        <div>
          <h2>Counter Exceptions</h2>
          <p>Validity windows for counters.</p>
        </div>
        <button className="primary-button" onClick={handleOpenCreate}>
          <Plus size={17} /> New exception
        </button>
      </div>

      <div className="slicers-bar">
        <div className="slicers-group">
          <Slicer
            title="Counter"
            options={counterOptions}
            selectedValues={selectedCounterIds}
            onChange={handleCounterChange}
            multiSelect={false}
            placeholder="All counters"
            searchPlaceholder="Filter counters..."
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={exceptions}
        rowKey={(u) => u.id}
        isLoading={isLoading}
        isFetching={isFetching}
        error={actionError}
        emptyText="No counter exceptions found."
        renderActions={(exception) => (
          <div className="table-actions">
            <button
              className="secondary-button icon-action-button"
              title="Edit exception"
              aria-label="Edit exception"
              onClick={() => handleOpenEdit(exception)}
            >
              <Edit3 size={14} />
            </button>
            <button
              className="danger-button icon-action-button"
              title="Delete exception"
              aria-label="Delete exception"
              onClick={() => void handleDelete(exception)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
        footer={
          <Pagination
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            loading={isFetching}
            entityLabel="exceptions"
          />
        }
      />

      {modalOpen && (
        <ExceptionFormModal
          exception={editingException}
          initialCounterId={counterId}
          error={modalError}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSave}
        />
      )}
    </section>
  );
}
