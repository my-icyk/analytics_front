import { useMemo } from "react";
import { Alert, Drawer, message } from "antd";
import { useRequest } from "ahooks";

import {
  getTargets,
  createTarget,
  updateTarget,
  deleteTarget,
} from "@/services/groups";
import { useLocalFilter } from "@/hooks/useLocalFilter";
import { useEditModal } from "@/hooks/useEditModal";
import { EntityTable } from "@/components/EntityTable";
import type { Rule } from "@/types/rules";
import type { Target, TargetCreate } from "@/types/rules";
import { summarizeAllocation } from "@/types/rules";
import TargetFormModal from "./TargetFormModal";
import { getColumns } from "./columns";

type Props = {
  open: boolean;
  groupId: number;
  rule?: Rule;
  onClose: () => void;
};

export default function TargetsDrawer({ open, groupId, rule, onClose }: Props) {
  const ruleId = rule?.id;

  const {
    data: targets = [],
    loading,
    refresh,
  } = useRequest(() => getTargets(groupId, ruleId!), {
    ready: ruleId !== undefined, // don't fetch while the drawer is closed
    refreshDeps: [groupId, ruleId],
    onError: () => message.error("Failed to load targets"),
  });

  const { rows, setFilters, resetFilters } = useLocalFilter(targets);
  const modal = useEditModal<Target>();

  const { run: removeTarget } = useRequest(
    (id: number) => deleteTarget(groupId, ruleId!, id),
    {
      manual: true,
      onSuccess: () => {
        message.success("Target deleted");
        refresh();
      },
      onError: () => message.error("Could not delete the target"),
    },
  );

  const { runAsync: saveTarget, loading: saving } = useRequest(
    (payload: TargetCreate) =>
      modal.record
        ? updateTarget(groupId, ruleId!, modal.record.id, payload)
        : createTarget(groupId, ruleId!, payload),
    {
      manual: true,
      onSuccess: () => {
        message.success("Saved");
        modal.close();
        refresh();
      },
      // Duplicates are rejected by the backend (unique constraint),
      // so the message covers that case too.
      onError: () =>
        message.error(
          "Could not save the target (this group may already be a target of the rule)",
        ),
    },
  );

  const columns = useMemo(
    () => getColumns(modal.openEdit, removeTarget),
    [modal.openEdit, removeTarget],
  );

  // Informative only, the back end enforces the real rules.
  const summary = useMemo(() => summarizeAllocation(targets), [targets]);

  const summaryText = [
    `Direct ${summary.direct}%`,
    `Static ${summary.static}%`,
    summary.proportionalCount > 0
      ? `Proportional shares the remaining ${summary.remaining}% (${summary.proportionalCount} ${
          summary.proportionalCount === 1 ? "target" : "targets"
        })`
      : `${summary.remaining}% not allocated`,
  ].join(" · ");

  return (
    <Drawer
      title={rule ? `Targets: ${rule.name}` : "Targets"}
      width="min(800px, 100vw)"
      open={open}
      onClose={onClose}
      destroyOnHidden
    >
      <Alert
        showIcon
        type={summary.fixed > 100 ? "error" : "info"}
        message={summaryText}
        style={{ marginBottom: 16 }}
      />
      <EntityTable<Target>
        columns={columns}
        data={rows}
        loading={loading}
        createLabel="New target"
        onCreate={modal.openCreate}
        onFilter={setFilters}
        onReset={resetFilters}
      />
      <TargetFormModal
        open={modal.open}
        initialValues={modal.record}
        saving={saving}
        onCancel={modal.close}
        onSubmit={saveTarget}
      />
    </Drawer>
  );
}
