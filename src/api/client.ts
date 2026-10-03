const API_URL = (
  import.meta.env.VITE_API_URL_HOME ?? "http://localhost:8000"
).replace(/\/$/, "");
const ACCESS_TOKEN_KEY = "access_token";

function readStoredAccessToken() {
  try {
    return typeof window === "undefined"
      ? null
      : window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

let accessToken: string | null = readStoredAccessToken();
let refreshPromise: Promise<boolean> | null = null;
let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(handler: (() => void) | null) {
  onSessionExpired = handler;
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  if (response.status === 401 && retry && path !== "/api/v1/auth/refresh") {
    if (await refreshAccessToken()) return request<T>(path, options, false);
  }
  if (!response.ok) {
    const detail = (await response.json().catch(() => null)) as {
      detail?: string;
    } | null;
    throw new Error(detail?.detail || `Request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function loginRequest(username: string, password: string) {
  const tokens = await request<{ access_token: string; token_type: string }>(
    "/api/v1/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ username, password }),
    },
    false,
  );
  setAccessToken(tokens.access_token);
  return tokens;
}

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = request<{ access_token: string; token_type: string }>(
      "/api/v1/auth/refresh",
      { method: "POST" },
      false,
    )
      .then((tokens) => {
        setAccessToken(tokens.access_token);
        return true;
      })
      .catch(() => {
        setAccessToken(null);
        onSessionExpired?.();
        return false;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function logoutRequest() {
  await request<void>("/api/v1/auth/logout", { method: "POST" }, false).catch(
    () => undefined,
  );
  setAccessToken(null);
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  try {
    if (typeof window !== "undefined") {
      if (token) window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
      else window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch {
    // Keep the in-memory session working if browser storage is unavailable.
  }
}

export function hasAccessToken() {
  return accessToken !== null;
}
