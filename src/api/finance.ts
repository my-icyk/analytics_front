import { request } from "./client";
import type {
  Division,
  DivisionCreate,
  DivisionUpdate,
  Group,
  GroupCreate,
  GroupType,
  GroupUpdate,
  Rule,
  RuleCreate,
  RuleUpdate,
  Target,
  TargetCreate,
  TargetUpdate,
} from "../types/finance";

const FINANCE_API = "/api/v1/finance";
const DIVISIONS_ENDPOINT = `${FINANCE_API}/divisions`;
const GROUPS_ENDPOINT = `${FINANCE_API}/groups`;
const RULES_ENDPOINT = `${FINANCE_API}/rules`;

export function getDivisions() {
  return request<Division[]>(DIVISIONS_ENDPOINT);
}

export function createDivision(payload: DivisionCreate) {
  return request<Division>(DIVISIONS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateDivision(divisionId: number, payload: DivisionUpdate) {
  return request<Division>(`${DIVISIONS_ENDPOINT}/${divisionId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function removeDivision(divisionId: number) {
  return request<void>(`${DIVISIONS_ENDPOINT}/${divisionId}`, {
    method: "DELETE",
  });
}

export function getGroupTypes() {
  return request<GroupType[]>(`${GROUPS_ENDPOINT}/types`);
}

export function getGroups() {
  return request<Group[]>(GROUPS_ENDPOINT);
}

export function getGroup(groupId: number) {
  return request<Group>(`${GROUPS_ENDPOINT}/${groupId}`);
}

export function createGroup(payload: GroupCreate) {
  return request<Group>(GROUPS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateGroup(groupId: number, payload: GroupUpdate) {
  return request<Group>(`${GROUPS_ENDPOINT}/${groupId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function removeGroup(groupId: number) {
  return request<void>(`${GROUPS_ENDPOINT}/${groupId}`, {
    method: "DELETE",
  });
}

export function getRules(groupId: number) {
  return request<Rule[]>(`${GROUPS_ENDPOINT}/${groupId}/rules`);
}

export function getRule(ruleId: number) {
  return request<Rule>(`${RULES_ENDPOINT}/${ruleId}`);
}

export function createRule(payload: RuleCreate) {
  return request<Rule>(RULES_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateRule(ruleId: number, payload: RuleUpdate) {
  return request<Rule>(`${RULES_ENDPOINT}/${ruleId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function removeRule(ruleId: number) {
  return request<void>(`${RULES_ENDPOINT}/${ruleId}`, {
    method: "DELETE",
  });
}

export function getTargets(ruleId: number) {
  return request<Target[]>(`${RULES_ENDPOINT}/${ruleId}/targets`);
}

export function assignTarget(ruleId: number, payload: TargetCreate) {
  return request<Target>(`${RULES_ENDPOINT}/${ruleId}/targets`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTarget(
  ruleId: number,
  targetId: number,
  payload: TargetUpdate,
) {
  return request<Target>(`${RULES_ENDPOINT}/${ruleId}/targets/${targetId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function revokeTarget(ruleId: number, targetId: number) {
  return request<void>(`${RULES_ENDPOINT}/${ruleId}/targets/${targetId}`, {
    method: "DELETE",
  });
}
