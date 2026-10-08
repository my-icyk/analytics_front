import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { repartitionKeys } from "./repartitions.keys";
import {
  assignDepartmentRepartition,
  getDepartmentRepartitions,
  getDepartments,
  revokeDepartmentRepartition,
  updateDepartmentRepartition,
} from "./repartitions.api";
import {
  DepartmentRepartitionCreate,
  DepartmentRepartitionUpdate,
} from "./repartitions.types";

//TODO: Am nevoie de acesata constanta?
const THREE_HOURS = 3 * 60 * 60 * 1000;

export function useDepartments() {
  return useQuery({
    queryKey: repartitionKeys.departments(),
    queryFn: () => getDepartments(),
    staleTime: THREE_HOURS,
    gcTime: THREE_HOURS,
  });
}

export function useRepartitionByGroup(groupId: number) {
  return useQuery({
    queryKey: repartitionKeys.byGroup(groupId),
    queryFn: () => getDepartmentRepartitions(groupId),
    placeholderData: keepPreviousData,
  });
}
// todo: need to invalidate other related queries
export function useCreateRepartition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      payload,
    }: {
      groupId: number;
      payload: DepartmentRepartitionCreate;
    }) => assignDepartmentRepartition(groupId, payload),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: repartitionKeys.all,
      }),
  });
}

export function useUpdateRepartition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      repartitionId,
      payload,
    }: {
      groupId: number;
      repartitionId: number;
      payload: DepartmentRepartitionUpdate;
    }) => updateDepartmentRepartition(groupId, repartitionId, payload),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: repartitionKeys.all,
      }),
  });
}

export function useDeleteRepartition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      repartitionId,
    }: {
      groupId: number;
      repartitionId: number;
    }) => revokeDepartmentRepartition(groupId, repartitionId),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: repartitionKeys.all,
      }),
  });
}
