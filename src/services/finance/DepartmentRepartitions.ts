import { request } from "@umijs/max";
import type { PageResult } from "@/types/api";
import {
  DepartmentRepartitionDetails,
  DepartmentRepartitionFilter,
} from "@/types/finance/DepartmentReaprtitions";

const BASE = "/api/v1/finance/department-repartitions/";

export function getDepartmentRepartitions(
  filters: DepartmentRepartitionFilter,
) {
  return request<PageResult<DepartmentRepartitionDetails>>(BASE, {
    params: filters,
  });
}
