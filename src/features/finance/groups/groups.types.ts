import { Division } from "../divisions/divisions.types";

export type GroupType = {
  id: number;
  name: string;
};

export type Group = {
  id: number;
  name: string;
  division: Division;
  group_type: GroupType;
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

export type GroupFilterParams = {
  division_id?: number | number[];
  group_type_id?: number | number[];
  search?: string;
  limit?: number;
  offset?: number;
};
