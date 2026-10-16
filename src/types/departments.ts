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

export type RepartitionCreate = Omit<Repartition, "id">;
export type RepartitionUpdate = Repartition;
