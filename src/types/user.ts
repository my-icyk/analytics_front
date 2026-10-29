/** Types for the "Users" feature. */

import type { PermissionName } from "../../config/permissions";

export type UserRole = "admin" | "user";
export type UserStatus = "active" | "disabled";

export type User = {
  id: number;
  username: string;
  is_admin: boolean;
  email: string;
  name: string;
  is_active: boolean;
  created_at: string;
};

export type UserCreate = {
  username: string;
  password: string;
  email: string;
  name: string;
};

export type UserUpdate = {
  username: string;
  email: string;
  name: string;
  is_active: boolean;
};

export type PasswordReset = {
  new_password: string;
};

export type PasswordChange = {
  current_password: string;
  new_password: string;
};

export type EmployeeDetails = {
  departament_name: string | null;
  hire_date: string | null;
  work: string | null;
  birth_date: string | null;
  top_departament_name: string | null;
};

export type CurrentUser = {
  id: number;
  username: string;
  name: string;
  email: string;
  created_at: string;
  is_admin: boolean;

  roles: string[];
  permissions: PermissionName[];

  employee_details: EmployeeDetails | null;
};
