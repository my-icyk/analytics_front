import type { Division } from "@/types/divisions";

export type GroupType = {
  id: number;
  name: string;
};

export type GroupTypeDetails = GroupType & {
  group_count: number;
};

export type Group = {
  id: number;
  name: string;
  division_id: number;
  division_name: string;
  group_type_id: number;
  group_type_name: string;
  is_active: boolean;
  rules_count: number;
  repartitions_count: number;
};

export type GroupPage = {
  items: Group[];
  total: number;
  limit: number;
  offset: number;
};

export type GroupCreate = {
  name: string;
  division_id: number;
  group_type_id: number;
};

export type GroupUpdate = GroupCreate;
//TODOl NEED I TO PLAC E LIMIT AND OFFSET DIFFERENTLY?
export type GroupFilterParams = {
  division_id?: number | number[];
  group_type_id?: number | number[];
  search?: string;
  limit?: number;
  offset?: number;
};

export type fetchGroupsParams = {
  limit?: number;
  offset?: number;
  group_type_ids?: number[];
  division_ids?: number[];
  search?: string;
};
