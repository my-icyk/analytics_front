import { useEffect, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import { useMemo, useCallback } from "react";

import { getColumns } from "./columns";
import { Rule } from "@/types/rules";
import { getRules } from "@/services/groups";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import RuleFormModal from "./RuleFormModal";

type RulesTabProps = {
  groupId: number;
};

export default function RulesTab(props: RulesTabProps) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Partial<Rule>>({});

  const [modal, setModal] = useState({ open: false });
  const openCreate = useCallback(() => setModal({ open: true }), []);

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
    <>
      <ProTable<Rule>
        rowKey="id"
        columns={getColumns()}
        dataSource={filteredRules}
        loading={loading}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreate}
          >
            New rule
          </Button>,
        ]}
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
      <RuleFormModal
        groupId={props.groupId}
        open={modal.open}
        onCancel={() => setModal({ open: false })}
        onSuccess={() => {
          setModal({ open: false });
          // Reload rules after successful creation or update
          getRules(props.groupId).then(setRules).catch(console.error);
        }}
      />
    </>
  );
}
