import { useNavigate } from "react-router-dom";
import { useCounters, useExceptions } from "../countersExceptions.queries";
import { CountersTable } from "../components/CountersTable";
import { Counter, CounterException } from "../countersExceptions.types";
import { Column, DataTable } from "../../../../components/DataTable";
import { useMemo, useState } from "react";
import { Pagination } from "../../../../components/Pagination";
import { Slicer, SlicerOption } from "../../../../components/common/Slicer";
import { formatDateTime } from "../../../../utils/utils";

export function CountersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedCounterIds, setSelectedCounterIds] = useState<
    (string | number)[]
  >([]);
  const { data: countersData } = useCounters();

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
        emptyText="No counter exceptions found."
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
    </section>
  );
}
