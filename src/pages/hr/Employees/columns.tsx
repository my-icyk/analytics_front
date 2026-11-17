import type { ProColumns } from "@ant-design/pro-components";
import { ViewActionButton } from "@/components/TableActions/ViewActionButton";
import type { Employee } from "@/types/hr";

export const getEmployeeColumns = (): ProColumns<Employee>[] => {
  return [
    {
      title: "ID",
      dataIndex: "id",
      search: false,
    },
    {
      title: "Name",
      dataIndex: "name",
      search: false,
      sorter: true,
    },
    {
      title: "Search",
      dataIndex: "search",
      search: true,
      hideInTable: true,
    },
    {
      title: "Department",
      dataIndex: "department_name",
      search: false,
    },
    {
      title: "User Principal Name",
      dataIndex: "user_principal_name",
      search: false,
    },
    {
      title: "Fiscal Code",
      dataIndex: "fiscal_code",
      search: false,
    },
    {
      title: "Username",
      dataIndex: "user_name",
      search: false,
    },
    {
      title: "Purchase Limit",
      dataIndex: "purchase_limit",
      search: false,
    },
    {
      title: "Actions",
      valueType: "option",
      width: 100,
      render: (_, employee) => [
        <ViewActionButton key="view" to={`/hr/employees/${employee.id}`} />,
      ],
    },
  ];
};
