import { ProColumns } from "@ant-design/pro-components";
import type { Division } from "@/types/divisions";
import { useAccess } from "@umijs/max";
import { PERMISSIONS } from "../../../config/permissions";
import { DeleteActionButton } from "@/components/DeleteActionButton";

export const getColumns = (
  handleDelete: (record: Division) => void,
  access: ReturnType<typeof useAccess>,
): ProColumns<Division>[] => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    search: true,
    valueType: "digit",
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: "Division Name",
    dataIndex: "name",
    key: "name",
    valueType: "text",
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: "Groups Nr:",
    dataIndex: "group_count",
    key: "group_count",
    valueType: "digit",
    sorter: (a, b) => a.group_count - b.group_count,
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    search: false,
    width: 120,
    align: "right",
    fixed: "right",
    render: (_, record) => [
      access[PERMISSIONS.FINANCE.DIVISION.DELETE] && (
        <DeleteActionButton
          key="delete-button"
          entityName="division"
          itemLabel={record.name}
          onConfirm={() => handleDelete(record)}
        />
      ),
    ],
  },
];
