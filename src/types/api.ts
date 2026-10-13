/** Generic shapes shared by every list endpoint. */

export type PageParams = {
  current: number;
  pageSize: number;
};

export type PageResult<T> = {
  data: T[];
  total: number;
  success: boolean;
};
