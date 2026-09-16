import type { LucideIcon } from "lucide-react";
import {
  FileText,
  FolderKanban,
  KeyRound,
  ShieldCheck,
  Users,
  WalletCards,
  Activity,
} from "lucide-react";
import type { PermissionName } from "../types/auth/permission";

export type AdminView =
  | "overview"
  | "me"
  | "users"
  | "user"
  | "roles"
  | "role"
  | "permissions"
  | "counters"
  | "counter"
  | "groups"
  | "group"
  | "rules"
  | "rule"
  | "scripts";

export type AdminRouteState = {
  view: AdminView;
  userId: number | null;
  roleId: number | null;
  counterId: number | null;
  groupId: number | null;
  ruleId: number | null;
};

export type AdminPageDefinition = {
  id: AdminView;
  label: string;
  icon: LucideIcon;
  group?: string;
  permission?: PermissionName;
};

export const adminPages: AdminPageDefinition[] = [
  {
    id: "users",
    label: "Users",
    icon: Users,
    group: "Authentication",
    permission: "user:read",
  },
  {
    id: "roles",
    label: "Roles",
    icon: ShieldCheck,
    group: "Authentication",
    permission: "role:read",
  },
  {
    id: "permissions",
    label: "Permissions",
    icon: KeyRound,
    group: "Authentication",
    permission: "permission:read",
  },
  {
    id: "counters",
    label: "Counters",
    icon: WalletCards,
    group: "Tables",
    permission: "counter_update:read",
  },
  {
    id: "groups",
    label: "Groups",
    icon: FolderKanban,
    group: "Finance",
    permission: "finance:group:read",
  },
  {
    id: "scripts",
    label: "Scripts",
    icon: Activity,
    group: "General",
    permission: "user:delete",
  },
];

export function parseAdminRoute(
  pathname: string,
  search: string,
): AdminRouteState {
  if (pathname === "/me")
    return {
      view: "me",
      userId: null,
      roleId: null,
      counterId: null,
      groupId: null,
      ruleId: null,
    };
  if (pathname === "/finance/groups")
    return {
      view: "groups",
      userId: null,
      roleId: null,
      counterId: null,
      groupId: null,
      ruleId: null,
    };

  const groupMatch = pathname.match(/^\/finance\/groups\/(\d+)$/);
  if (groupMatch) {
    return {
      view: "group",
      groupId: Number(groupMatch[1]),
      userId: null,
      roleId: null,
      counterId: null,
      ruleId: null,
    };
  }

  const ruleMatch = pathname.match(/^\/finance\/rules\/(\d+)$/);
  if (ruleMatch) {
    return {
      view: "rule",
      ruleId: Number(ruleMatch[1]),
      userId: null,
      roleId: null,
      counterId: null,
      groupId: null,
    };
  }

  const params = new URLSearchParams(search);
  const view = params.get("view") ?? "me";
  const userId = params.get("userId") ? Number(params.get("userId")) : null;
  const roleId = params.get("roleId") ? Number(params.get("roleId")) : null;
  const counterId = params.get("counterId")
    ? Number(params.get("counterId"))
    : null;
  const groupId = params.get("groupId") ? Number(params.get("groupId")) : null;
  const ruleId = params.get("ruleId") ? Number(params.get("ruleId")) : null;

  if (view === "me")
    return {
      view: "me",
      userId: null,
      roleId: null,
      counterId: null,
      groupId: null,
      ruleId: null,
    };
  if (view === "users" || view === "permissions" || view === "counters")
    return {
      view,
      userId: null,
      roleId: null,
      counterId: null,
      groupId: null,
      ruleId: null,
    };
  if (view === "user")
    return {
      view: "user",
      userId,
      roleId: null,
      counterId: null,
      groupId: null,
      ruleId: null,
    };
  if (view === "roles")
    return {
      view: "roles",
      userId: null,
      roleId: null,
      counterId: null,
      groupId: null,
      ruleId: null,
    };
  if (view === "role")
    return {
      view: "role",
      userId: null,
      roleId,
      counterId: null,
      groupId: null,
      ruleId: null,
    };
  if (view === "counter")
    return {
      view: "counter",
      userId: null,
      roleId: null,
      counterId,
      groupId: null,
      ruleId: null,
    };
  if (view === "groups")
    return {
      view: "groups",
      userId: null,
      roleId: null,
      counterId: null,
      groupId: null,
      ruleId: null,
    };
  if (view === "group")
    return {
      view: "group",
      userId: null,
      roleId: null,
      counterId: null,
      groupId,
      ruleId: null,
    };
  if (view === "rules" || view === "rule")
    return {
      view: "rule",
      userId: null,
      roleId: null,
      counterId: null,
      groupId: null,
      ruleId,
    };
  if (view === "scripts")
    return {
      view: "scripts",
      userId: null,
      roleId: null,
      counterId: null,
      groupId: null,
      ruleId: null,
    };
  return {
    view: "me",
    userId: null,
    roleId: null,
    counterId: null,
    groupId: null,
    ruleId: null,
  };
}

export function buildAdminRoute(
  view: AdminView,
  params: {
    userId?: number | null;
    roleId?: number | null;
    counterId?: number | null;
    groupId?: number | null;
    ruleId?: number | null;
  } = {},
) {
  const url = new URL(window.location.href);

  if (view === "me") {
    url.pathname = "/me";
    url.search = "";
    return `${url.pathname}${url.search}`;
  }

  if (view === "groups") {
    url.pathname = "/finance/groups";
    url.search = "";
    return `${url.pathname}${url.search}`;
  }

  if (view === "group" && params.groupId != null) {
    url.pathname = `/finance/groups/${params.groupId}`;
    url.search = "";
    return `${url.pathname}${url.search}`;
  }

  if (view === "rule" && params.ruleId != null) {
    url.pathname = `/finance/rules/${params.ruleId}`;
    url.search = "";
    return `${url.pathname}${url.search}`;
  }

  url.pathname = "/";
  url.searchParams.set("view", view);

  if (view === "user") {
    if (params.userId == null) url.searchParams.delete("userId");
    else url.searchParams.set("userId", String(params.userId));
    url.searchParams.delete("roleId");
    url.searchParams.delete("counterId");
    return `${url.pathname}${url.search}`;
  }

  if (view === "role") {
    if (params.roleId == null) url.searchParams.delete("roleId");
    else url.searchParams.set("roleId", String(params.roleId));
    url.searchParams.delete("userId");
    url.searchParams.delete("counterId");
    return `${url.pathname}${url.search}`;
  }

  if (view === "counter") {
    if (params.counterId == null) url.searchParams.delete("counterId");
    else url.searchParams.set("counterId", String(params.counterId));
    url.searchParams.delete("userId");
    url.searchParams.delete("roleId");
    return `${url.pathname}${url.search}`;
  }

  url.searchParams.delete("userId");
  url.searchParams.delete("roleId");
  url.searchParams.delete("counterId");
  return `${url.pathname}${url.search}`;
}
