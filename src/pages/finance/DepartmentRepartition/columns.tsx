import type { ProColumns } from "@ant-design/pro-components";
import type { DepartmentRepartitionDetails } from "@/types/finance/DepartmentReaprtitions";

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
    dataIndex: "group_id",
  },
  {
    title: "Valid From",
    dataIndex: "valid_from",
    valueType: "date",
    search: false,
  },
  {
    title: "Valid To",
    dataIndex: "valid_to",
    valueType: "date",
    search: false,
  },
  {
    title: "Active",
    dataIndex: "is_active",
    valueType: "switch",
    search: false,
  },
];
