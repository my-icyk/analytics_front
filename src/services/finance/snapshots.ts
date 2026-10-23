import { request } from "@umijs/max";
import type {
  Snapshot,
  SnapshotHistory,
  SnapshotNotes,
  SnapshotResult,
  SnapshotSave,
} from "@/types/finance/snapshots";

// Adjust BASE and the paths to match your backend routes.
const BASE = "/api/v1/finance/snapshots";

export const getSnapshots = () => request<Snapshot[]>(BASE);

export const getSnapshot = (id: number) => request<Snapshot>(`${BASE}/${id}`);

export const getSnapshotResults = (id: number) =>
  request<SnapshotResult[]>(`${BASE}/${id}/results`);

export const getSnapshotHistory = (id: number) =>
  request<SnapshotHistory[]>(`${BASE}/${id}/history`);

// exec finance.usp_FR_Snapshot_save
export const saveSnapshot = (data: SnapshotSave) =>
  request<Snapshot>(BASE, { method: "POST", data });

// exec finance.usp_FR_Snapshot_lock / unlock / update
const action =
  (name: "lock" | "unlock" | "update") => (id: number, data: SnapshotNotes) =>
    request<Snapshot>(`${BASE}/${id}/${name}`, { method: "POST", data });

export const lockSnapshot = action("lock");
export const unlockSnapshot = action("unlock");
export const updateSnapshot = action("update");

// Only the flag can change, one row per request.
export const setResultPosted = (
  snapshotId: number,
  resultId: number,
  is_posted: boolean,
) =>
  request<SnapshotResult>(`${BASE}/${snapshotId}/results/${resultId}`, {
    method: "PATCH",
    data: { is_posted },
  });
