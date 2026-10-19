import { useCallback, useEffect, useState, useMemo } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { filterRows, matchesFilters } from "@/utils/filterRows";

import { getRules } from "@/services/groups";
import type { Rule } from "@/types/rules";
import { getColumns } from "./columns";
import RuleFormModal from "./RuleFormModal";

type RulesTabProps = {
  groupId: number;
};

const columns = getColumns();

export default function RulesTab({ groupId }: RulesTabProps) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [filters, setFilters] = useState<Partial<Record<keyof Rule, unknown>>>(
    {},
  );

  const visibleRules = useMemo(
    () => filterRows(rules, filters),
    [rules, filters],
  );

  const loadRules = useCallback(
    async (signal?: { cancelled: boolean }) => {
      setLoading(true);
      try {
        const data = await getRules(groupId);
        if (!signal?.cancelled) setRules(data);
      } catch {
        if (!signal?.cancelled) message.error("Failed to load rules");
      } finally {
        if (!signal?.cancelled) setLoading(false);
      }
    },
    [groupId],
  );

  useEffect(() => {
    const signal = { cancelled: false };
    void loadRules(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [loadRules]);

  return (
    <>
      <ProTable<Rule>
        rowKey="id"
        columns={columns}
        dataSource={visibleRules}
        onSubmit={setFilters}
        onReset={() => setFilters({})}
        loading={loading}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
          >
            New rule
          </Button>,
        ]}
        search={{
          labelWidth: "auto",
          searchText: "Filter",
          resetText: "Reset",
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />

      <RuleFormModal
        groupId={groupId}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          void loadRules();
        }}
      />
    </>
  );
}
