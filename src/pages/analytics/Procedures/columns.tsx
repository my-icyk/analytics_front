import access from "@/access";
import { ProColumns } from "@ant-design/pro-components";
import { Procedure } from "@/types/analytics";
import { useAccess } from "@umijs/max";
import { numberSorter, stringSorter } from "@/utils/sorters";
import { PERMISSIONS } from "../../../../config/permissions";
import { EditActionButton } from "@/components/EditActionButton";
import { DeleteActionButton } from "@/components/DeleteActionButton";
import { formatDateTime, formatDuration } from "@/utils/formatDate";

export const getColumns = (
  access: ReturnType<typeof useAccess>,
  onDelete: (procedure: Procedure) => void,
  onEdit: (id: number) => void,
): ProColumns<Procedure>[] => {
  const canOpen = access[PERMISSIONS.ANALYTICS.PROCEDURE.READ];
  const canEdit = access[PERMISSIONS.ANALYTICS.PROCEDURE.UPDATE];
  const canDelete = access[PERMISSIONS.ANALYTICS.PROCEDURE.DELETE];
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
      title: "Status",
      dataIndex: "is_active",
      search: true,
      valueEnum: {
        true: { text: "Active", status: "Success" },
        false: { text: "Inactive", status: "Default" },
      },
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
      valueType: "select",
      valueEnum: {
        success: { text: "Success", status: "Success" },
        running: { text: "Running", status: "Processing" },
        error: { text: "Error", status: "Error" },
        blank: { text: "No status", status: "" },
      },
      fieldProps: { mode: "multiple", allowClear: true },
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
