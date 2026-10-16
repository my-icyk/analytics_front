import { request } from "@umijs/max";
import type { PageResult } from "@/types/api";
import type { Rule } from "@/types/rules";

import {
  fetchGroupsParams,
  Group,
  GroupCreate,
  GroupType,
  GroupUpdate,
} from "@/types/groups";
import type { Department, Repartition } from "@/types/departments";
import { LookupOption } from "@/types/common";

const BASE = "/api/v1/finance/groups";

export function fetchGroups(params: fetchGroupsParams) {
  return request<PageResult<Group>>(`${BASE}`, { params });
}

export function getGroup(id: number) {
  return request<Group>(`${BASE}/${id}`, {
    method: "GET",
  });
}

export function getDepartments() {
  return request<Department[]>(`${BASE}/departments`, {
    method: "GET",
  });
}

export function lookupDepartments(search: string) {
  return request<LookupOption[]>(`${BASE}/departments/lookup?search=${search}`);
}

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

export function updateGroup(id: number, data: GroupUpdate) {
  return request(`${BASE}/${id}`, {
    method: "PUT",
    data,
  });
}

export function getGroupTypes() {
  return request<GroupType[]>(`${BASE}/types`, {
    method: "GET",
  });
}

export function getRepartitions(id: number) {
  return request<Repartition[]>(`${BASE}/${id}/repartitions`, {
    method: "GET",
  });
}

export function getRules(id: number) {
  return request<Rule[]>(`${BASE}/${id}/rules`, {
    method: "GET",
  });
}
