// hooks/useReferenceData.ts
import { getDivisions } from "@/services/divisions";
import { getGroupTypes, getRules } from "@/services/groups";
import { useRequest } from "ahooks";

const FIVE_MINUTES = 5 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

export function useDivisions() {
  return useRequest(getDivisions, {
    cacheKey: "finance-divisions",
    staleTime: ONE_HOUR,
  });
}

export function useGroupTypes() {
  return useRequest(getGroupTypes, {
    cacheKey: "finance-group-types",
    staleTime: Infinity,
  });
}

export function useRules() {
  return useRequest(getRules, {
    cacheKey: "finance-rules",
    staleTime: ONE_HOUR,
  });
}
