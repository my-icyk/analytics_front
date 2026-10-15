import { request } from "@umijs/max";
import type { PageParams, PageResult } from "@/types/api";
import type { User } from "@/types/user";
import type { LookupOption } from "@/types/common";
import { Role } from "@/types/auth";

export function fetchUsers(params: PageParams) {
  return request<PageResult<User>>("/api/v1/users", { params });
}

export function getUserRoles(user_id: number) {
  return request<Role[]>(`/api/v1/users/${user_id}/roles`);
}

export function addUserRole(user_id: number, role_id: number) {
  return request(`/api/v1/users/${user_id}/roles/${role_id}`, {
    method: "POST",
  });
}

export function removeUserRole(user_id: number, role_id: number) {
  return request(`/api/v1/users/${user_id}/roles/${role_id}`, {
    method: "DELETE",
  });
}
export function usersLookup(search?: string) {
  return request<LookupOption[]>("/api/v1/users/lookup", {
    params: { search },
  });
}
