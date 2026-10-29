import type { TablePagination, PageResult, ApiPage } from "@/types/api";
import { request } from "@umijs/max";

export async function getPage<T, P extends TablePagination = TablePagination>(
  url: string,
  params: P,
): Promise<PageResult<T>> {
  const { current = 1, pageSize = 10, ...filters } = params;

  const res = await request<ApiPage<T>>(url, {
    params: { ...filters, page: current, limit: pageSize },
  });

  return {
    data: res.items,
    total: res.total,
    success: true,
  };
}
