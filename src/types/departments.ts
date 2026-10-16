export type Department = {
  id: number;
  name: string;
  code: string;
  brand: string;
};

export type Repartition = {
  id: number;
  department_id: number;
  department_name: string;
  valid_from: string;
  valid_to: string | null;
  is_active: boolean;
};

export type RepartitionCreate = {
  department_id: number;
  valid_from: string;
  valid_to: string | null;
};

export type RepartitionUpdate = {
  id: number;
  department_id: number;
  valid_from: string;
  valid_to: string | null;
};
