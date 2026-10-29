import { PageContainer, ProTable } from "@ant-design/pro-components";
import type { ProTableProps } from "@ant-design/pro-components";

import type { DepartmentRepartitionDetails } from "@/types/finance/DepartmentReaprtitions";
import { columns } from "./columns";
import { getDepartmentRepartitions } from "@/services/finance/DepartmentRepartitions";

const DEFAULT_PAGE_SIZE = 50;

// what the search form can send (must match the dataIndex of the search columns)
type SearchParams = {
  department_ids?: number[];
  group_ids?: number[];
};

const requestRepartitions: ProTableProps<
  DepartmentRepartitionDetails,
  SearchParams
>["request"] = async ({
  current = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  department_ids,
  group_ids,
}) => {
  const { data, total } = await getDepartmentRepartitions({
    limit: pageSize,
    offset: (current - 1) * pageSize,
    department_ids,
    group_ids,
  });

  return { data, total, success: true };
};

export default function DepartmentRepartitionsPage() {
  return (
    <PageContainer>
      <ProTable<DepartmentRepartitionDetails, SearchParams>
        rowKey="id"
        columns={columns}
        request={requestRepartitions}
        pagination={{
          defaultPageSize: DEFAULT_PAGE_SIZE,
          showSizeChanger: true,
        }}
        search={{ labelWidth: "auto", defaultCollapsed: false }}
        options={{ density: false, setting: true, reload: true }}
        toolBarRender={false}
        scroll={{ x: "max-content" }}
        form={{ syncToUrl: true }}
      />
    </PageContainer>
  );
}
