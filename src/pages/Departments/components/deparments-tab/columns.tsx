import { Department } from "@/types/departments";
import { ProColumns } from "@ant-design/pro-components";

export const getColumns = (): ProColumns<Department>[] => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    search: false,
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    search: true,
    sorter: (a, b) => a.name.localeCompare(b.name),
    valueType: "text",
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
    search: true,
    sorter: (a, b) => a.code.localeCompare(b.code),
    valueType: "text",
  },
  {
    title: "Brand",
    dataIndex: "brand",
    key: "brand",
    search: true,
    sorter: (a, b) => a.brand.localeCompare(b.brand),
    valueType: "text",
  },
];
