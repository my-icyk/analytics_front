import { request } from "@umijs/max";
import type {
  Procedure,
  ProcedureCreate,
  ProcedureHistory,
  ProcedureUpdate,
} from "@/types/analytics";
import type { CreateResponse } from "@/types/common";

const BASE = "/api/v1/analytics/procedures";

// export function getProcedures() {
//   return request<Procedure[]>(BASE);
// }

export async function getProcedures() {
  const data = await request<Procedure[]>(BASE);
  return { data };
}

export function getProcedure(id: number) {
  return request<Procedure>(`${BASE}/${id}`);
}

export function createProcedure(data: ProcedureCreate) {
  return request<CreateResponse>(BASE, {
    method: "POST",
    data,
  });
}

export function updateProcedure(id: number, data: ProcedureUpdate) {
  return request<void>(`${BASE}/${id}`, {
    method: "PUT",
    data,
  });
}

export function deleteProcedure(id: number) {
  return request<void>(`${BASE}/${id}`, {
    method: "DELETE",
  });
}

export function getProcedureHistory(id: number) {
  return request<ProcedureHistory[]>(`${BASE}/${id}/history`);
}

// TODO: NEED TO IMPLEMENT JOB TRACKING FOR RUNNING PROCEDURE
export function runProcedure(id: number) {
  return request<void>(`${BASE}/${id}/run`, {
    method: "POST",
  });
}
