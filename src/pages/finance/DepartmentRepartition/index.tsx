import { PageContainer, ProTable } from "@ant-design/pro-components";

import type { DepartmentRepartitionDetails } from "@/types/finance/DepartmentReaprtitions";
import { getColumns } from "./columns";
import { getDepartmentRepartitions } from "@/services/finance/DepartmentRepartitions";
import { DEFAULT_PAGE_SIZE } from "@/constants/app";
import { useDepartments } from "@/hooks/useReferenceData";

// what the search form can send (must match the dataIndex of the search columns)
type SearchParams = {
  department_ids?: number[];
  group_ids?: number[];
};

export default function DepartmentRepartitionsPage() {
  const { data: departments = [] } = useDepartments();

  const departmentOptions = departments.map(({ id, name }) => ({
    label: name,
    value: id,
  }));
  return (
    <PageContainer>
      <ProTable<DepartmentRepartitionDetails, SearchParams>
        rowKey="id"
        columns={getColumns(departmentOptions)}
        request={getDepartmentRepartitions}
        pagination={{
          defaultPageSize: DEFAULT_PAGE_SIZE,
          showSizeChanger: true,
        }}
        search={{
          labelWidth: "auto",
          defaultCollapsed: true,
          searchText: "Filter",
        }}
        toolBarRender={() => [
          // Add any toolbar buttons here if needed
        ]}
        scroll={{ x: "max-content" }}
        form={{ syncToUrl: true }}
      />
    </PageContainer>
  );
}
