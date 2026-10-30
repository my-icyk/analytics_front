import type { ProColumns } from "@ant-design/pro-components";
import { useAccess } from "@umijs/max";
import type { Repartition } from "@/types/departments";
import { periodColumn } from "@/components/columns";
import { boolSorter, numberSorter, stringSorter } from "@/utils/sorters";
import { EditActionButton } from "@/components/EditActionButton";
import { DeleteActionButton } from "@/components/DeleteActionButton";
import { PERMISSIONS } from "../../../../../../config/permissions";

type GetColumnsParams = {
  access: ReturnType<typeof useAccess>;
  onEdit: (record: Repartition) => void;
  onDelete: (id: number) => void;
};

export function getColumns({
  access,
  onEdit,
  onDelete,
}: GetColumnsParams): ProColumns<Repartition>[] {
  const canEdit = access[PERMISSIONS.FINANCE.DEPARTMENT_REPARTITION.UPDATE];
  const canDelete = access[PERMISSIONS.FINANCE.DEPARTMENT_REPARTITION.DELETE];
  return [
    {
      title: "ID",
      dataIndex: "id",
      search: false,
      sorter: numberSorter<Repartition>("id"),
    },
    {
      title: "Department",
      dataIndex: "department_name",
      search: true,
      valueType: "text",
      sorter: stringSorter<Repartition>("department_name"),
      render: (_, record) =>
        `${record.department_name} (${record.department_id})`,
    },
    periodColumn<Repartition>({ sortable: true }),
    {
      title: "Active",
      dataIndex: "is_active",
      width: 110,
      sorter: boolSorter<Repartition>("is_active"),
      valueEnum: {
        true: { text: "Active", status: "Success" },
        false: { text: "Inactive", status: "Default" },
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      search: false,
      width: 100,
      align: "right",
      fixed: "right",
      render: (_, record) => [
        canEdit && (
          <EditActionButton
            key="edit"
            itemLabel={record.department_name}
            onClick={() => onEdit(record)}
          />
        ),

        canDelete && (
          <DeleteActionButton
            key="delete"
            entityName="department"
            itemLabel={record.department_name}
            onConfirm={() => onDelete(record.id)}
          />
        ),
      ],
    },
  ];
}
