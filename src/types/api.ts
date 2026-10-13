/** Generic shapes shared by every list endpoint. */

export type PageParams = {
  current: number;
  pageSize: number;
};

export type PageResult<T> = {
  list: T[];
  total: number;
  success: boolean;
};
