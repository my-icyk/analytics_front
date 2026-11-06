import type { TablePagination, PageResult, ApiPage } from "@/types/api";
import { request } from "@umijs/max";

export async function getPage<T, P extends TablePagination = TablePagination>(
  url: string,
  params: P,
  sort?: Record<string, "ascend" | "descend" | null>,
): Promise<PageResult<T>> {
  const { current = 1, pageSize = 10, ...filters } = params;
  const [field, order] = Object.entries(sort ?? {})[0] ?? [];

  const res = await request<ApiPage<T>>(url, {
    params: {
      ...filters,
      page: current,
      limit: pageSize,
      sort_by: field,
      sort_order:
        order === "ascend" ? "asc" : order === "descend" ? "desc" : undefined,
    },
  });

  return { data: res.items, total: res.total, success: true };
}
