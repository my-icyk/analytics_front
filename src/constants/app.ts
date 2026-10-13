/** App-wide constants. No logic here, only values used in several places. */

/** Key under which the login token is stored in localStorage. */
export const TOKEN_KEY = 'access_token';

/** The only public page. */
export const LOGIN_PATH = '/login';

/** Where a user lands after logging in (when no ?redirect= is present). */
export const HOME_PATH = '/';

/** Default page size for tables. */
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50];
