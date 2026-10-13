/** Generic shapes shared by every list endpoint. */

export type PageParams = {
  page?: number;
  limit?: number;
};

export type PageResult<T> = {
  data: T[];
  total: number;
  success: boolean;
};
