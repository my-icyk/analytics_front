import {
  DepartmentRepartitionDetails,
  GetDepartmentRepartitionsParams,
} from "@/types/finance/DepartmentReaprtitions";
import { getPage } from "@/utils/api";

const BASE = "/api/v1/finance/department-repartitions";

export function getDepartmentRepartitions(
  params: GetDepartmentRepartitionsParams,
) {
  return getPage<DepartmentRepartitionDetails, GetDepartmentRepartitionsParams>(
    BASE,
    params,
  );
}
