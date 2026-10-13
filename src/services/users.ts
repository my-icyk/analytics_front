import { request } from '@umijs/max';
import type { PageParams, PageResult } from '@/types/api';
import type { User } from '@/types/user';

export function fetchUsers(params: PageParams) {
  return request<PageResult<User>>('/api/v1/users', { params });
}
