import {
  getCurrentUser,
  hasAccessToken,
  login,
  logout,
  refreshSession,
} from "../api/auth";
import { setSessionExpiredHandler } from "../api/client";

export const authService = {
  login,
  logout,
  getCurrentUser,
  hasAccessToken,
  refreshSession,
  setSessionExpiredHandler,
};
