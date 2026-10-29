export type DepartmentRepartitionDetails = {
  id: number;
  department_id: number;
  department_name: string;
  group_id: number;
  valid_from: string;
  valid_to: string | null;
  is_active: boolean;
};

export type DepartmentRepartitionFilter = {
  department_ids?: number[];
  group_ids?: number[];
  limit?: number;
  offset?: number;
};
