import { request } from "@umijs/max";
import type { PageResult } from "@/types/api";
import { FetchRolesParams, Role, RoleCreate, RoleUpdate } from "@/types/auth";

export function getRoles(params: FetchRolesParams) {
  return request<PageResult<Role>>("/api/v1/roles", { params });
}

export function createRole(data: RoleCreate) {
  return request("/api/v1/roles", {
    method: "POST",
    data,
  });
}

export function updateRole(id: number, data: RoleUpdate) {
  return request(`/api/v1/roles/${id}`, {
    method: "PUT",
    data,
  });
}

export function deleteRole(id: number) {
  return request(`/api/v1/roles/${id}`, {
    method: "DELETE",
  });
}
