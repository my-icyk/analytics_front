import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

function isOneOf<T extends string>(
  list: readonly T[],
  value: string | null,
): value is T {
  return value !== null && (list as readonly string[]).includes(value);
}

/**
 * Keeps the active tab in the `?tab=` URL param, so it survives refresh and
 * can be deep-linked. Missing or unknown values fall back to `defaultTab`.
 * The default tab is not written to the URL. Other params are preserved.
 *
 * Pass only the tabs the user is allowed to see, so a forbidden
 * `?tab=` value falls back to the default.
 */
export function useTabParam<T extends string>(
  tabs: readonly T[],
  defaultTab: T,
  paramName = "tab",
) {
  const [params, setParams] = useSearchParams();
  const raw = params.get(paramName);
  const tab = isOneOf(tabs, raw) ? raw : defaultTab;

  const setTab = useCallback(
    (next: T) =>
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          if (next === defaultTab) p.delete(paramName);
          else p.set(paramName, next);
          return p;
        },
        { replace: true },
      ),
    [setParams, defaultTab, paramName],
  );

  return [tab, setTab] as const;
}
