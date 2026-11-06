import { useEntityAction, type EntityActionOptions } from "./useEntityAction";

type Opts<T extends { id: number }> = Omit<
  EntityActionOptions<T>,
  "action" | "successText"
> & {
  run: (id: number) => Promise<unknown>;
};

export function useRunEntity<T extends { id: number }>({
  run,
  ...rest
}: Opts<T>) {
  return useEntityAction<T>({ ...rest, action: run, successText: "started" });
}
