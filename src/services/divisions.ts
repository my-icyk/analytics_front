import {
  Division,
  DivisionCreate,
  DivisionUpdate,
  Company,
} from "@/types/divisions";
import { request } from "@umijs/max";

const BASE = "/api/v1/finance/divisions";

export function getCompanies() {
  return request<Company[]>("/api/v1/finance/companies", {
    method: "GET",
  });
}

export function getDivisions() {
  return request<Division[]>(BASE, {
    method: "GET",
  });
}

export function createDivision(data: DivisionCreate) {
  return request<Division>(BASE, {
    method: "POST",
    data,
  });
}

export function updateDivision(id: number, data: DivisionUpdate) {
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
