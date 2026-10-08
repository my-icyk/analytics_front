export type Department = {
  id: number;
  code: string;
  name: string;
};

export type DepartmentRepartition = {
  id: number;
  department_id: number;
  department_code: string;
  department_name: string;
  group_id: number;
  valid_from: string;
  valid_to: string | null;
};

export type DepartmentRepartitionCreate = {
  department_id: number;
  valid_from: string;
  valid_to: string | null;
};

export type DepartmentRepartitionUpdate = DepartmentRepartitionCreate;
