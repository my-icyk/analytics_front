import { Repartition } from "@/types/departments";
import { ProColumns } from "@ant-design/pro-components";

export const getColumns = (): ProColumns<Repartition>[] => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    search: false,
    sorter: (a, b) => a.id - b.id,
  },

  {
    title: "Department",
    dataIndex: "department",
    key: "department",
    search: true,
    sorter: (a, b) => a.department.localeCompare(b.department),
    valueType: "text",
  },

  {
    title: "Valid From",
    dataIndex: "valid_from",
    key: "valid_from",
    search: false,
    sorter: (a, b) =>
      new Date(a.valid_from).getTime() - new Date(b.valid_from).getTime(),
    valueType: "date",
  },
  {
    title: "Valid To",
    dataIndex: "valid_to",
    key: "valid_to",
    search: false,
    sorter: (a, b) =>
      new Date(a.valid_to).getTime() - new Date(b.valid_to).getTime(),
    valueType: "date",
  },
  {
    title: "Active",
    dataIndex: "is_active",
    key: "is_active",
    search: true,
    sorter: (a, b) => Number(a.is_active) - Number(b.is_active),
    valueEnum: {
      true: "Active",
      false: "Inactive",
    },
  },
];
