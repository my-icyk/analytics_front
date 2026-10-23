export enum SnapshotAction {
  Created = "CREATED",
  Updated = "UPDATED",
  Locked = "LOCKED",
  Unlocked = "UNLOCKED",
}

export enum SnapshotTabKey {
  Results = "results",
  History = "history",
}

export const SNAPSHOT_TABS = [
  { tab: "Results", key: SnapshotTabKey.Results },
  { tab: "History", key: SnapshotTabKey.History },
];

export const snapshotUrl = (id: number, tab?: SnapshotTabKey) =>
  tab ? `/finance/snapshots/${id}?tab=${tab}` : `/finance/snapshots/${id}`;
