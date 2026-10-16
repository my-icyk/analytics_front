import { request } from "@umijs/max";
import { RepartitionCreate, RepartitionUpdate } from "@/types/departments";

const BASE = "/api/v1/finance/groups";

export function createRepartition(
  group_id: number,
  payload: RepartitionCreate,
) {
  return request(`${BASE}/${group_id}/repartitions`, {
    method: "POST",
    data: payload,
  });
}

export function updateRepartition(
  group_id: number,
  repartition_id: number,
  payload: RepartitionUpdate,
) {
  return request(`${BASE}/${group_id}/repartitions/${repartition_id}`, {
    method: "PUT",
    data: payload,
  });
}

export function deleteRepartition(group_id: number, repartition_id: number) {
  return request(`${BASE}/${group_id}/repartitions/${repartition_id}`, {
    method: "DELETE",
  });
}
