import { Navigate, Route, Routes } from "react-router-dom";
import { AdminConsolePage } from "./pages/AdminConsolePage";
import type { AdminView } from "./constants/admin";

export type ConsoleRouteView = AdminView | "legacy";

export const consoleRouteConfig: { path: string; view: ConsoleRouteView }[] = [
  { path: "/", view: "legacy" },
  { path: "/me", view: "me" },
  { path: "/users", view: "users" },
  { path: "/users/:userId", view: "user" },
  { path: "/roles", view: "roles" },
  { path: "/roles/:roleId", view: "role" },
  { path: "/permissions", view: "permissions" },
  { path: "/counters", view: "counters" },
  { path: "/counters/:counterId", view: "counter" },
  { path: "/scripts", view: "scripts" },
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
  if (view === "users") return "/users";
  if (view === "user") {
    return params.userId != null ? `/users/${params.userId}` : "/users";
  }
  if (view === "roles") return "/roles";
  if (view === "role") {
    return params.roleId != null ? `/roles/${params.roleId}` : "/roles";
  }
  if (view === "permissions") return "/permissions";
  if (view === "counters") return "/counters";
  if (view === "counter") {
    return params.counterId != null
      ? `/counters/${params.counterId}`
      : "/counters";
  }
  if (view === "scripts") return "/scripts";
  if (view === "groups") return "/finance/groups";
  if (view === "group" && params.groupId != null) {
    return `/finance/groups/${params.groupId}`;
  }
  if (view === "rule" && params.ruleId != null) {
    return `/finance/rules/${params.ruleId}`;
  }

  return `/?${new URLSearchParams({ view }).toString()}`;
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
