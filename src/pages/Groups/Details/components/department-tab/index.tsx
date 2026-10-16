import { useEffect, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import { useMemo } from "react";

import { getColumns } from "./columns";
import { Repartition } from "@/types/departments";
import { getRepartitions } from "@/services/groups";

type DepartmentTabProps = {
  groupId: number;
};

export default function DepartmentTab(props: DepartmentTabProps) {
  const [repartitions, setRepartitions] = useState<Repartition[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Partial<Repartition>>({});

  const filteredRepartitions = useMemo(() => {
    return repartitions.filter((repartition) => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }

        const repartitionValue = repartition[key as keyof Repartition];

        return String(repartitionValue)
          .toLowerCase()
          .includes(String(value).toLowerCase());
      });
    });
  }, [repartitions, filters]);

  useEffect(() => {
    let cancelled = false;

    async function loadRules() {
      setLoading(true);

      try {
        const data = await getRepartitions(props.groupId);

        if (!cancelled) {
          setRepartitions(data);
        }
      } catch (error) {
        console.error("Failed to load rules:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRules();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProTable<Repartition>
      rowKey="id"
      columns={getColumns()}
      dataSource={filteredRepartitions}
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
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} items`,
      }}
    />
  );
}
