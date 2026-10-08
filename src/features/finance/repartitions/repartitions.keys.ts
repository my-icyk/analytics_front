import { financeRoot } from "../shared/keys";

export const repartitionKeys = {
  all: [...financeRoot, "repartitions"] as const,
  departments: () => [...repartitionKeys.all, "departments"] as const,
  byGroup: (groupId: number, params?: object) =>
    [...repartitionKeys.all, "group", groupId, params] as const,
};
