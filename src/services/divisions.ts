import { LookupOption } from "@/types/common";
import { Division } from "@/types/divisions";
import { request } from "@umijs/max";

const BASE = "/api/v1/finance/divisions";

export function getDivisions() {
  return request<Division[]>(BASE, {
    method: "GET",
  });
}

export function createDivision(data: { name: string }) {
  return request<Division>(BASE, {
    method: "POST",
    data,
  });
}

export function updateDivision(id: number, data: { name: string }) {
  return request<Division>(`${BASE}/${id}`, {
    method: "PUT",
    data,
  });
}

export function deleteDivision(id: number) {
  return request<Division>(`${BASE}/${id}`, {
    method: "DELETE",
  });
}

export function lookupDivisions(search?: string) {
  return request<LookupOption[]>(`${BASE}/lookup`, {
    params: { search },
  });
}
