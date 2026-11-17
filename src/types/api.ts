/** Generic shapes shared by every list endpoint. */

export type PageParams = {
  page?: number;
  limit?: number;
};

// export type ApiPage<T> = {
//   items: T[];
//   total: number;
//   page: number;
//   limit: number;
// };

// export type PageResult<T> = {
//   data: T[];
//   total: number;
//   success: boolean;
// };

export type TablePagination = {
  current?: number;
  pageSize?: number;
};

export interface PageQuery {
  limit: number;
  offset: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
