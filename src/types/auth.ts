/** Types for login / current user. */
import type { PermissionName } from "../../config/permissions";
export type CurrentUser = {
  id: number;
  username: string;
  is_admin: boolean;
  /** Drives permissions, see src/access.ts */
  roles: string[];
  permissions: PermissionName[];
};

export type LoginParams = {
  username: string;
  password: string;
};

export type LoginResult = {
  access_token: string;
};

export type RefreshResponse = {
  access_token: string;
  token_type: string;
};

export type Role = {
  id: number;
  name: string;
  description: string | null;
  // created_at: string;
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
