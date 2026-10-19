import type { ProColumns } from "@ant-design/pro-components";

import type { Target } from "@/types/rules";
import { ALLOCATION_OPTIONS } from "@/types/rules";
import { numberSorter, stringSorter } from "@/utils/sorters";
import { EditActionButton } from "@/components/EditActionButton";
import { DeleteActionButton } from "@/components/DeleteActionButton";

export const getColumns = (
  onEdit: (record: Target) => void,
  onDelete: (id: number) => void,
): ProColumns<Target>[] => [
  {
    title: "ID",
    dataIndex: "id",
    search: false,
    width: 80,
    sorter: numberSorter<Target>("id"),
  },
  {
    title: "Target group",
    dataIndex: "group_name",
    search: true,
    sorter: stringSorter<Target>("group_name"),
    render: (_, record) => `${record.group_name} (${record.group_id})`,
  },
  {
    title: "Allocation",
    dataIndex: "allocation_type",
    // the same options feed the modal's select, so they can't drift apart
    valueEnum: Object.fromEntries(
      ALLOCATION_OPTIONS.map(({ value, label }) => [value, { text: label }]),
    ),
    sorter: stringSorter<Target>("allocation_type"),
  },
  {
    title: "Percentage",
    dataIndex: "percent_value",
    search: false,
    sorter: numberSorter<Target>("percent_value"),
    render: (_, record) => `${Number(record.percent_value).toFixed(2)}%`,
  },
  {
    title: "Actions",
    key: "actions",
    valueType: "option",
    width: 100,
    align: "right",
    fixed: "right",
    render: (_, record) => [
      <EditActionButton
        key="edit"
        itemLabel={record.group_name}
        onClick={() => onEdit(record)}
      />,
      <DeleteActionButton
        key="delete"
        entityName="target"
        itemLabel={record.group_name}
        onConfirm={() => onDelete(record.id)}
      />,
    ],
  },
];
