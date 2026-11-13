import { fetchCurrentUser } from "@/services/auth";
import type { CurrentUser } from "@/types/user";
import { getErrorStatus } from "@/utils/error";

export type InitialState = {
  currentUser?: CurrentUser;
};

export async function fetchInitialState(): Promise<InitialState> {
  try {
    const currentUser = await fetchCurrentUser(true);
    return { currentUser };
  } catch (error) {
    if (getErrorStatus(error) === 401) {
      return {};
    }
    throw error;
  }
}
