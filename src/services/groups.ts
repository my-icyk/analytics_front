import { request } from "@umijs/max";
import type { PageResult } from "@/types/api";
import {
  fetchGroupsParams,
  Group,
  GroupCreate,
  GroupType,
} from "@/types/groups";

const BASE = "/api/v1/finance/groups";

export function fetchGroups(params: fetchGroupsParams) {
  return request<PageResult<Group>>(`${BASE}`, { params });
}

export function getDepartments() {
  return request<Department[]>(`${BASE}/departments`, {
    method: "GET",
  });
}

import type { Department } from "@/types/deparments";

export function deleteGroup(id: number) {
  return request(`${BASE}/${id}`, {
    method: "DELETE",
  });
}

export function createGroup(data: GroupCreate) {
  return request(`${BASE}`, {
    method: "POST",
    data,
  });
}

export function getGroupTypes() {
  return request<GroupType[]>(`${BASE}/types`, {
    method: "GET",
  });
}
