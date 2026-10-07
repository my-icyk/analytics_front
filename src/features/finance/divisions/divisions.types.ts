export type Division = {
  id: number;
  name: string;
};

export type DivisionCreate = {
  name: string;
};

export type DivisionUpdate = DivisionCreate;

export type DivisionDetails = {
  id: number;
  name: string;
  group_count: number;
};
