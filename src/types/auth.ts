/** Types for login / current user. */

export type LoginParams = {
  username: string;
  password: string;
};

export type Role = {
  id: number;
  name: string;
  description: string | null;
  created_at: string; // ISO string, JSON has no Date type
};

export type RoleListItem = Role & {
  users_count: number;
  permissions_count: number;
};
export type FetchRolesParams = {
  page?: number;
  limit?: number;
  name?: string;
};

export type RoleCreate = {
  name: string;
  description?: string | null;
};

export type RoleUpdate = {
  name: string;
  description?: string | null;
};

export type Permission = {
  id: number;
  name: string;
};
