/** Types for the "Users" feature. */

export type UserRole = "admin" | "user";
export type UserStatus = "active" | "disabled";

export type User = {
  id: number;
  username: string;
  is_admin: boolean;
  email: string;
  name: string;
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
};
