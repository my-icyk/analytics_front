import { useSearchParams } from "react-router-dom";

/**
 * Keeps the active tab in the `?tab=` URL search param so tabs survive
 * refresh and can be shared/deep-linked. Unknown/missing values fall back
 * to `defaultTab`. Other params are preserved.
 *
 * Usage:
 *   const TABS = ["overview", "rules", "departments"] as const;
 *   const [tab, setTab] = useTabParam(TABS, "overview");
 */
export function useTabParam<T extends string>(
  tabs: readonly T[],
  defaultTab: T,
  paramName = "tab",
) {
  const [params, setParams] = useSearchParams();
  const raw = params.get(paramName);
  const tab = tabs.includes(raw as T) ? (raw as T) : defaultTab;

  const setTab = (next: T) =>
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        p.set(paramName, next);
        return p;
      },
      { replace: true },
    );

  return [tab, setTab] as const;
}
