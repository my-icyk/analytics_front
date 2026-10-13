import type { RequestConfig, RequestInterceptorAxios } from '@umijs/max';

import { history } from '@umijs/max';
import { message } from 'antd';
import { LOGIN_PATH } from '@/constants/app';
import { getErrorMessage, getErrorStatus } from '@/utils/error';
import { getLoginUrl } from '@/utils/navigation';
import { clearToken, getToken } from '@/utils/token';
import qs from 'qs';

/** Adds "Authorization: Bearer <token>" to every call when logged in. */
const attachToken: RequestInterceptorAxios = (config) => {
  const token = getToken();
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }
  return config;
};

/**
 * Global rules for EVERY backend call made with `request` / `useRequest`.
 *  1. Attach the login token to each request.
 *  2. Handle errors in one place (so pages do not repeat it).
 */
export const requestConfig: RequestConfig = {
  timeout: 10_000,

  paramsSerializer: (params) =>
    qs.stringify(params, { arrayFormat: 'repeat' }),
  
  requestInterceptors: [attachToken],

  errorConfig: {
    errorHandler: (error: unknown) => {
      const status = getErrorStatus(error);
      const { pathname, search } = history.location;

      if (status === 401 && pathname !== LOGIN_PATH) {
        // Token missing / expired: forget it and go to login (come back after).
        clearToken();
        history.replace(getLoginUrl(pathname + search));
        return;
      }
      // Any other error (including a wrong password on the login page).
      message.error(getErrorMessage(error));
    },
  },
};
