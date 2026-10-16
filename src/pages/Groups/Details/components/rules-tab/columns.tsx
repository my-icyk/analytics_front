import { Rule } from "@/types/rules";
import { ProColumns } from "@ant-design/pro-components";

export const getColumns = (): ProColumns<Rule>[] => [
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
    title: "Group",
    dataIndex: "group_name",
    key: "group_name",
    search: true,
    sorter: (a, b) => a.group_name.localeCompare(b.group_name),
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
];
