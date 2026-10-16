import { request } from "@umijs/max";
import type { PageResult } from "@/types/api";
import type { Rule } from "@/services/rules";

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

import type { Department, Repartition } from "@/types/deparments";

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
