import { request } from "@umijs/max";
import type { LoginParams } from "@/types/auth";
import type { CurrentUser } from "@/types/user";

const BASE = "/api/v1/auth";

export function login(data: LoginParams) {
  return request<void>(`${BASE}/login`, {
    method: "POST",
    data,
  });
}

export function logout() {
  return request<void>(`${BASE}/logout`, {
    method: "POST",
  });
}

export function fetchCurrentUser(skipErrorHandler = false) {
  return request<CurrentUser>(`${BASE}/users/me`, { skipErrorHandler });
}
