import React, { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Select, Spin } from "antd";
import type { SelectProps } from "antd";
import debounce from "lodash/debounce";

export interface DebounceSelectProps<ValueType = unknown> extends Omit<
  SelectProps<ValueType>,
  "options" | "children" | "onSearch" | "showSearch"
> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

export function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any,
>({
  fetchOptions,
  debounceTimeout = 300,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = async (search: string) => {
      const fetchId = ++fetchRef.current;

      setFetching(true);

      try {
        const results = await fetchOptions(search);

        if (fetchId === fetchRef.current) {
          setOptions(results);
        }
      } catch (error) {
        if (fetchId === fetchRef.current) {
          setOptions([]);
        }
        console.error("Failed to fetch select options:", error);
      } finally {
        if (fetchId === fetchRef.current) {
          setFetching(false);
        }
      }
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  useEffect(() => {
    return () => {
      debounceFetcher.cancel();
      fetchRef.current += 1;
    };
  }, [debounceFetcher]);

  return (
    <Select
      {...props}
      labelInValue
      showSearch
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : "No results found"}
      options={options}
      onOpenChange={(open) => {
        if (open && options.length === 0 && !fetching) {
          debounceFetcher("");
        }
      }}
      optionRender={(option) => <div>{option.label}</div>}
    />
  );
}
