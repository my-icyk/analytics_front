// src/constants/statuses.ts
export type StatusBadge =
  "Success" | "Processing" | "Error" | "Warning" | "Default";

type StatusItem = { text: string; status: StatusBadge };

export const ACTIVE_STATUS = {
  true: { text: "Active", status: "Success" },
  false: { text: "Inactive", status: "Default" },
} as const satisfies Record<string, StatusItem>;

export const JOB_STATUS = {
  success: { text: "Success", status: "Success" },
  running: { text: "Running", status: "Processing" },
  error: { text: "Error", status: "Error" },
  not_run: { text: "Not Run", status: "Default" },
} as const satisfies Record<string, StatusItem>;

export const DELETED_STATUS = {
  false: { text: "Existing", status: "Success" },
  true: { text: "Deleted", status: "Error" },
} as const satisfies Record<string, StatusItem>;

// types derived from the constants, no duplication
export type JobStatus = keyof typeof JOB_STATUS;
