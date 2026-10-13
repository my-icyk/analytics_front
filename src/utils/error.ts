/** Helpers for turning request errors into something we can show or check. */

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
  const e = error as MaybeAxiosError;
  return e?.response?.data?.message || e?.message || 'Something went wrong';
}
