/** Generic shapes shared by every list endpoint. */

export type PageParams = {
  page?: number;
  limit?: number;
};

export type ApiPage<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type PageResult<T> = {
  data: T[];
  total: number;
  success: boolean;
};

export type TablePagination = {
  current?: number;
  pageSize?: number;
};
