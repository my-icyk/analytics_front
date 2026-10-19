import { Rule } from "@/types/rules";
import { ProColumns } from "@ant-design/pro-components";
import {
  stringSorter,
  numberSorter,
  dateSorterNullAsMax,
  dateSorter,
} from "@/utils/sorters";

export const getColumns = (): ProColumns<Rule>[] => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    search: false,
    sorter: numberSorter<Rule>("id"),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    search: true,
    sorter: stringSorter<Rule>("name"),
    valueType: "text",
  },

  {
    title: "Valid From",
    dataIndex: "valid_from",
    key: "valid_from",
    search: false,
    sorter: dateSorter<Rule>("valid_from"),
    valueType: "date",
  },
  {
    title: "Valid To",
    dataIndex: "valid_to",
    key: "valid_to",
    search: false,
    sorter: dateSorterNullAsMax<Rule>("valid_to"),
    valueType: "date",
  },
];
