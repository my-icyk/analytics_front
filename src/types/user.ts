/** Types for the "Users" feature. */

export type UserRole = "admin" | "user";
export type UserStatus = "active" | "disabled";

export type User = {
  id: number;
  username: string;
  is_admin: boolean;
};
