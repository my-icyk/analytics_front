import { request } from "../../../api/client";
import { FINANCE_API } from "../shared/endpoints";
import {
  Department,
  DepartmentRepartition,
  DepartmentRepartitionCreate,
  DepartmentRepartitionUpdate,
} from "./repartitions.types";

const GROUPS_ENDPOINT = `${FINANCE_API}/groups`;

export function getDepartments() {
  return request<Department[]>(`${GROUPS_ENDPOINT}/departments`);
}

export function getDepartmentRepartitions(groupId: number) {
  return request<DepartmentRepartition[]>(
    `${GROUPS_ENDPOINT}/${groupId}/departments`,
  );
}

export function assignDepartmentRepartition(
  groupId: number,
  payload: DepartmentRepartitionCreate,
) {
  return request<DepartmentRepartition>(
    `${GROUPS_ENDPOINT}/${groupId}/departments`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export function updateDepartmentRepartition(
  groupId: number,
  repartitionId: number,
  payload: DepartmentRepartitionUpdate,
) {
  return request<DepartmentRepartition>(
    `${GROUPS_ENDPOINT}/${groupId}/departments/${repartitionId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
}

export function revokeDepartmentRepartition(
  groupId: number,
  repartitionId: number,
) {
  return request<void>(
    `${GROUPS_ENDPOINT}/${groupId}/departments/${repartitionId}`,
    {
      method: "DELETE",
    },
  );
}
