/** Types for login / current user. */
import type { Permission } from '../../config/permissions';
export type CurrentUser = {
  id: number;
  username: string;
  is_admin: boolean;
  /** Drives permissions, see src/access.ts */
  roles: string[];
  permissions: Permission[];
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