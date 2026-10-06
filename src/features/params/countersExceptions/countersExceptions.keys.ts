import { paramsRoot } from "../shared/keys";
import type { ExceptionListParams } from "./countersExceptions.api";

export const counterKeys = {
  all: [...paramsRoot, "counters"] as const,
  lists: () => [...counterKeys.all, "list"] as const,
  list: (filters?: object) => [...counterKeys.lists(), filters ?? {}] as const,
};

export const exceptionKeys = {
  all: [...paramsRoot, "counter-exceptions"] as const,
  lists: () => [...exceptionKeys.all, "list"] as const,
  list: (params: ExceptionListParams) =>
    [...exceptionKeys.lists(), params] as const,
  details: () => [...exceptionKeys.all, "detail"] as const,
  detail: (id: number) => [...exceptionKeys.details(), id] as const,
};
