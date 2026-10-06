import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { counterKeys, exceptionKeys } from "./countersExceptions.keys";
import {
  getCounters,
  getException,
  getExceptions,
  getExceptionsByCounterID,
  type ExceptionListParams,
} from "./countersExceptions.api";

import {
  createException,
  deleteException,
  updateException,
} from "./countersExceptions.api";
import {
  CounterExceptionCreate,
  CounterExceptionUpdate,
} from "./countersExceptions.types";

export function useCounters() {
  return useQuery({
    queryKey: counterKeys.list(),
    queryFn: getCounters,
  });
}

export function useExceptions(params: ExceptionListParams) {
  return useQuery({
    queryKey: exceptionKeys.list(params),
    queryFn: ({ signal }) => getExceptions(params, signal),
    placeholderData: keepPreviousData,
  });
}

// Only needed if the edit modal loads one row by id
export function useException(exceptionId: number | null) {
  return useQuery({
    queryKey: exceptionKeys.detail(exceptionId as number),
    queryFn: () => getException(exceptionId as number),
    enabled: exceptionId !== null,
  });
}

// The counters page shows aggregates (count, last date), so every
// change to an exception must refresh both lists.
function useInvalidateLists() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: exceptionKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: counterKeys.list() }),
    ]);
}

export function useCreateException() {
  const invalidateLists = useInvalidateLists();

  return useMutation({
    mutationFn: (payload: CounterExceptionCreate) => createException(payload),
    onSuccess: invalidateLists,
  });
}

export function useUpdateException() {
  const queryClient = useQueryClient();
  const invalidateLists = useInvalidateLists();

  return useMutation({
    mutationFn: ({
      exceptionId,
      payload,
    }: {
      exceptionId: number;
      payload: CounterExceptionUpdate;
    }) => updateException(exceptionId, payload),
    onSuccess: async (_data, { exceptionId }) => {
      await Promise.all([
        invalidateLists(),
        queryClient.invalidateQueries({
          queryKey: exceptionKeys.detail(exceptionId),
        }),
      ]);
    },
  });
}

export function useDeleteException() {
  const queryClient = useQueryClient();
  const invalidateLists = useInvalidateLists();

  return useMutation({
    mutationFn: (exceptionId: number) => deleteException(exceptionId),
    onSuccess: async (_data, exceptionId) => {
      queryClient.removeQueries({
        queryKey: exceptionKeys.detail(exceptionId),
      });
      await invalidateLists();
    },
  });
}
