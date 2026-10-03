import { financeRoot } from "../shared/keys";

export const divisionKeys = {
  all: [...financeRoot, "divisions"] as const,
  lists: () => [...divisionKeys.all, "list"] as const,
  list: (filters?: object) => [...divisionKeys.lists(), filters ?? {}] as const,
  details: () => [...divisionKeys.all, "detail"] as const,
  detail: (id: number) => [...divisionKeys.details(), id] as const,
};
