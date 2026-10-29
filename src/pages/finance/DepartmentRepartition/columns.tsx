import type { ProColumns } from "@ant-design/pro-components";
import type { DepartmentRepartitionDetails } from "@/types/finance/DepartmentReaprtitions";
import { formatDate } from "@/utils/formatDate";

export const columns: ProColumns<DepartmentRepartitionDetails>[] = [
  {
    title: "ID",
    dataIndex: "id",
    search: false,
  },
  {
    title: "Department",
    dataIndex: "department_name",
  },
  {
    title: "Group",
    dataIndex: "group_name",
  },
  {
    title: "Valid From",
    dataIndex: "valid_from",
    valueType: "date",
    search: false,
    render: (_, { valid_from }) => formatDate(valid_from),
  },
  {
    title: "Valid To",
    dataIndex: "valid_to",
    valueType: "date",
    search: false,
    render: (_, { valid_to }) => formatDate(valid_to),
  },
  {
    title: "Active",
    dataIndex: "is_active",
    width: 110,
    search: false,
    valueEnum: {
      true: { text: "Active", status: "Success" },
      false: { text: "Inactive", status: "Default" },
    },
  },
];
