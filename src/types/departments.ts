export type Department = {
  id: number;
  name: string;
  code: string;
  brand: string;
};

export type Repartition = {
  id: number;
  department: string;
  valid_from: string;
  valid_to: string;
  is_active: boolean;
};

export type RepartitionCreate = {
  department_id: number;
  group_id: number;
  valid_from: string;
  valid_to: string;
};

export type RepartitionUpdate = {
  id: number;
  department_id: number;
  group_id: number;
  valid_from: string;
  valid_to: string;
};
