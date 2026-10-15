/** Helpers for turning request errors into something we can show or check. */
import type { AxiosError } from "axios";
type MaybeAxiosError = {
  message?: string;
  response?: { status?: number; data?: { message?: string } };
};

/** HTTP status of a failed request (undefined for network errors). */
export function getErrorStatus(error: unknown): number | undefined {
  return (error as MaybeAxiosError)?.response?.status;
}

/** Best human-readable message: backend message first, then generic. */
export function getErrorMessage(error: unknown): string {
  const err = error as AxiosError<{ detail?: unknown }>;
  const detail = err?.response?.data?.detail;

  // FastAPI: normal errors -> string
  if (typeof detail === "string") return detail;

  // FastAPI: 422 validation errors -> array of { msg, loc }
  if (Array.isArray(detail)) {
    return detail.map((d: any) => d.msg).join(", ");
  }

  return err?.message ?? "Something went wrong";
}
