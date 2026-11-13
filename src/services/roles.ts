import { request } from "@umijs/max";
import type { PageResult } from "@/types/api";
import {
  FetchRolesParams,
  Permission,
  RoleListItem,
  RoleCreate,
  RoleUpdate,
} from "@/types/auth";

const PERMISSIONS = "/api/v1/auth/permissions";
const ROLES = "/api/v1/auth/roles";

export function getRoles(params: FetchRolesParams) {
  return request<RoleListItem[]>(ROLES, { params });
}

export function getRole(id: number) {
  return request<RoleListItem>(`${ROLES}/${id}`);
}

export function createRole(data: RoleCreate) {
  return request(ROLES, {
    method: "POST",
    data,
  });
}

export function updateRole(id: number, data: RoleUpdate) {
  return request(`${ROLES}/${id}`, {
    method: "PUT",
    data,
  });
}

export function deleteRole(id: number) {
  return request(`${ROLES}/${id}`, {
    method: "DELETE",
  });
}

export function getPermissions() {
  return request(PERMISSIONS);
}
export function permissionsLookup(search: string) {
  return request(`${PERMISSIONS}/lookup?search=${search}`);
}

export function getRolePermissions(roleId: number) {
  return request<Permission[]>(`${ROLES}/${roleId}/permissions`);
}

export function assignRolePermissions(
  role_id: number,
  permission_ids: number[],
) {
  return request(`${ROLES}/${role_id}/permissions`, {
    method: "PUT",
    data: { permission_ids },
  });
}

export function rolesLookup(search: string) {
  return request(`${ROLES}/lookup?search=${search}`);
}
