import { request } from "@umijs/max";
import type { LoginParams, LoginResult, RefreshResponse } from "@/types/auth";
import { CurrentUser } from "@/types/user";

/**
 * SERVICES = plain functions that talk to the backend. Nothing else.
 * No React, no hooks here. Pages call these through `useRequest`
 * (loading, error, cache) or through ProTable's `request` prop.
 */

export function login(params: LoginParams) {
  return request<LoginResult>("/api/v1/auth/login", {
    method: "POST",
    data: params,
  });
}

export function logout() {
  // skipErrorHandler: we log out locally even if this call fails
  return request<void>("/api/v1/auth/logout", {
    method: "POST",
    skipErrorHandler: true,
  });
}

/** Who am I? Also used to check that the stored token is still valid. */
export function fetchCurrentUser() {
  return request<CurrentUser>("/api/v1/users/me");
}

export function refreshAccessToken() {
  return request<RefreshResponse>("/api/v1/auth/refresh", {
    method: "POST",
    credentials: "include",
    skipErrorHandler: true,
  });
}
