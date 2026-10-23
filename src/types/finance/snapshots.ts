import type { SnapshotAction } from "@/constants/finance/snapshots";

export type Snapshot = {
  id: number;
  end_of_month: string; // "YYYY-MM-DD", last day of the month
  is_locked: boolean; // computed by the back end from the last history action
  groups_count: number;
  posted_count: number;
  created_at: string;
  updated_at: string;
};

export type SnapshotResult = {
  id: number;
  snapshot_id: number;
  group_id: number;
  group_name: string;
  division_name: string;
  is_posted: boolean;
};

export type SnapshotHistory = {
  id: number;
  snapshot_id: number;
  action_type: SnapshotAction;
  notes: string | null;
  user_id: number;
  user_name: string;
  created_at: string;
};

/** Body of lock / unlock / update. */
export type SnapshotNotes = { note: string };

/** Body of save (creates the snapshot for the month if it doesn't exist). */
export type SnapshotSave = { end_of_month: string };
