export type Division = {
  id: number;
  name: string;
  is_administrative: boolean;
  company_id: number;
  group_count: number;
};

export type DivisionCreate = {
  name: string;
  is_administrative: boolean;
  company_id: number;
};

export type DivisionUpdate = DivisionCreate;

export type Company = {
  id: number;
  name: string;
};
