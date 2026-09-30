import { Navigate, Route, Routes, generatePath } from "react-router-dom";
import { AdminConsolePage } from "./pages/AdminConsolePage";
import type { AdminView } from "./constants/admin";

export type ConsoleRouteView = AdminView | "legacy";

const adminRoutes = {
  me: "/me",
  users: "/users",
  user: "/users/:userId",
  roles: "/roles",
  role: "/roles/:roleId",
  permissions: "/permissions",
  counters: "/counters",
  counter: "/counters/:counterId",
  scripts: "/scripts",
  groups: "/finance/groups",
  group: "/finance/groups/:groupId",
  rule: "/finance/rules/:ruleId",
} as const;

type AdminPathParams = {
  me: object;
  users: object;
  user: { userId: string | number };
  roles: object;
  role: { roleId: string | number };
  permissions: object;
  counters: object;
  counter: { counterId: string | number };
  scripts: object;
  groups: object;
  group: { groupId: string | number };
  rule: { ruleId: string | number };
};

type RoutedAdminView = keyof AdminPathParams;
type SharedPathParams = {
  userId?: number | null;
  roleId?: number | null;
  counterId?: number | null;
  groupId?: number | null;
  ruleId?: number | null;
};

export const consoleRouteConfig: { path: string; view: ConsoleRouteView }[] = [
  { path: "/", view: "legacy" },
  ...Object.entries(adminRoutes).map(([view, path]) => ({
    path,
    view: view as AdminView,
  })),
];

export function buildAdminPath<T extends RoutedAdminView>(
  view: T,
  params: AdminPathParams[T],
): string;
export function buildAdminPath(
  view: AdminView,
  params?: SharedPathParams,
): string;
export function buildAdminPath(
  view: AdminView,
  params: SharedPathParams = {},
): string {
  if (view in adminRoutes) {
    const pathParams = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    );
    return generatePath(adminRoutes[view as RoutedAdminView], pathParams);
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
