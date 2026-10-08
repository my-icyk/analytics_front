import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import {
  getGroups,
  getGroup,
  getGroupTypes,
  lookupGroups,
  createGroup,
  updateGroup,
  removeGroup,
} from "./groups.api";

import { groupKeys } from "./groups.keys";

import type {
  GroupFilterParams,
  GroupCreate,
  GroupUpdate,
} from "./groups.types";

export function useGroups(filters?: GroupFilterParams) {
  return useQuery({
    queryKey: groupKeys.list(filters),
    queryFn: () => getGroups(filters),
    placeholderData: keepPreviousData,
  });
}

export function useGroup(groupId: number) {
  return useQuery({
    queryKey: groupKeys.detail(groupId),
    queryFn: () => getGroup(groupId),
    enabled: !!groupId,
  });
}

export function useGroupLookup(search: string, limit = 20) {
  return useQuery({
    queryKey: groupKeys.lookup(search, limit),
    queryFn: () => lookupGroups(search, limit),
    placeholderData: keepPreviousData,
  });
}

export function useGroupTypes() {
  return useQuery({
    queryKey: groupKeys.types(),
    queryFn: getGroupTypes,
    staleTime: Infinity,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GroupCreate) => createGroup(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: groupKeys.all,
      });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      payload,
    }: {
      groupId: number;
      payload: GroupUpdate;
    }) => updateGroup(groupId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: groupKeys.all,
      });
    },
  });
}

export function useRemoveGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: number) => removeGroup(groupId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: groupKeys.all,
      });
    },
  });
}
