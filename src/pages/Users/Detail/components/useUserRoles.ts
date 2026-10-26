import { useRequest } from "ahooks";
import { message } from "antd";
import { useCallback, useMemo, useState } from "react";

import { useRoles } from "@/hooks/useReferenceData";
import { assignUserRoles, getUserRoles } from "@/services/users";

const PROTECTED_ROLES = new Set(["admin"]);

const areSetsEqual = (a: Set<number>, b: Set<number>) =>
  a.size === b.size && [...a].every((id) => b.has(id));

export function useUserRoles(userId: number) {
  const { data: allRoles = [], loading: loadingRoles } = useRoles();

  const [initial, setInitial] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");

  const {
    loading: loadingUser,
    error: loadError,
    refreshAsync,
  } = useRequest(() => getUserRoles(userId), {
    refreshDeps: [userId],
    onBefore: () => {
      setInitial(new Set());
      setSelected(new Set());
    },
    onSuccess: (roles) => {
      const ids = new Set<number>(roles.map((role) => role.id));
      setInitial(ids);
      setSelected(new Set(ids));
    },
    onError: () => {
      message.error("Failed to load user roles");
    },
  });

  const { loading: saving, runAsync: saveRoles } = useRequest(assignUserRoles, {
    manual: true,
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return allRoles;

    return allRoles.filter(
      (role) =>
        role.name.toLowerCase().includes(query) ||
        role.description?.toLowerCase().includes(query),
    );
  }, [allRoles, search]);

  const selectableIds = useMemo(
    () =>
      filtered
        .filter((role) => !PROTECTED_ROLES.has(role.name.toLowerCase()))
        .map((role) => role.id),
    [filtered],
  );

  const selectedCount = selectableIds.filter((id) => selected.has(id)).length;

  const dirty = !areSetsEqual(initial, selected);
  const loading = loadingRoles || loadingUser;
  const disabled = loading || saving || !!loadError;

  const toggle = useCallback((ids: number[], checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);

      for (const id of ids) {
        if (checked) next.add(id);
        else next.delete(id);
      }

      return next;
    });
  }, []);

  const reset = () => {
    setSelected(new Set(initial));
  };

  const save = async () => {
    if (disabled || !dirty) return;

    try {
      await saveRoles(userId, [...selected]);
      await refreshAsync();
      message.success("Roles saved");
    } catch {
      message.error("Failed to save roles");
    }
  };

  return {
    allRoles,
    filtered,
    selected,
    search,
    setSearch,
    selectableIds,
    selectedCount,
    dirty,
    loading,
    saving,
    disabled,
    loadError,
    toggle,
    reset,
    save,
  };
}
