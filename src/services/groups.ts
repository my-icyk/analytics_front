import { request } from "@umijs/max";
import { getPage } from "@/utils/api";
import type { PageResult } from "@/types/api";
import type {
  Rule,
  RuleCreate,
  RuleUpdate,
  Target,
  TargetCreate,
  TargetUpdate,
} from "@/types/rules";

import {
  getGroupsParams,
  Group,
  GroupCreate,
  GroupType,
  GroupUpdate,
} from "@/types/groups";
import type { Department, Repartition } from "@/types/departments";
import { LookupOption } from "@/types/common";

const BASE = "/api/v1/finance/groups";

export function getGroups(params: getGroupsParams) {
  return getPage<Group, getGroupsParams>(BASE, params);
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

export function lookupGroups(search: string) {
  return request<LookupOption[]>(`${BASE}/lookup?search=${search}`);
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

export function createRule(groupId: number, data: RuleCreate) {
  return request(`${BASE}/${groupId}/rules`, {
    method: "POST",
    data,
  });
}

export function updateRule(groupId: number, ruleId: number, data: RuleUpdate) {
  return request(`${BASE}/${groupId}/rules/${ruleId}`, {
    method: "PUT",
    data,
  });
}

export function deleteRule(groupId: number, ruleId: number) {
  return request(`${BASE}/${groupId}/rules/${ruleId}`, {
    method: "DELETE",
  });
}

const url = (groupId: number, ruleId: number, targetId?: number) =>
  `${BASE}/${groupId}/rules/${ruleId}/targets${targetId ? `/${targetId}` : ""}`;

export function getTargets(groupId: number, ruleId: number) {
  return request<Target[]>(url(groupId, ruleId), { method: "GET" });
}

export function createTarget(
  groupId: number,
  ruleId: number,
  data: TargetCreate,
) {
  return request<Target>(url(groupId, ruleId), { method: "POST", data });
}

export function updateTarget(
  groupId: number,
  ruleId: number,
  targetId: number,
  data: TargetUpdate,
) {
  return request<Target>(url(groupId, ruleId, targetId), {
    method: "PUT",
    data,
  });
}

export function deleteTarget(
  groupId: number,
  ruleId: number,
  targetId: number,
) {
  return request(url(groupId, ruleId, targetId), { method: "DELETE" });
}
