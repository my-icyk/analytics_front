import { TablePagination } from "../api";

export type DepartmentRepartitionDetails = {
  id: number;
  department_id: number;
  department_name: string;
  group_id: number;
  group_name: string;
  valid_from: string;
  valid_to: string | null;
  is_active: boolean;
};

export type GetDepartmentRepartitionsParams = TablePagination & {
  department_ids?: number[];
  group_ids?: number[];
};
