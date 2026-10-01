// auth/AuthContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { authService } from "../services/authService";
import type { CurrentUserResponse } from "../types/auth/user";
import type { PermissionName } from "../types/auth/permission";
import { createLogger } from "../utils/logger";

type AuthContextValue = {
  user: CurrentUserResponse | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const logger = createLogger("AuthContext");
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // restore session on app start
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!authService.hasAccessToken()) {
          await authService.refreshSession();
        }
        const me = await authService.getCurrentUser();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // when the API client can't refresh the token anymore
  useEffect(() => {
    authService.setSessionExpiredHandler(() => setUser(null));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setUser(await authService.login(username, password));
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function usePermissions() {
  const { user } = useAuth();

  return useMemo(() => {
    const permissions = new Set(user?.permissions);

    return {
      can: (permission: PermissionName) => {
        const allowed = user?.is_admin === true || permissions.has(permission);
        // TODO: Bug when i create a new role and write the name, for each caracter is cheking again permission i see in logs

        logger.debug("[Permission Check]", {
          user: user?.username ?? "Not authenticated",
          permission,
          allowed,
          is_admin: user?.is_admin,
        });
        return allowed;
      },
    };
  }, [user]);
}
