/** Types for HR module (Employees, Credits) */

import { TablePagination } from "./api";

export type Employee = {
  id: number;
  name: string;
  employee_ref: string;
  department_name: string;
  user_principal_name: string;
  fiscal_code: string;
  user_name: string;
  purchase_limit: string;
};

export type EmployeePageResult = {
  data: Employee[];
  total: number;
};

export type EmployeeInfo = {
  id: number;
  name: string;
  employee_ref: string;
  department_name: string;
};

export type Credit = {
  id: number;
  employee_id: number;
  employee: EmployeeInfo;
  credit_amount: string; // Large decimal as string
  nr_months: number;
  start_month: string; // ISO date
  status: "active" | "completed" | "cancelled" | "paid_off";
  paid_off_on?: string | null; // ISO date
  comments?: string;
  created_at: string; // ISO timestamp
  created_by: number;
  updated_at: string; // ISO timestamp
};

export type CreditListResponse = {
  items: Credit[];
  total: number;
  limit: number;
  offset: number;
};

export type CreditFilters = {
  status?: "active" | "completed" | "cancelled" | "paid_off";
};

export type CreditPageResult = {
  data: Credit[];
  total: number;
};

export type CreditCreate = {
  credit_amount: number | string;
  nr_months: number;
  start_month: string;
  comments?: string;
};

export type CreditUpdate = {
  credit_amount?: number | string;
  nr_months?: number;
  start_month?: string;
  comments?: string;
};

export type CreditPayOff = {
  paid_off_on?: string;
};

export type CreditCancel = {
  reason?: string;
};

export type EmployeeFilters = {
  search?: string;
};
