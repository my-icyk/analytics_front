export type Division = {
  id: number;
  name: string;
  group_count: number;
};

export type DivisionCreate = {
  name: string;
};

export type DivisionUpdate = DivisionCreate;
