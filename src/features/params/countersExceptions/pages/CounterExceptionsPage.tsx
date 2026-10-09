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
import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit3,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { formatDateTime } from "../../../../utils/utils";
import { usePermissions } from "../../../../auth/AuthContext";
import { PERMISSIONS } from "../../../../constants/permissions";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

export function CounterExceptionsPage() {
  const { can } = usePermissions();
  const canCreate = can(PERMISSIONS.PARAMS.COUNTER_EXCEPTION.CREATE);
  const canUpdate = can(PERMISSIONS.PARAMS.COUNTER_EXCEPTION.UPDATE);
  const canDelete = can(PERMISSIONS.PARAMS.COUNTER_EXCEPTION.DELETE);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedCounterIds, setSelectedCounterIds] = useState<
    (string | number)[]
  >([]);

  const { data: countersData } = useCounters();
  const createException = useCreateException();
  const updateException = useUpdateException();
  const deleteException = useDeleteException();
  const pageSizeOptions = [10, 20, 50, 100];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingException, setEditingException] =
    useState<CounterException | null>(null);
  const [modalError, setModalError] = useState("");
  const [actionError, setActionError] = useState("");

  const counterId =
    selectedCounterIds.length > 0 ? Number(selectedCounterIds[0]) : undefined;

  const { data, isLoading, isFetching } = useExceptions({
    counterId,
    page: pageIndex + 1,
    pageSize,
  });

  const exceptions = data?.items ?? [];
  const total = data?.total ?? 0;

  function handleCounterChange(selected: (string | number)[]) {
    setSelectedCounterIds(selected);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
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
      if (exceptions.length === 1 && pageIndex > 0) {
        setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
      }
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete exception",
      );
    }
  }

  type CounterOption = { id: string | number; label: string; badge?: number };

  const counterOptions: CounterOption[] = useMemo(
    () =>
      (countersData ?? []).map((counter) => ({
        id: counter.id,
        label: `Counter ${counter.id}`,
        badge: counter.exception_count,
      })),
    [countersData],
  );

  const columns: ColumnDef<CounterException>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "counter_id", header: "Counter ID" },
    { accessorKey: "valid_from", header: "Valid From" },
    { accessorKey: "valid_to", header: "Valid To" },
    { accessorKey: "visitors", header: "Visitors" },
    {
      accessorKey: "is_auto",
      header: "Auto",
      cell: ({ getValue }) => (getValue<boolean>() ? "Yes" : "No"),
    },
    { accessorKey: "created_by", header: "Created By" },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ getValue }) => formatDateTime(getValue<string>()),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          {canUpdate && (
            <Button
              variant="outline"
              size="icon-sm"
              title={`Edit exception ${row.original.id}`}
              aria-label={`Edit exception ${row.original.id}`}
              onClick={() => handleOpenEdit(row.original)}
            >
              <Edit3 />
            </Button>
          )}
          {canDelete && (
            <Button
              variant="destructive"
              size="icon-sm"
              title={`Delete exception ${row.original.id}`}
              aria-label={`Delete exception ${row.original.id}`}
              onClick={() => void handleDelete(row.original)}
              disabled={deleteException.isPending}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: exceptions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row.id),
    manualPagination: true,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: setPagination,
  });

  const totalPages = table.getPageCount();
  const currentPage = pageIndex + 1;
  const offset = pageIndex * pageSize;

  return (
    <section>
      <div className="section-heading">
        <div>
          <h2>Counter Exceptions</h2>
          <p>Validity windows for counters.</p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Combobox
                items={counterOptions}
                itemToStringValue={(option) => option.label}
                value={counterOptions.find(
                  (option) => String(option.id) === String(counterId),
                )}
                onValueChange={(option) => {
                  if (!option) {
                    handleCounterChange([]);
                  } else {
                    handleCounterChange([option.id]);
                  }
                }}
              >
                <ComboboxInput placeholder="All counters" showClear />

                <ComboboxContent>
                  <ComboboxEmpty>No counter found.</ComboboxEmpty>

                  <ComboboxList>
                    {(option) => (
                      <ComboboxItem key={option.id} value={option}>
                        <span>{option.label}</span>

                        {option.badge != null && (
                          <span className="ml-auto text-xs text-muted-foreground">
                            {option.badge}
                          </span>
                        )}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            {canCreate && (
              <Button onClick={handleOpenCreate}>New exception</Button>
            )}
          </div>

          <div>
            {actionError && <p className="auth-error">{actionError}</p>}

            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody style={isFetching ? { opacity: 0.55 } : undefined}>
                {!isLoading &&
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {isLoading && <div className="empty-state">Loading…</div>}
            {!isLoading && exceptions.length === 0 && (
              <div className="empty-state">No counter exceptions found.</div>
            )}
          </div>
        </CardContent>

        <CardFooter className="justify-between">
          <Field orientation="horizontal" className="w-fit">
            {total === 0 ? (
              "0 exceptions"
            ) : (
              <>
                Showing <strong>{offset + 1}</strong>–
                <strong>{Math.min(offset + pageSize, total)}</strong> of{" "}
                <strong>{total}</strong> exceptions
              </>
            )}
          </Field>
          <Field orientation="horizontal" className="w-fit">
            <FieldLabel>Page size</FieldLabel>
            <Select
              value={String(pageSize)}
              onValueChange={(value) =>
                setPagination({
                  pageIndex: 0,
                  pageSize: Number(value),
                })
              }
              disabled={isFetching}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Page size" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Page size</SelectLabel>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    title="First page"
                    aria-label="First page"
                    disabled={!table.getCanPreviousPage() || isFetching}
                    onClick={() => table.firstPage()}
                  >
                    <ChevronsLeft />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    title="Previous page"
                    aria-label="Previous page"
                    disabled={!table.getCanPreviousPage() || isFetching}
                    onClick={() => table.previousPage()}
                  >
                    <ChevronLeft />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <span className="px-2 text-xs font-semibold">
                    {currentPage} / {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    title="Next page"
                    aria-label="Next page"
                    disabled={!table.getCanNextPage() || isFetching}
                    onClick={() => table.nextPage()}
                  >
                    <ChevronRight />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    title="Last page"
                    aria-label="Last page"
                    disabled={!table.getCanNextPage() || isFetching}
                    onClick={() => table.lastPage()}
                  >
                    <ChevronsRight />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Field>
        </CardFooter>
      </Card>

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
