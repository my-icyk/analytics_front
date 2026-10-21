// hooks/useDeleteEntity.ts
import { useRequest } from "ahooks";
import { message } from "antd";

export function useDeleteEntity<T extends { id: number }>(opts: {
  remove: (id: number) => Promise<unknown>;
  entityName: string;
  label?: (item: T) => string; // optional, falls back to the id
  onDone: () => void;
}) {
  const { remove, entityName, label, onDone } = opts;

  const describe = (item: T) =>
    label ? `${entityName} "${label(item)}"` : `${entityName} #${item.id}`;

  return useRequest((item: T) => remove(item.id), {
    manual: true,
    onSuccess: (_, [item]) => {
      message.success(`${describe(item)} deleted successfully`);
      onDone();
    },
    // onError: (_, [item]) => message.error(`Could not delete ${describe(item)}`),
  });
}
