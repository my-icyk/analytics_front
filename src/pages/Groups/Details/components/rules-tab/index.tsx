import { getRules } from "@/services/groups";
import { useLocalFilter } from "@/hooks/useLocalFilter";
import { deleteRule, updateRule, createRule } from "@/services/groups";
import { useEditModal } from "@/hooks/useEditModal";
import { Rule, RuleCreate } from "@/types/rules";
import { EntityTable } from "@/components/EntityTable";
import RuleFormModal from "./RuleFormModal";
import { getColumns } from "./columns";
import { message } from "antd";
import { useRequest } from "ahooks";
import { useMemo } from "react";

export default function RulesTab({ groupId }: { groupId: number }) {
  const {
    data: rules = [],
    loading,
    refresh,
  } = useRequest(() => getRules(groupId), {
    refreshDeps: [groupId],
    onError: () => message.error("Failed to load rules"),
  });

  const { rows, setFilters, resetFilters } = useLocalFilter(rules);
  const modal = useEditModal<Rule>();

  const { run: removeRule } = useRequest(
    (id: number) => deleteRule(groupId, id),
    {
      manual: true,
      onSuccess: () => {
        message.success("Rule deleted");
        refresh();
      },
      onError: () => message.error("Could not delete the rule"),
    },
  );

  const { runAsync: saveRule } = useRequest(
    (payload: RuleCreate) =>
      modal.record
        ? updateRule(groupId, modal.record.id, payload)
        : createRule(groupId, payload),
    {
      manual: true,
      onSuccess: () => {
        message.success("Saved");
        modal.close();
        refresh();
      },
      onError: () => message.error("Could not save the rule"),
    },
  );

  const columns = useMemo(
    () => getColumns(modal.openEdit, removeRule),
    [modal.openEdit, removeRule],
  );

  return (
    <>
      <EntityTable
        columns={columns}
        data={rows}
        loading={loading}
        createLabel="New rule"
        onCreate={modal.openCreate}
        onFilter={setFilters}
        onReset={resetFilters}
      />
      <RuleFormModal
        open={modal.open}
        initialValues={modal.record}
        onCancel={modal.close}
        onSubmit={saveRule}
      />
    </>
  );
}
