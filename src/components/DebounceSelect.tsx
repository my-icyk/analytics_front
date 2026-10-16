import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Empty, Select, Spin } from "antd";
import type { SelectProps } from "antd";
import type { DefaultOptionType, LabeledValue } from "antd/es/select";
import debounce from "lodash/debounce";

type RemoteValue = LabeledValue | LabeledValue[];

export interface DebounceSelectProps<
  TOption extends DefaultOptionType = DefaultOptionType,
> extends Omit<
  SelectProps<RemoteValue, TOption>,
  | "options"
  | "children"
  | "onSearch"
  | "showSearch"
  | "labelInValue"
  | "filterOption"
> {
  /** Receives the search text and an AbortSignal you can pass to fetch/axios. */
  fetchOptions: (search: string, signal: AbortSignal) => Promise<TOption[]>;
  debounceTimeout?: number;
  onFetchError?: (error: unknown) => void;
}

export function DebounceSelect<
  TOption extends DefaultOptionType = DefaultOptionType,
>({
  fetchOptions,
  debounceTimeout = 300,
  onFetchError,
  onOpenChange,
  notFoundContent,
  ...rest
}: DebounceSelectProps<TOption>) {
  const [options, setOptions] = useState<TOption[]>([]);
  const [fetching, setFetching] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const hasLoadedRef = useRef(false);

  // "Latest ref" pattern: the debouncer stays stable even if the parent
  // passes an inline function.
  const fetchOptionsRef = useRef(fetchOptions);
  const onErrorRef = useRef(onFetchError);
  useEffect(() => {
    fetchOptionsRef.current = fetchOptions;
    onErrorRef.current = onFetchError;
  });

  const load = useCallback(async (search: string) => {
    abortRef.current?.abort(); // cancel the previous in-flight request
    const controller = new AbortController();
    abortRef.current = controller;
    hasLoadedRef.current = true;
    setFetching(true);

    try {
      const results = await fetchOptionsRef.current(search, controller.signal);
      if (!controller.signal.aborted) setOptions(results);
    } catch (error) {
      if (controller.signal.aborted) return;
      setOptions([]);
      onErrorRef.current?.(error);
    } finally {
      if (abortRef.current === controller) setFetching(false);
    }
  }, []);

  const debouncedLoad = useMemo(
    () => debounce(load, debounceTimeout),
    [load, debounceTimeout],
  );

  useEffect(
    () => () => {
      debouncedLoad.cancel();
      abortRef.current?.abort();
      abortRef.current = null; // prevents setState after unmount
    },
    [debouncedLoad],
  );

  const handleOpenChange = (open: boolean) => {
    if (open && !hasLoadedRef.current) void load(""); // first open: load immediately
    onOpenChange?.(open); // don't swallow the consumer's handler
  };

  return (
    <Select<RemoteValue, TOption>
      notFoundContent={
        notFoundContent ??
        (fetching ? (
          <Spin size="small" />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ))
      }
      {...rest}
      labelInValue
      showSearch
      filterOption={false}
      loading={fetching}
      options={options}
      onSearch={debouncedLoad}
      onOpenChange={handleOpenChange}
    />
  );
}
