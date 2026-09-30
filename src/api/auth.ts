import type { CurrentUserResponse, User } from "../types/auth/user";
import {
  hasAccessToken,
  loginRequest,
  logoutRequest,
  refreshAccessToken,
  request,
  setAccessToken,
} from "./client";

export async function login(username: string, password: string) {
  const tokens = await loginRequest(username, password);
  setAccessToken(tokens.access_token);
  return getCurrentUser();
}

export async function logout() {
  await logoutRequest();
  setAccessToken(null);
}

export async function getCurrentUser() {
  return request<CurrentUserResponse>("/api/v1/users/me");
}

export async function refreshSession() {
  return refreshAccessToken();
}

export { hasAccessToken };

export type { User, CurrentUserResponse };
