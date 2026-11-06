import { useCallback, useState } from "react";

type State = { mode: "create" } | { mode: "edit"; id: number } | null;

export function useEntityModal() {
  const [state, setState] = useState<State>(null);

  const openCreate = useCallback(() => setState({ mode: "create" }), []);
  const openEdit = useCallback(
    (id: number) => setState({ mode: "edit", id }),
    [],
  );
  const close = useCallback(() => setState(null), []);

  return {
    isOpen: state !== null,
    editId: state?.mode === "edit" ? state.id : undefined,
    openCreate,
    openEdit,
    close,
  };
}
