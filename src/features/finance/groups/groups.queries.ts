import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getGroups,
  getGroup,
  getGroupTypes,
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
  });
}

export function useGroup(groupId: number) {
  return useQuery({
    queryKey: groupKeys.detail(groupId),
    queryFn: () => getGroup(groupId),
    enabled: !!groupId,
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
