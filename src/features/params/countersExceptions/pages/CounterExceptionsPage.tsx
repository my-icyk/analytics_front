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
  Alert,
  App as AntdApp,
  Button,
  Card,
  Flex,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { TableProps } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { formatDateTime } from "../../../../utils/utils";
import { usePermissions } from "../../../../auth/AuthContext";
import { PERMISSIONS } from "../../../../constants/permissions";

export function CounterExceptionsPage() {
  const { can } = usePermissions();
  const canCreate = can(PERMISSIONS.PARAMS.COUNTER_EXCEPTION.CREATE);
  const canUpdate = can(PERMISSIONS.PARAMS.COUNTER_EXCEPTION.UPDATE);
  const canDelete = can(PERMISSIONS.PARAMS.COUNTER_EXCEPTION.DELETE);
  const { modal } = AntdApp.useApp();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [counterId, setCounterId] = useState<number | undefined>(undefined);
  const { data: countersData } = useCounters();
  const createException = useCreateException();
  const updateException = useUpdateException();
  const deleteException = useDeleteException();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingException, setEditingException] =
    useState<CounterException | null>(null);
  const [modalError, setModalError] = useState("");
  const [actionError, setActionError] = useState("");

  const { data, isFetching } = useExceptions({
    counterId,
    page,
    pageSize,
  });

  const exceptions = data?.items ?? [];
  const total = data?.total ?? 0;

  function handleCounterChange(value?: number) {
    setCounterId(value);
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

  function handleDelete(exception: CounterException) {
    modal.confirm({
      title: "Delete exception",
      content: `Are you sure you want to delete exception #${exception.id} for counter ${exception.counter_id}?`,
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
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
          throw err;
        }
      },
    });
  }

  const counterOptions = useMemo(
    () =>
      (countersData ?? []).map((counter) => ({
        value: counter.id,
        label: `Counter ${counter.id}`,
        count: counter.exception_count,
      })),
    [countersData],
  );

  const columns: TableProps<CounterException>["columns"] = [
    { title: "ID", dataIndex: "id", width: 70 },
    { title: "Counter ID", dataIndex: "counter_id", width: 110 },
    { title: "Valid From", dataIndex: "valid_from" },
    { title: "Valid To", dataIndex: "valid_to" },
    { title: "Visitors", dataIndex: "visitors", align: "right" },
    {
      title: "Auto",
      dataIndex: "is_auto",
      render: (isAuto: boolean) =>
        isAuto ? <Tag color="success">Yes</Tag> : <Tag>No</Tag>,
    },
    { title: "Created By", dataIndex: "created_by" },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      render: (value: string) => formatDateTime(value),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      width: 110,
      render: (_, exception) => (
        <Space size={4}>
          {canUpdate && (
            <Button
              size="small"
              icon={<EditOutlined />}
              title={`Edit exception ${exception.id}`}
              aria-label={`Edit exception ${exception.id}`}
              onClick={() => handleOpenEdit(exception)}
            />
          )}
          {canDelete && (
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              title={`Delete exception ${exception.id}`}
              aria-label={`Delete exception ${exception.id}`}
              onClick={() => handleDelete(exception)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <section className="management-panel">
      <div className="section-heading">
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Counter Exceptions
          </Typography.Title>
          <Typography.Text type="secondary">
            Validity windows for counters.
          </Typography.Text>
        </div>
      </div>

      <Card>
        <Flex
          justify="space-between"
          align="center"
          wrap
          gap={12}
          style={{ marginBottom: 16 }}
        >
          <Select<number>
            allowClear
            showSearch
            placeholder="All counters"
            style={{ minWidth: 220 }}
            value={counterId}
            options={counterOptions}
            optionFilterProp="label"
            onChange={handleCounterChange}
            optionRender={(option) => (
              <Flex justify="space-between" align="center" gap={8}>
                <span>{option.label}</span>
                <Tag style={{ marginInlineEnd: 0 }}>{option.data.count}</Tag>
              </Flex>
            )}
          />
          {canCreate && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
            >
              New exception
            </Button>
          )}
        </Flex>

        {actionError && (
          <Alert
            type="error"
            showIcon
            message={actionError}
            style={{ marginBottom: 16 }}
          />
        )}

        <Table<CounterException>
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={exceptions}
          loading={isFetching}
          locale={{ emptyText: "No counter exceptions found." }}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
            showTotal: (t, range) =>
              `${range[0]}–${range[1]} of ${t} exceptions`,
          }}
          onChange={(pagination) => {
            const nextSize = pagination.pageSize ?? pageSize;
            if (nextSize !== pageSize) {
              setPageSize(nextSize);
              setPage(1);
            } else {
              setPage(pagination.current ?? 1);
            }
          }}
        />
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
