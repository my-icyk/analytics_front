import { PageContainer, ProTable } from '@ant-design/pro-components';
import { DEFAULT_PAGE_SIZE } from '@/constants/app';
import { fetchUsers } from '@/services/users';
import type { User } from '@/types/user';
import { columns } from './columns';

/** Admin-only (see `access` in config/routes.ts). */
export default function UsersPage() {
  return (
    <PageContainer>
      <ProTable<User>
        rowKey="id"
        columns={columns}
        search={false} // no search form yet
        pagination={{ pageSize: DEFAULT_PAGE_SIZE }}
        // ProTable calls this itself on load / page change and handles loading.
        request={async ({ current = 1, pageSize = DEFAULT_PAGE_SIZE }) => {
          const { list, total } = await fetchUsers({ page: current, pageSize });
          return { data: list, total, success: true };
        }}
      />
    </PageContainer>
  );
}
