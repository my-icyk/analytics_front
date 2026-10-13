import { request } from '@umijs/max';
import type { PageResult } from '@/types/api';
import { fetchGroupsParams, Group, GroupCreate } from '@/types/groups';


export function fetchGroups(params: fetchGroupsParams) {
  return request<PageResult<Group>>('/api/v1/finance/groups', { params });
}

export function deleteGroup(id: number) {
  return request(`/api/v1/finance/groups/${id}`, {
    method: 'DELETE',
  });
}

export function createGroup(data: GroupCreate) {
  return request('/api/v1/finance/groups', {
    method: 'POST',
    data,
  });
}