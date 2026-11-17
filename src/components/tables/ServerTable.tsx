import { ProTable } from "@ant-design/pro-components";
import type { ProTableProps } from "@ant-design/pro-components";

import type { PageQuery, PageResult } from "@/types/api";
import { DEFAULT_PAGE_SIZE } from "@/constants/app";

type ServerTableProps<T extends object, F extends object> = Omit<
  ProTableProps<T, F>,
  "request" | "dataSource"
> & {
  fetcher: (params: PageQuery & F) => Promise<PageResult<T>>;
};

export function ServerTable<
  T extends object,
  F extends object = Record<string, never>,
>({ fetcher, pagination, ...props }: ServerTableProps<T, F>) {
  return (
    <ProTable<T, F>
      rowKey="id"
      options={{
        reload: true,
        density: true,
        setting: true,
      }}
      pagination={{
        defaultPageSize: DEFAULT_PAGE_SIZE,
        showSizeChanger: true,
        ...pagination,
      }}
      search={{
        labelWidth: "auto",
        searchText: "Filter",
        resetText: "Reset",
      }}
      {...props}
      request={async (
        { current = 1, pageSize = DEFAULT_PAGE_SIZE, ...filters },
        sort,
        columnFilters,
      ) => {
        const activeSort = Object.entries(sort).find(
          ([, order]) => order === "ascend" || order === "descend",
        );

        const sort_by = activeSort?.[0];
        const sort_order =
          activeSort?.[1] === "ascend"
            ? "asc"
            : activeSort?.[1] === "descend"
              ? "desc"
              : undefined;

        // Column filters
        const activeFilters = Object.fromEntries(
          Object.entries(columnFilters).filter(([, value]) => value != null),
        );

        // Backend request
        const result = await fetcher({
          ...filters,
          ...activeFilters,
          limit: pageSize,
          offset: (current - 1) * pageSize,
          ...(sort_by && sort_order ? { sort_by, sort_order } : {}),
        } as PageQuery & F);

        return {
          data: result.items,
          total: result.total,
          success: true,
        };
      }}
    />
  );
}
