import { TOKEN_KEY } from '@/constants/app';

/**
 * The ONLY file that touches the token in localStorage.
 * Everything else calls these three functions.
 *
 * Every access is wrapped in try/catch because localStorage can throw
 * (private mode, blocked site data).
 */

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore: the user will simply have to log in again next time
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}
