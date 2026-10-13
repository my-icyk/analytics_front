import { PageContainer, ProTable } from "@ant-design/pro-components";
import { DEFAULT_PAGE_SIZE } from "@/constants/app";
import { useAccess } from "@umijs/max";
import { fetchUsers } from "@/services/users";
import type { User } from "@/types/user";
import { getColumns } from "./columns";
import { useMemo } from "react";

/** Admin-only (see `access` in config/routes.ts). */
export default function UsersPage() {
  const access = useAccess();

  const columns = useMemo(() => getColumns(access), [access]);
  return (
    <PageContainer>
      <ProTable<User>
        rowKey="id"
        columns={columns}
        search={false} // no search form yet
        pagination={{ defaultPageSize: DEFAULT_PAGE_SIZE }}
        // ProTable calls this itself on load / page change and handles loading.
        request={async ({ current = 1, pageSize = DEFAULT_PAGE_SIZE }) => {
          const { data, total, success } = await fetchUsers({
            page: current,
            limit: pageSize,
          });
          return { data, total, success };
        }}
      />
    </PageContainer>
  );
}
