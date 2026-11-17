// hooks/useReferenceData.ts

import { getCompanies, getDivisions } from "@/services/divisions";
import {
  getGroupTypes,
  getRules,
  getDepartments,
  getGroupFolders,
} from "@/services/groups";
import { getPermissions, getRoles } from "@/services/roles";
import { getUsers } from "@/services/users";
import { useRequest } from "@umijs/max";
import { useMemo } from "react";

const FIVE_MINUTES = 5 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

const CACHE_KEYS = {
  divisions: "finance-divisions",
  groupTypes: "finance-group-types",
  rules: "finance-rules",
  departments: "finance-departments",
  permissions: "auth-permissions",
  roles: "auth-roles",
  users: "auth-users",
  me: "auth-me",
  companies: "finance-companies",
  folderGroups: "finance-folder-groups",
};

export function useCompanies() {
  return useRequest(getCompanies, {
    cacheKey: CACHE_KEYS.companies,
    staleTime: Infinity,
  });
}

export function useFolderGroups() {
  return useRequest(getGroupFolders, {
    cacheKey: CACHE_KEYS.folderGroups,
    staleTime: Infinity,
  });
}

export function useDivisions() {
  return useRequest(getDivisions, {
    cacheKey: CACHE_KEYS.divisions,
    staleTime: ONE_HOUR,
  });
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

export function useDepartmentOptions() {
  const { data, loading } = useDepartments();

  const options = useMemo(
    () =>
      (data ?? []).map(({ id, name, brand, code }) => {
        const title = name?.trim() || `Department #${id}`;
        const subtitle = [brand?.trim(), code?.trim()]
          .filter(Boolean)
          .join(" · ");

        return {
          value: id,
          title,
          subtitle,
          label: title,
        };
      }),
    [data],
  );

  return { options, loading };
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
    staleTime: ONE_HOUR,
  });
}

export function useUsers() {
  return useRequest(getUsers, {
    cacheKey: CACHE_KEYS.users,
    staleTime: ONE_HOUR,
  });
}
