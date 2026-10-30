// src/components/columns/lookup.tsx
import type { ProColumns } from "@ant-design/pro-components";
import { Tooltip } from "antd";

type LookupOption = {
  label: string;
  value: number | string;
  description?: string; // e.g. "#12"
};

type LookupOptions = {
  title: string;
  dataIndex: string;
  lookup: (keyWords: string) => Promise<LookupOption[]>;
  placeholder?: string;
  multiple?: boolean;
};

export function lookupSelectColumn<T>(
  {
    title,
    dataIndex,
    lookup,
    placeholder = `Select ${title.toLowerCase()}`,
    multiple = true,
  }: LookupOptions,
  extra?: Partial<ProColumns<T>>,
): ProColumns<T> {
  return {
    title,
    dataIndex,
    hideInTable: true,
    valueType: "select",
    debounceTime: 300,
    fieldProps: {
      mode: multiple ? "multiple" : undefined,
      showSearch: true,
      allowClear: true,
      placeholder,
      optionLabelProp: "label",
    },
    request: async ({ keyWords }) => lookup(keyWords ?? ""),
    ...extra,
  };
}
