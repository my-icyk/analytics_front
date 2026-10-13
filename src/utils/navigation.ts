import { HOME_PATH, LOGIN_PATH } from '@/constants/app';

/** Build "/login?redirect=/users" so we can come back after login. */
export function getLoginUrl(from?: string): string {
  if (!from || from === '/' || from.startsWith(LOGIN_PATH)) return LOGIN_PATH;
  return `${LOGIN_PATH}?redirect=${encodeURIComponent(from)}`;
}

/**
 * Read ?redirect= from the login URL.
 * Only same-site paths are accepted ("/users"), never "https://evil.com"
 * or "//evil.com", so the login page cannot be abused as an open redirect.
 */
export function getRedirectTarget(search: string): string {
  const redirect = new URLSearchParams(search).get('redirect');
  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect;
  }
  return HOME_PATH;
}
