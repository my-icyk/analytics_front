import { Department } from "@/types/departments";
import { numberSorter, stringSorter } from "@/utils/sorters";
import { ProColumns } from "@ant-design/pro-components";

export const getColumns = (): ProColumns<Department>[] => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    search: false,
    sorter: numberSorter<Department>("id"),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    search: true,
    sorter: stringSorter<Department>("name"),
    valueType: "text",
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
    search: true,
    sorter: stringSorter<Department>("code"),
    valueType: "text",
  },
  {
    title: "Brand",
    dataIndex: "brand",
    key: "brand",
    search: true,
    sorter: stringSorter<Department>("brand"),
    valueType: "text",
  },
];
