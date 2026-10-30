import type { ProColumns } from "@ant-design/pro-components";
import type { DepartmentRepartitionDetails } from "@/types/finance/DepartmentReaprtitions";
import { lookupSelectColumn, periodColumn } from "@/components/columns";
import { DefaultOptionType } from "antd/es/select";
import { lookupGroups } from "@/services/groups";
import { Space, Typography } from "antd";

export const getColumns = (
  departmentOptions: DefaultOptionType[],
): ProColumns<DepartmentRepartitionDetails>[] => [
  {
    title: "ID",
    dataIndex: "id",
    search: false,
  },
  {
    title: "Department",
    dataIndex: "department_name",
    search: false,
    render: (_, row) => (
      <Space size={6} style={{ whiteSpace: "nowrap" }}>
        {row.department_name}

        <Typography.Text type="secondary" italic>
          {row.brand_name} · {row.department_code}
        </Typography.Text>
      </Space>
    ),
  },
  {
    title: "Department",
    dataIndex: "department_ids",
    hideInTable: true,
    valueType: "select",
    fieldProps: {
      mode: "multiple",
      options: departmentOptions,
      showSearch: true,
      optionFilterProp: "label",
      allowClear: true,
    },
  },
  lookupSelectColumn<DepartmentRepartitionDetails>({
    title: "Group",
    dataIndex: "group_ids",
    lookup: lookupGroups,
    placeholder: "Select groups",
  }),
  {
    title: "Group",
    dataIndex: "group_name",
    search: false,
  },
  periodColumn<DepartmentRepartitionDetails>(),

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
