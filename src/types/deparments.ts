export type Department = {
  id: number;
  name: string;
  code: string;
  brand: string;
};

export type Repartition = {
  id: number;
  department_id: number;
  department_code: string;
  department_name: string;
  group_id: number;
  valid_from: string;
  valid_to: string;
};

export type RepartitionCreate = Omit<Repartition, "id">;
export type RepartitionUpdate = Repartition;
