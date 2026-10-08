/** Shared shape for all finance `/lookup` endpoints:
 *  id of the object + a backend-composed description string. */
export type LookupItem = {
  id: number;
  description: string;
};
