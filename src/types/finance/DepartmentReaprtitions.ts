import { TablePagination } from "../api";

export type DepartmentRepartitionDetails = {
  id: number;
  department_id: number;
  department_name: string;
  department_code: string;
  group_id: number;
  group_name: string;
  valid_from: string;
  valid_to: string | null;
  is_active: boolean;
  brand_name: string;
};

export type GetDepartmentRepartitionsParams = TablePagination & {
  department_ids?: number[];
  group_ids?: number[];
};
