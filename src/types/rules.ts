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
