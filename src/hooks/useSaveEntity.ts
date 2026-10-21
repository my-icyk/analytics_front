// hooks/useSaveEntity.ts
import { useRequest } from "ahooks";
import { message } from "antd";

export function useSaveEntity<T, P extends { name?: string }>(opts: {
  record?: { id: number };
  create: (payload: P) => Promise<T>;
  update: (id: number, payload: P) => Promise<T>;
  entityName: string;
  onDone: () => void; // close the modal + refresh
}) {
  const { record, create, update, entityName, onDone } = opts;

  return useRequest(
    (payload: P) => (record ? update(record.id, payload) : create(payload)),
    {
      manual: true,
      onSuccess: () => {
        message.success(`${entityName} ${record ? "updated" : "created"}`);
        onDone();
      },
      onError: () =>
        message.error(`Could not save the ${entityName.toLowerCase()}`),
    },
  );
}
