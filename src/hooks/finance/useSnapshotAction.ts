import { useState } from "react";
import { message } from "antd";
import { useRequest } from "ahooks";
import {
  lockSnapshot,
  unlockSnapshot,
  updateSnapshot,
} from "@/services/finance/snapshots";
import type { Snapshot, SnapshotNotes } from "@/types/finance/snapshots";

export type SnapshotActionKey = "lock" | "unlock" | "update";

type ActionConfig = {
  title: string;
  okText: string;
  success: string;
  notesRequired: boolean;
  run: (id: number, data: SnapshotNotes) => Promise<unknown>;
};

export const SNAPSHOT_ACTIONS: Record<SnapshotActionKey, ActionConfig> = {
  lock: {
    title: "Lock snapshot",
    okText: "Lock",
    success: "Snapshot locked",
    notesRequired: true,
    run: lockSnapshot,
  },
  unlock: {
    title: "Unlock snapshot",
    okText: "Unlock",
    success: "Snapshot unlocked",
    notesRequired: true,
    run: unlockSnapshot,
  },
  update: {
    title: "Update snapshot",
    okText: "Update",
    success: "Snapshot updated",
    notesRequired: false,
    run: updateSnapshot,
  },
};

/**
 * One action on one snapshot at a time. `target` is what the modal is open for.
 * Errors are left to the global handler (one toast, with the back end's reason).
 */
export function useSnapshotAction(onDone: () => void) {
  const [target, setTarget] = useState<{
    key: SnapshotActionKey;
    snapshot: Snapshot;
  }>();

  const { runAsync, loading } = useRequest(
    (note: string) => {
      const { key, snapshot } = target!;
      return SNAPSHOT_ACTIONS[key].run(snapshot.id, { note });
    },
    {
      manual: true,
      onSuccess: () => {
        message.success(SNAPSHOT_ACTIONS[target!.key].success);
        setTarget(undefined);
        onDone();
      },
    },
  );

  return {
    target,
    config: target ? SNAPSHOT_ACTIONS[target.key] : undefined,
    open: (key: SnapshotActionKey, snapshot: Snapshot) =>
      setTarget({ key, snapshot }),
    close: () => setTarget(undefined),
    submit: runAsync,
    saving: loading,
  };
}
