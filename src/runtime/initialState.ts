import { fetchCurrentUser } from "@/services/auth";
import type { CurrentUser } from "@/types/user";
import { clearToken, getToken } from "@/utils/token";

/** Global state available everywhere via `useModel('@@initialState')`. */
export type InitialState = {
  currentUser?: CurrentUser;
};

/**
 * Runs ONCE when the app opens (and again on refresh).
 * If a token is stored, ask the backend who it belongs to.
 * No token, or an invalid one -> no currentUser -> the layout guard
 * (src/runtime/layout.tsx) sends the visitor to /login.
 */
export async function fetchInitialState(): Promise<InitialState> {
  if (!getToken()) return {};
  try {
    const currentUser = await fetchCurrentUser();
    return { currentUser };
  } catch {
    clearToken();
    return {};
  }
}
