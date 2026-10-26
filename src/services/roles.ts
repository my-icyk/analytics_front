import { request } from "@umijs/max";
import type { PageResult } from "@/types/api";
import {
  FetchRolesParams,
  Permission,
  Role,
  RoleCreate,
  RoleUpdate,
} from "@/types/auth";

export function getRoles(params: FetchRolesParams) {
  return request<PageResult<Role>>("/api/v1/roles", { params });
}

export function getRole(id: number) {
  return request<Role>(`/api/v1/roles/${id}`);
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

export function getPermissions() {
  return request("/api/v1/permissions");
}
export function permissionsLookup(search: string) {
  return request(`/api/v1/permissions/lookup?search=${search}`);
}

export function getRolePermissions(roleId: number) {
  return request<Permission[]>(`/api/v1/roles/${roleId}/permissions`);
}

export function assignRolePermissions(
  role_id: number,
  permission_ids: number[],
) {
  return request(`/api/v1/roles/${role_id}/permissions`, {
    method: "PUT",
    data: { permission_ids },
  });
}

export function rolesLookup(search: string) {
  return request(`/api/v1/roles/lookup?search=${search}`);
}
