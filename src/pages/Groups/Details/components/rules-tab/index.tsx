import { useEffect, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import { useMemo } from "react";

import { getColumns } from "./columns";
import { Rule } from "@/types/rules";
import { getRules } from "@/services/groups";

type RulesTabProps = {
  groupId: number;
};

export default function RulesTab(props: RulesTabProps) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Partial<Rule>>({});

  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          return true;
        }

        const ruleValue = rule[key as keyof Rule];

        return String(ruleValue)
          .toLowerCase()
          .includes(String(value).toLowerCase());
      });
    });
  }, [rules, filters]);

  useEffect(() => {
    let cancelled = false;

    async function loadRules() {
      setLoading(true);

      try {
        const data = await getRules(props.groupId);

        if (!cancelled) {
          setRules(data);
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
    <ProTable<Rule>
      rowKey="id"
      columns={getColumns()}
      dataSource={filteredRules}
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
