import type { RequestConfig, RequestInterceptorAxios } from "@umijs/max";
import { history, request } from "@umijs/max";
import { message } from "antd";
import qs from "qs";
import { LOGIN_PATH } from "@/constants/app";
import { getErrorMessage, getErrorStatus } from "@/utils/error";
import { getLoginUrl } from "@/utils/navigation";
import { clearToken, getToken, setToken } from "@/utils/token";
import { refreshAccessToken } from "@/services/auth";

const attachToken: RequestInterceptorAxios = (config) => {
  const token = getToken();
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }
  return config;
};

// one shared refresh call for all parallel 401s
let refreshing: Promise<string> | null = null;

const getNewToken = async () => {
  const res = await refreshAccessToken();
  setToken(res.access_token);
  return res.access_token;
};
export const requestConfig: RequestConfig = {
  timeout: 10_000,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
  requestInterceptors: [attachToken],

  responseInterceptors: [
    [
      (response) => response,
      (async (error: any) => {
        const original = error.config;

        if (
          error.response?.status === 401 &&
          !original?._retry &&
          !original?.url?.includes("/auth/")
        ) {
          original._retry = true;
          try {
            refreshing =
              refreshing || getNewToken().finally(() => (refreshing = null));
            const newToken = await refreshing;
            original.headers = {
              ...original.headers,
              Authorization: `Bearer ${newToken}`,
            };
            return request(original.url, { ...original, getResponse: true }); // retry
          } catch {
            // refresh failed -> errorHandler logs out
          }
        }
        return Promise.reject(error);
      }) as any,
    ],
  ],

  errorConfig: {
    errorHandler: (error: unknown) => {
      const status = getErrorStatus(error);
      const { pathname, search } = history.location;

      if (status === 401 && pathname !== LOGIN_PATH) {
        clearToken();
        history.replace(getLoginUrl(pathname + search));
        return;
      }
      message.error(getErrorMessage(error));
    },
  },
};
