export type AllocationType = "STATIC" | "DIRECT" | "PROPORTIONAL";

export type Division = {
  id: number;
  name: string;
};

export type DivisionCreate = {
  name: string;
};

export type DivisionUpdate = DivisionCreate;

export type GroupType = {
  id: number;
  name: string;
};

export type Group = {
  id: number;
  name: string;
  division: Division;
  group_type: GroupType;
};

export type GroupCreate = {
  name: string;
  division_id: number;
  group_type_id: number;
};

export type GroupUpdate = GroupCreate;

export type GroupFilterParams = {
  id?: number | number[];
  division_id?: number | number[];
  group_type_id?: number | number[];
  search?: string;
};

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
