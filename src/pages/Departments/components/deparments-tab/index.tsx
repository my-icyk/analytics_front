import type { Department } from "@/types/departments";
import { getColumns } from "./columns";
import { useDepartments } from "@/hooks/useReferenceData";
import { EntityTable } from "@/components/EntityTable";

export default function DepartmentsTab() {
  const { data: departments = [], loading: departmentsLoading } =
    useDepartments();

  return (
    <EntityTable<Department>
      columns={getColumns()}
      data={departments}
      loading={departmentsLoading}
    />
  );
}
