import { request } from "@umijs/max";
import type { PageParams, PageResult } from "@/types/api";
import type { User, UserCreate, UserUpdate } from "@/types/user";
import type { LookupOption } from "@/types/common";
import { Role } from "@/types/auth";

const BASE = "/api/v1/users";

export function fetchUsers(params: PageParams) {
  return request<PageResult<User>>("/api/v1/users", { params });
}

export function getUser(user_id: number) {
  return request<User>(`${BASE}/${user_id}`);
}

export function deleteUser(user_id: number) {
  return request(`${BASE}/${user_id}`, {
    method: "DELETE",
  });
}

export function createUser(payload: UserCreate) {
  return request(BASE, {
    method: "POST",
    data: payload,
  });
}

export function updateUser(user_id: number, payload: UserUpdate) {
  return request(`${BASE}/${user_id}`, {
    method: "PUT",
    data: payload,
  });
}

export function getUserRoles(user_id: number) {
  return request<Role[]>(`/api/v1/users/${user_id}/roles`);
}

export const assignUserRoles = (userId: number, role_ids: number[]) =>
  request(`/api/v1/users/${userId}/roles`, {
    method: "PUT",
    data: { role_ids }, // use the same body style that fixed your permissions PUT
  });

export function lookupUsers(search?: string) {
  return request<LookupOption[]>("/api/v1/users/lookup", {
    params: { search },
  });
}
