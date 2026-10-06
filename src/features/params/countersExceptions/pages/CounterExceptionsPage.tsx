import { useNavigate } from "react-router-dom";
import { useCounters, useExceptions } from "../countersExceptions.queries";
import { CountersTable } from "../components/CountersTable";
import { Counter, CounterException } from "../countersExceptions.types";
import { Column, DataTable } from "../../../../components/DataTable";
import { useState } from "react";
import { Pagination } from "../../../../components/Pagination";

export function CountersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, isLoading, isFetching, error } = useExceptions({
    page,
    pageSize,
  });

  const exceptions = data?.items ?? [];
  const total = data?.total ?? 0;

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPage(1);
  }

  function handleOpen(counter: Counter) {
    navigate(`/counters/${counter.id}`);
  }

  const columns: Column<CounterException>[] = [
    { key: "id", header: "ID", render: (u) => u.id },
    { key: "counter_id", header: "Counter ID", render: (u) => u.counter_id },
    { key: "valid_from", header: "Valid From", render: (u) => u.valid_from },
    { key: "valid_to", header: "Valid To", render: (u) => u.valid_to },
  ];

  return (
    <>
      <Pagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        loading={isFetching}
        entityLabel="exceptions"
      />
      <DataTable
        columns={columns}
        data={exceptions}
        rowKey={(u) => u.id}
        isLoading={isLoading}
        isFetching={isFetching}
      />
    </>
  );
}
