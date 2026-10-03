// divisions/divisions.queries.ts
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "./divisions.api";
import { divisionKeys } from "./divisions.keys";
import type { DivisionCreate, DivisionUpdate } from "./divisions.types";

export const divisionsQueryOptions = () =>
  queryOptions({
    queryKey: divisionKeys.list(),
    queryFn: api.getDivisions,
  });

export const useDivisions = () => useQuery(divisionsQueryOptions());

export const useCreateDivision = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createDivision,
    onSuccess: () => qc.invalidateQueries({ queryKey: divisionKeys.lists() }),
  });
};

export const useUpdateDivision = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DivisionUpdate }) =>
      api.updateDivision(id, data),
    onSuccess: (_res, { id }) => {
      qc.invalidateQueries({ queryKey: divisionKeys.lists() });
      qc.invalidateQueries({ queryKey: divisionKeys.detail(id) });
    },
  });
};

export const useRemoveDivision = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.removeDivision,
    onSuccess: (_res, id) => {
      qc.removeQueries({ queryKey: divisionKeys.detail(id) });
      qc.invalidateQueries({ queryKey: divisionKeys.lists() });
    },
  });
};
