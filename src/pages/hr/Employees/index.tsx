import { useMemo } from "react";
import { getEmployees } from "@/services/hr";
import { PageContainer } from "@ant-design/pro-components";

import type { Employee, EmployeeFilters } from "@/types/hr";
import { getEmployeeColumns } from "./columns";

import { ServerTable } from "@/components/tables/ServerTable";

export default function EmployeesPage() {
  const columns = useMemo(() => getEmployeeColumns(), []);

  return (
    <PageContainer>
      <ServerTable<Employee, EmployeeFilters>
        columns={columns}
        fetcher={getEmployees}
      />
    </PageContainer>
  );
}
