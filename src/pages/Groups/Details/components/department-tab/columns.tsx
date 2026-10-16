import { Repartition } from "@/types/departments";
import { formatDate } from "@/utils/formatDate";
import {
  numberSorter,
  boolSorter,
  dateSorter,
  dateSorterNullAsMax,
  stringSorter,
} from "@/utils/sorters";
import { ProColumns } from "@ant-design/pro-components";

export const getColumns = (): ProColumns<Repartition>[] => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    search: false,
    sorter: numberSorter<Repartition>("id"),
  },

  {
    title: "Department",
    dataIndex: "department",
    key: "department",
    search: true,
    sorter: stringSorter<Repartition>("department"),
    valueType: "text",
  },

  {
    title: "Valid From",
    dataIndex: "valid_from",
    key: "valid_from",
    search: false,
    sorter: dateSorter<Repartition>("valid_from"),
    valueType: "date",
    render: (_, record) => formatDate(record.valid_from),
  },
  {
    title: "Valid To",
    dataIndex: "valid_to",
    key: "valid_to",
    search: false,
    sorter: dateSorterNullAsMax<Repartition>("valid_to"),
    valueType: "date",
    render: (_, record) => formatDate(record.valid_to),
  },
  {
    title: "Active",
    dataIndex: "is_active",
    key: "is_active",
    width: 110,
    sorter: boolSorter<Repartition>("is_active"),
    valueEnum: {
      true: { text: "Active", status: "Success" },
      false: { text: "Inactive", status: "Default" },
    },
  },
];
