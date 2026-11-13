import { request } from "@umijs/max";
import type { LoginParams } from "@/types/auth";
import type { CurrentUser } from "@/types/user";

export function login(data: LoginParams) {
  return request<void>("/api/v1/auth/login", {
    method: "POST",
    data,
  });
}

export function logout() {
  return request<void>("/api/v1/auth/logout", {
    method: "POST",
  });
}

export function fetchCurrentUser(skipErrorHandler = false) {
  return request<CurrentUser>("/api/v1/users/me", { skipErrorHandler });
}
