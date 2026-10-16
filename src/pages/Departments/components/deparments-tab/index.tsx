import { useEffect, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import { useMemo } from "react";
import type { Department } from "@/types/departments";
import { getDepartments } from "@/services/groups";
import { getColumns } from "./columns";

export default function DepartmentsTab() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Partial<Department>>({});

  const filteredDepartments = useMemo(() => {
    return departments.filter((department) => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }

        const departmentValue = department[key as keyof Department];

        return String(departmentValue)
          .toLowerCase()
          .includes(String(value).toLowerCase());
      });
    });
  }, [departments, filters]);

  useEffect(() => {
    let cancelled = false;

    async function loadDepartments() {
      setLoading(true);

      try {
        const data = await getDepartments();

        if (!cancelled) {
          setDepartments(data);
        }
      } catch (error) {
        console.error("Failed to load departments:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDepartments();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProTable<Department>
      rowKey="id"
      columns={getColumns()}
      dataSource={filteredDepartments}
      loading={loading}
      search={{
        labelWidth: "auto",
        searchText: "Filter",
        resetText: "Reset",
      }}
      onSubmit={(params) => {
        setFilters(params);
      }}
      onReset={() => {
        setFilters({});
      }}
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: false,
        showTotal: (total) => `Total ${total} items`,
      }}
    />
  );
}
