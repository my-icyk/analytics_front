import { useCallback } from "react";
import { useSearchParams } from "@umijs/max";

type TabLike<K extends string> = { key: K };

export function useTabParam<K extends string>(
  tabs: readonly TabLike<K>[],
  defaultKey?: K,
  param = "tab",
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const raw = searchParams.get(param);
  const fallback = defaultKey ?? tabs[0].key;
  const activeKey = tabs.some((t) => t.key === raw) ? (raw as K) : fallback;

  const setActiveKey = useCallback(
    (key: string) => {
      const next = new URLSearchParams(searchParams);
      next.set(param, key);
      setSearchParams(next, { replace: true });
    },
    [param, searchParams, setSearchParams],
  );

  return [activeKey, setActiveKey] as const;
}
