import { ACTIVE_STATUS, JOB_STATUS } from "@/constants/statuses";
import { ProColumns } from "@ant-design/pro-components";
import { Procedure } from "@/types/analytics";
import { numberSorter, stringSorter } from "@/utils/sorters";
import { PERMISSIONS } from "../../../../config/permissions";
import { EditActionButton } from "@/components/EditActionButton";
import { DeleteActionButton } from "@/components/DeleteActionButton";
import { RunActionButton } from "@/components/RunActionButton";
import { formatDateTime, formatDuration } from "@/utils/formatDate";
import { Can } from "@/access";

export const getColumns = (
  can: Can,
  onDelete: (procedure: Procedure) => void,
  onEdit: (id: number) => void,
  onRun: (procedure: Procedure) => void,
  runningIds: number[],
): ProColumns<Procedure>[] => {
  const canOpen = can(PERMISSIONS.ANALYTICS.PROCEDURE.READ);
  const canEdit = can(PERMISSIONS.ANALYTICS.PROCEDURE.UPDATE);
  const canDelete = can(PERMISSIONS.ANALYTICS.PROCEDURE.DELETE);
  const canRun = can(PERMISSIONS.ANALYTICS.PROCEDURE.RUN);
  return [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      search: false,
      valueType: "digit",
      sorter: numberSorter<Procedure>("id"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      valueType: "text",
      search: true,
      sorter: stringSorter<Procedure>("name"),
    },
    {
      title: "ORDER",
      dataIndex: "exec_order",
      key: "exec_order",
      search: false,
      valueType: "digit",
      sorter: numberSorter<Procedure>("exec_order"),
    },
    {
      title: "Active",
      dataIndex: "is_active",
      search: false,
      valueEnum: ACTIVE_STATUS,
      filters: true,
      onFilter: true,
    },
    {
      title: "Run",
      dataIndex: "last_run",
      search: false,
      key: "last_run",
      valueType: "text",
      sorter: stringSorter<Procedure>("last_run"),
      render: (_, record) => formatDateTime(record.last_run),
    },
    {
      title: "Status",
      dataIndex: "last_status",
      valueEnum: JOB_STATUS,
      search: false,
      filters: true,
      onFilter: true,
      sorter: stringSorter<Procedure>("last_status"),
    },
    {
      title: "Duration",
      dataIndex: "last_duration_ms",
      key: "last_duration_ms",
      valueType: "digit",
      search: false,
      sorter: numberSorter<Procedure>("last_duration_ms"),
      render: (_, record) => formatDuration(record.last_duration_ms),
    },
    {
      width: 140,
      title: "Actions",
      key: "actions",
      valueType: "option",
      render: (_, record) => [
        canRun && (
          <RunActionButton
            key="run"
            itemLabel={record.name}
            loading={runningIds.includes(record.id)}
            disabled={record.last_status === "Running"}
            onClick={() => onRun(record)}
          />
        ),
        canEdit && (
          <EditActionButton
            key="edit"
            itemLabel={record.name}
            onClick={() => onEdit(record.id)}
          />
        ),

        canDelete && (
          <DeleteActionButton
            key="delete"
            entityName="procedure"
            itemLabel={record.name}
            onConfirm={() => onDelete(record)}
          />
        ),
      ],
    },
  ];
};
