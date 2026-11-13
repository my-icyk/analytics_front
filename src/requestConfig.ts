import type { RequestConfig } from "@umijs/max";
import { message } from "antd";
import qs from "qs";

import { LOGIN_PATH } from "@/constants/app";
import { getErrorMessage, getErrorStatus } from "@/utils/error";
import { getLoginUrl } from "@/utils/navigation";

export const requestConfig: RequestConfig = {
  timeout: 10_000,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),

  errorConfig: {
    errorHandler: (error: unknown) => {
      const status = getErrorStatus(error);
      const { pathname, search } = window.location;

      if (status === 401 && pathname !== LOGIN_PATH) {
        window.location.replace(getLoginUrl(pathname + search));
        return;
      }

      message.error(getErrorMessage(error));
    },
  },
};
