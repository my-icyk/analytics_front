// src/hooks/useDeleteEntity.ts
import { useEntityAction, type EntityActionOptions } from "./useEntityAction";

type Opts<T extends { id: number }> = Omit<
  EntityActionOptions<T>,
  "action" | "successText"
> & {
  remove: (id: number) => Promise<unknown>;
};

export function useDeleteEntity<T extends { id: number }>({
  remove,
  ...rest
}: Opts<T>) {
  return useEntityAction<T>({
    ...rest,
    action: remove,
    successText: "deleted successfully",
  });
}
