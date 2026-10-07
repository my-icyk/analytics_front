export type AllocationType = "STATIC" | "DIRECT" | "PROPORTIONAL";

export type Division = {
  id: number;
  name: string;
};

export type DivisionCreate = {
  name: string;
};

export type DivisionUpdate = DivisionCreate;

export type Rule = {
  id: number;
  name: string;
  group_id: number;
  valid_from: string;
  valid_to: string | null;
  percent_value: number;
};

export type RuleCreate = {
  name: string;
  group_id: number;
  valid_from: string;
  valid_to: string | null;
  percent_value: number;
};

export type RuleUpdate = RuleCreate;

export type Target = {
  id: number;
  rule_id: number;
  group_id: number;
  allocation_type: AllocationType;
  percent_value: number | null;
};
export type TargetCreate = {
  rule_id: number;
  group_id: number;
  allocation_type: AllocationType;
  percent_value: number | null;
};

export type TargetUpdate = TargetCreate;

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
  group_id: number;
  valid_from: string;
  valid_to: string | null;
};

export type DepartmentRepartitionUpdate = DepartmentRepartitionCreate;

export type Department = {
  id: number;
  code: string;
  name: string;
};
