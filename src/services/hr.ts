import { request } from "@umijs/max";
import type {
  Employee,
  Credit,
  CreditFilters,
  CreditCreate,
  CreditUpdate,
  CreditPayOff,
  CreditCancel,
  EmployeeFilters,
} from "@/types/hr";
import type { PageQuery, PageResult } from "@/types/api";

const BASE = "/api/v1/hr/employees";

export function getEmployees(params: PageQuery & EmployeeFilters) {
  return request<PageResult<Employee>>(`${BASE}`, {
    params,
  });
}

export function getEmployee(employee_id: string) {
  return request<Employee>(`${BASE}/${employee_id}`);
}

export async function getCredits(
  employee_id: number,
  params: PageQuery & CreditFilters,
) {
  return request<PageResult<Credit>>(`${BASE}/${employee_id}/credits`, {
    params,
  });
}

export function getCredit(employee_id: number, credit_id: number) {
  return request<Credit>(`${BASE}/${employee_id}/credits/${credit_id}`);
}

/** Create a new credit */
export function createCredit(employee_id: number, payload: CreditCreate) {
  return request<Credit>(`${BASE}/${employee_id}/credits`, {
    method: "POST",
    data: payload,
  });
}

/** Update a credit */
export function updateCredit(
  employee_id: number,
  credit_id: number,
  payload: CreditUpdate,
) {
  return request<Credit>(`${BASE}/${employee_id}/credits/${credit_id}`, {
    method: "PUT",
    data: payload,
  });
}

/** Delete a credit */
export function deleteCredit(employee_id: number, credit_id: number) {
  return request(`${BASE}/${employee_id}/credits/${credit_id}`, {
    method: "DELETE",
  });
}

/** Pay off a credit */
export function payOffCredit(
  employee_id: number,
  credit_id: number,
  payload?: CreditPayOff,
) {
  return request<Credit>(
    `${BASE}/${employee_id}/credits/${credit_id}/pay-off`,
    {
      method: "POST",
      data: payload || {},
    },
  );
}

/** Cancel a credit */
export function cancelCredit(
  employee_id: number,
  credit_id: number,
  payload?: CreditCancel,
) {
  return request<Credit>(`${BASE}/${employee_id}/credits/${credit_id}/cancel`, {
    method: "POST",
    data: payload || {},
  });
}
