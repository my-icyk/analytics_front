import { financeRoot } from "../shared/keys";

export const groupKeys = {
  all: [...financeRoot, "groups"] as const,
  lists: () => [...groupKeys.all, "list"] as const,
  list: (filters?: object) => [...groupKeys.lists(), filters ?? {}] as const,
  details: () => [...groupKeys.all, "detail"] as const,
  detail: (id: number) => [...groupKeys.details(), id] as const,
  types: () => [...groupKeys.all, "types"] as const,
};
