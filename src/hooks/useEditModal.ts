// hooks/useEditModal.ts
import { useCallback, useState } from "react";

type ModalState<T> = { open: false } | { open: true; record?: T };

export function useEditModal<T>() {
  const [state, setState] = useState<ModalState<T>>({ open: false });

  const close = useCallback(() => setState({ open: false }), []);
  const openCreate = useCallback(() => setState({ open: true }), []);
  const openEdit = useCallback(
    (record: T) => setState({ open: true, record }),
    [],
  );

  return {
    open: state.open,
    record: state.open ? state.record : undefined,
    close,
    openCreate,
    openEdit,
  };
}
