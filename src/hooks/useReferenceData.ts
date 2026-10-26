// hooks/useReferenceData.ts
import { getDivisions } from "@/services/divisions";
import { getGroupTypes, getRules, getDepartments } from "@/services/groups";
import { getPermissions, getRoles } from "@/services/roles";
import { useRequest, clearCache } from "ahooks";

const FIVE_MINUTES = 5 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

const CACHE_KEYS = {
  divisions: "finance-divisions",
  groupTypes: "finance-group-types",
  rules: "finance-rules",
  departments: "finance-departments",
  permissions: "auth-permissions",
  roles: "auth-roles",
};

export function useDivisions() {
  const { refresh, ...rest } = useRequest(getDivisions, {
    cacheKey: CACHE_KEYS.divisions,
    staleTime: ONE_HOUR,
  });

  // forces a real refetch even while the cache is still fresh
  const hardRefresh = () => {
    clearCache(CACHE_KEYS.divisions);
    return refresh();
  };

  return { ...rest, hardRefresh };
}

export function useGroupTypes() {
  return useRequest(getGroupTypes, {
    cacheKey: CACHE_KEYS.groupTypes,
    staleTime: Infinity,
  });
}

export function useRules() {
  return useRequest(getRules, {
    cacheKey: CACHE_KEYS.rules,
    staleTime: ONE_HOUR,
  });
}

export function useDepartments() {
  return useRequest(getDepartments, {
    cacheKey: CACHE_KEYS.departments,
    staleTime: Infinity,
  });
}

export function usePermissions() {
  return useRequest(getPermissions, {
    cacheKey: CACHE_KEYS.permissions,
    staleTime: Infinity,
  });
}

export function useRoles() {
  return useRequest(getRoles, {
    cacheKey: CACHE_KEYS.roles,
    staleTime: FIVE_MINUTES,
  });
}
