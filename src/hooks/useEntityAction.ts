import { useRequest } from "@umijs/max";
import { message } from "antd";
import { useMemo } from "react";

export type EntityActionOptions<T extends { id: number }> = {
  action: (id: number) => Promise<unknown>;
  entityName: string;
  label?: (item: T) => string; // optional, falls back to the id
  successText: string; // e.g. "deleted successfully"
  onDone?: () => void;
};

export function useEntityAction<T extends { id: number }>(
  opts: EntityActionOptions<T>,
) {
  const { action, entityName, label, successText, onDone } = opts;

  const describe = (item: T) =>
    label ? `${entityName} "${label(item)}"` : `${entityName} #${item.id}`;

  const { run, fetches } = useRequest((item: T) => action(item.id), {
    manual: true,
    fetchKey: (item) => String(item.id), // one loading state per row
    onSuccess: (_, [item]) => {
      message.success(`${describe(item)} ${successText}`);
      onDone?.();
    },
  });

  const pendingIds = useMemo(
    () =>
      Object.entries(fetches)
        .filter(([, f]) => f.loading)
        .map(([id]) => Number(id)),
    [fetches],
  );

  return { run, pendingIds };
}
