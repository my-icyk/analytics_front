import { PageContainer, ProTable } from "@ant-design/pro-components";

import type { DepartmentRepartitionDetails } from "@/types/finance/DepartmentReaprtitions";
import { columns } from "./columns";
import { getDepartmentRepartitions } from "@/services/finance/DepartmentRepartitions";
import { DEFAULT_PAGE_SIZE } from "@/constants/app";

// what the search form can send (must match the dataIndex of the search columns)
type SearchParams = {
  department_ids?: number[];
  group_ids?: number[];
};

// const requestRepartitions: ProTableProps<
//   DepartmentRepartitionDetails,
//   SearchParams
// >["request"] = async ({
//   current = 1,
//   pageSize = DEFAULT_PAGE_SIZE,
//   department_ids,
//   group_ids,
// }) => {
//   const { data, total } = await getDepartmentRepartitions({
//     limit: pageSize,
//     offset: (current - 1) * pageSize,
//     department_ids,
//     group_ids,
//   });

//   return { data, total, success: true };
// };

export default function DepartmentRepartitionsPage() {
  return (
    <PageContainer>
      <ProTable<DepartmentRepartitionDetails, SearchParams>
        rowKey="id"
        columns={columns}
        request={getDepartmentRepartitions}
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
