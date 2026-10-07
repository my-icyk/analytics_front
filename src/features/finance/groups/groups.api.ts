import { request } from "../../../api/client";
import { FINANCE_API } from "../shared/endpoints";
import type {
  GroupType,
  GroupTypeDetails,
  Group,
  GroupCreate,
  GroupUpdate,
  GroupPage,
  GroupFilterParams,
} from "./groups.types";

const GROUPS_ENDPOINT = `${FINANCE_API}/groups`;

export function getGroupTypes() {
  return request<GroupTypeDetails[]>(`${GROUPS_ENDPOINT}/types`);
}

//TODO: review that function
export function getGroups(filters?: GroupFilterParams) {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.division_id !== undefined) {
      const ids = Array.isArray(filters.division_id)
        ? filters.division_id
        : [filters.division_id];
      ids.forEach((id) => params.append("division_ids", String(id)));
    }
    if (filters.group_type_id !== undefined) {
      const ids = Array.isArray(filters.group_type_id)
        ? filters.group_type_id
        : [filters.group_type_id];
      ids.forEach((id) => params.append("group_type_ids", String(id)));
    }
    if (filters.search && filters.search.trim()) {
      params.set("search", filters.search.trim());
    }
    if (filters.limit !== undefined) {
      params.set("limit", String(filters.limit));
    }
    if (filters.offset !== undefined) {
      params.set("offset", String(filters.offset));
    }
  }
  const queryString = params.toString();
  return request<GroupPage>(
    `${GROUPS_ENDPOINT}${queryString ? `?${queryString}` : ""}`,
  );
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
