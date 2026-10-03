import { request } from "../../../api/client";
import { FINANCE_API } from "../shared/endpoints";
import type {
  Division,
  DivisionCreate,
  DivisionUpdate,
} from "./divisions.types";

const DIVISIONS_ENDPOINT = `${FINANCE_API}/divisions`;

export function getDivisions() {
  return request<Division[]>(DIVISIONS_ENDPOINT);
}

export function createDivision(payload: DivisionCreate) {
  return request<Division>(DIVISIONS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateDivision(divisionId: number, payload: DivisionUpdate) {
  return request<Division>(`${DIVISIONS_ENDPOINT}/${divisionId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function removeDivision(divisionId: number) {
  return request<void>(`${DIVISIONS_ENDPOINT}/${divisionId}`, {
    method: "DELETE",
  });
}
