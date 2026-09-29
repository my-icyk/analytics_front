import { Navigate, Route, Routes } from "react-router-dom";
import { AdminConsolePage } from "./pages/AdminConsolePage";
import type { AdminView } from "./constants/admin";

export type ConsoleRouteView = AdminView | "legacy";

export const consoleRouteConfig: { path: string; view: ConsoleRouteView }[] = [
  { path: "/", view: "legacy" },
  { path: "/me", view: "me" },
  { path: "/finance/groups", view: "groups" },
  { path: "/finance/groups/:groupId", view: "group" },
  { path: "/finance/rules/:ruleId", view: "rule" },
];

export function buildAdminPath(
  view: AdminView,
  params: {
    userId?: number | null;
    roleId?: number | null;
    counterId?: number | null;
    groupId?: number | null;
    ruleId?: number | null;
  } = {},
) {
  if (view === "me") return "/me";
  if (view === "groups") return "/finance/groups";
  if (view === "group" && params.groupId != null) {
    return `/finance/groups/${params.groupId}`;
  }
  if (view === "rule" && params.ruleId != null) {
    return `/finance/rules/${params.ruleId}`;
  }

  const search = new URLSearchParams({ view });
  if (view === "user" && params.userId != null) {
    search.set("userId", String(params.userId));
  }
  if (view === "role" && params.roleId != null) {
    search.set("roleId", String(params.roleId));
  }
  if (view === "counter" && params.counterId != null) {
    search.set("counterId", String(params.counterId));
  }
  return `/?${search.toString()}`;
}

export function AppRoutes() {
  return (
    <Routes>
      {consoleRouteConfig.map(({ path, view }) => (
        <Route
          key={path}
          path={path}
          element={<AdminConsolePage routeView={view} />}
        />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
