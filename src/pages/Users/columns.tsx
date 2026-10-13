import type { ProColumns } from '@ant-design/pro-components';
import { Tag } from 'antd';
import type { User } from '@/types/user';

/** Table columns of the Users page, kept apart so index.tsx stays short. */
export const columns: ProColumns<User>[] = [
  { title: 'ID', dataIndex: 'id' },
  { title: 'Username', dataIndex: 'username' },
  {
    title: 'Admin',
    dataIndex: 'is_admin',
    render: (_, user) => <Tag color={user.is_admin ? 'gold' : 'default'}>{user.is_admin ? 'admin' : 'user'}</Tag>,
  },
];
