export type Rule = {
  id: number;
  name: string;
  group_name: string;
  valid_from: string;
  valid_to: string;
  percent_value: number;
};

export type RuleCreate = {
  name: string;
  valid_from: string;
  valid_to: string;
  percent_value: number;
};

export type RuleUpdate = {
  name?: string;
  valid_from?: string;
  valid_to?: string;
  percent_value?: number;
};

export type AllocationType = "STATIC" | "DIRECT" | "PROPORTIONAL";

export const ALLOCATION_OPTIONS: { value: AllocationType; label: string }[] = [
  { value: "STATIC", label: "Static" },
  { value: "DIRECT", label: "Direct" },
  { value: "PROPORTIONAL", label: "Proportional" },
];

// Fields the user can edit (what the API accepts)
export type TargetBase = {
  group_id: number; // the target group, not the group that owns the rule
  allocation_type: AllocationType;
  percent_value: number;
};

// What the server returns
export type Target = TargetBase & {
  id: number;
  rule_id: number;
  group_name: string;
};

export type TargetCreate = {
  group_id: number;
  allocation_type: AllocationType;
  percent_value: number;
};
export type TargetUpdate = TargetCreate;
