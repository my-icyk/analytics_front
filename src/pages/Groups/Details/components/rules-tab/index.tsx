import { useMemo } from "react";
import { message } from "antd";
import { PERMISSIONS } from "../../../../../../config/permissions";
import { useState } from "react";
import { useRequest } from "ahooks";

import {
  getRules,
  createRule,
  updateRule,
  deleteRule,
} from "@/services/groups";
import { useAccess } from "@umijs/max";
import { useEditModal } from "@/hooks/useEditModal";
import { EntityTable } from "@/components/EntityTable";
import type { Rule, RuleCreate } from "@/types/rules";
import RuleFormModal from "./RuleFormModal";
import { getColumns } from "./columns";
import TargetsDrawer from "../rule-targets-drower/TargetDrawer";

export default function RulesTab({ groupId }: { groupId: number }) {
  const access = useAccess();
  const canCreate = access[PERMISSIONS.FINANCE.RULE.CREATE];
  const {
    data: rules = [],
    loading,
    refresh,
  } = useRequest(() => getRules(groupId), {
    refreshDeps: [groupId],
  });

  const modal = useEditModal<Rule>();
  const [targetsRule, setTargetsRule] = useState<Rule>();
  const { run: removeRule } = useRequest(
    (id: number) => deleteRule(groupId, id),
    {
      manual: true,
      onSuccess: () => {
        message.success("Rule deleted");
        refresh();
      },
    },
  );

  const { runAsync: saveRule, loading: saving } = useRequest(
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
    () => getColumns(access, modal.openEdit, removeRule, setTargetsRule),
    [access, modal.openEdit, removeRule],
  );

  return (
    <>
      <EntityTable<Rule>
        columns={columns}
        data={rules}
        loading={loading}
        createLabel="New rule"
        onCreate={canCreate ? modal.openCreate : undefined}
      />
      <RuleFormModal
        open={modal.open}
        initialValues={modal.record}
        saving={saving}
        onCancel={modal.close}
        onSubmit={saveRule}
      />
      <TargetsDrawer
        open={!!targetsRule}
        groupId={groupId}
        rule={targetsRule}
        rules={rules}
        onClose={() => setTargetsRule(undefined)}
      />
    </>
  );
}
