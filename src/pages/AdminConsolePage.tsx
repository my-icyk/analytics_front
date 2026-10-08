import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth, usePermissions } from "../auth/AuthContext";
import { Bell, CircleHelp, Database } from "lucide-react";
import { parseLegacyAdminRoute, type AdminView } from "../constants/admin";
import { buildAdminPath, type ConsoleRouteView } from "../routes";
import { assignmentService } from "../services/assignmentService";
import { counterService } from "../services/counterService";
import { permissionService } from "../services/permissionService";
import { roleService } from "../services/roleService";
import { userService } from "../services/userService";
import type { Permission } from "../types/auth/permission";
import type { Role } from "../types/auth/role";
import type { User } from "../types/auth/user";
import type { Counter } from "../types/counter";
import type { RoleForm, UserForm } from "../types/forms";
import { UserFormModal } from "../components/users/UserFormModal";
import { RoleFormModal } from "../components/roles/RoleFormModal";
import { UsersPage } from "./UsersPage";
import { RolesPage } from "./RolesPage";
import { UserDetailPage } from "./UserDetailPage";
import { RoleDetailPage } from "./RoleDetailPage";
import { PermissionCatalogPage } from "./PermissionCatalogPage";

import { CounterDetailPage } from "./CounterDetailPage";
import { CounterUpdateForm } from "../components/CountersUpdate/CounterUpdateForm";
import type { CounterUpdateFormValues } from "../components/CountersUpdate/CounterUpdateForm.schema";
import { MePage } from "./MePage";
import { ScriptsPage } from "./ScriptsPage";
import { GroupsPage } from "../features/finance/groups/pages/GroupsPage";
import { DivisionsPage } from "../features/finance/divisions/pages/DivisionsPage";
import { GroupDetailPage } from "../features/finance/groups/pages/GroupDetailPage";
import { RuleDetailPage } from "./RuleDetailPage";
import { financeService } from "../services/financeService";
import { AdminSidebar } from "../components/AdminSidebar";
import type { Rule, RuleCreate, Target, TargetCreate } from "../types/finance";
import type { Group, GroupCreate, GroupType } from "../features/finance/groups";
import { CounterExceptionsPage } from "../features/params/countersExceptions/pages/CounterExceptionsPage";

export function AdminConsolePage({
  routeView,
}: {
  routeView: ConsoleRouteView;
}) {
  const { user, loading: checkingSession, login, logout } = useAuth();
  const { can } = usePermissions();
  const [loginError, setLoginError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userRoleMap, setUserRoleMap] = useState<Record<number, Role[]>>({});
  const [rolePermissionMap, setRolePermissionMap] = useState<
    Record<number, Permission[]>
  >({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null);
  const [selectedCounterId, setSelectedCounterId] = useState<number | null>(
    null,
  );
  const [userForm, setUserForm] = useState<UserForm>({
    username: "",
    password: "",
    is_admin: false,
  });
  const [roleForm, setRoleForm] = useState<RoleForm>({
    name: "",
    description: "",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [userError, setUserError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [assignmentError, setAssignmentError] = useState("");
  const [counterError, setCounterError] = useState("");
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [counterFormError, setCounterFormError] = useState("");
  const [counterRefreshKey, setCounterRefreshKey] = useState(0);

  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(null);
  const [groupRulesMap, setGroupRulesMap] = useState<Record<number, Rule[]>>(
    {},
  );
  const [ruleTargetsMap, setRuleTargetsMap] = useState<
    Record<number, Target[]>
  >({});
  const [financeError, setFinanceError] = useState("");

  const userPageLoadedRef = useRef(false);
  const rolePageLoadedRef = useRef(false);
  const permissionPageLoadedRef = useRef(false);
  const groupsPageLoadedRef = useRef(false);
  const loadedGroupRulesIdsRef = useRef<Set<number>>(new Set());
  const loadedRuleTargetsIdsRef = useRef<Set<number>>(new Set());
  const loadedUserRoleIdsRef = useRef<Set<number>>(new Set());
  const loadedRolePermissionIdsRef = useRef<Set<number>>(new Set());
  const loadedCounterIdsRef = useRef<Set<number>>(new Set());
  const counterMapRef = useRef<Record<number, Counter>>({});

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const route = useMemo(() => {
    if (routeView === "legacy") return parseLegacyAdminRoute(location.search);
    return {
      view: routeView as AdminView,
      userId:
        routeView === "user" && params.userId ? Number(params.userId) : null,
      roleId:
        routeView === "role" && params.roleId ? Number(params.roleId) : null,
      counterId:
        routeView === "counter" && params.counterId
          ? Number(params.counterId)
          : null,
      groupId:
        routeView === "group" && params.groupId ? Number(params.groupId) : null,
      ruleId:
        routeView === "rule" && params.ruleId ? Number(params.ruleId) : null,
    };
  }, [
    routeView,
    location.search,
    params.userId,
    params.roleId,
    params.counterId,
    params.groupId,
    params.ruleId,
  ]);

  const syncViewFromLocation = () => {
    setSelectedUserId(null);
    setSelectedRole(null);
    setSelectedRoleId(null);
    setSelectedCounter(null);
    setSelectedCounterId(null);
    setSelectedGroup(null);
    setSelectedGroupId(null);
    setSelectedRule(null);
    setSelectedRuleId(null);
    if (route.view === "me") {
      setActiveNav("Me");
      return;
    }
    if (route.view === "users") {
      setActiveNav("Users");
      return;
    }
    if (route.view === "user") {
      setActiveNav("User details");
      setSelectedUserId(route.userId);
      return;
    }
    if (route.view === "roles") {
      setActiveNav("Roles");
      return;
    }
    if (route.view === "role") {
      setActiveNav("Role details");
      setSelectedRoleId(route.roleId);
      return;
    }
    if (route.view === "permissions") {
      setActiveNav("Permissions");
      return;
    }
    if (route.view === "counters") {
      setActiveNav("Counters");
      return;
    }
    if (route.view === "groups") {
      setActiveNav("Groups");
      return;
    }
    if (route.view === "divisions") {
      setActiveNav("Divisions");
      return;
    }
    if (route.view === "group") {
      setActiveNav("Group details");
      setSelectedGroupId(route.groupId);
      return;
    }
    if (route.view === "rule") {
      setActiveNav("Rule details");
      setSelectedRuleId(route.ruleId);
      return;
    }
    if (route.view === "scripts") {
      setActiveNav("Scripts");
      return;
    }
    if (route.view === "counter") {
      setActiveNav("Counter details");
      setSelectedCounterId(route.counterId);
      return;
    }
    setActiveNav("Users");
  };

  const setRoute = (
    view:
      | "me"
      | "users"
      | "user"
      | "roles"
      | "role"
      | "permissions"
      | "counters"
      | "scripts"
      | "counter"
      | "groups"
      | "group"
      | "divisions"
      | "rule",
    values: {
      userId?: number | null;
      roleId?: number | null;
      counterId?: number | null;
      groupId?: number | null;
      ruleId?: number | null;
    } = {},
  ) => {
    navigate(buildAdminPath(view, values));
  };

  const ensureUsers = async () => {
    if (!user || !can("user:read") || userPageLoadedRef.current) return;
    const nextUsers = await userService.listUsers();
    setUsers(nextUsers);
    userPageLoadedRef.current = true;
  };

  const ensureRoles = async () => {
    if (!user || !can("role:read") || rolePageLoadedRef.current) return;
    const nextRoles = await roleService.listRoles();
    setRoles(nextRoles);
    rolePageLoadedRef.current = true;
  };

  const ensureRole = async (roleId: number) => {
    if (!user) return;
    if (!can("role:read")) {
      setRoleError("You do not have permission to view this role.");
      return;
    }
    try {
      const nextRole = await roleService.getRole(roleId);
      setSelectedRole(nextRole);
      setRoleError("");
    } catch (error) {
      setRoleError(
        error instanceof Error ? error.message : "Unable to load role",
      );
    }
  };

  const ensurePermissions = async () => {
    if (!user || !can("permission:read") || permissionPageLoadedRef.current)
      return;
    const nextPermissions = await permissionService.listPermissions();
    setPermissions(nextPermissions);
    permissionPageLoadedRef.current = true;
  };

  const ensureUserRoles = async (userId: number) => {
    if (
      userRoleMap[userId] !== undefined ||
      loadedUserRoleIdsRef.current.has(userId)
    )
      return;
    const nextRoles = await userService.getUserRoles(userId);
    loadedUserRoleIdsRef.current.add(userId);
    setUserRoleMap((current) => ({ ...current, [userId]: nextRoles }));
  };

  const ensureRolePermissions = async (roleId: number) => {
    if (
      rolePermissionMap[roleId] !== undefined ||
      loadedRolePermissionIdsRef.current.has(roleId)
    )
      return;
    const nextPermissions = await roleService.getRolePermissions(roleId);
    loadedRolePermissionIdsRef.current.add(roleId);
    setRolePermissionMap((current) => ({
      ...current,
      [roleId]: nextPermissions,
    }));
  };

  const ensureCounter = async (counterId: number) => {
    if (loadedCounterIdsRef.current.has(counterId)) {
      setSelectedCounter(counterMapRef.current[counterId] ?? null);
      return;
    }
    try {
      const counter = await counterService.getCounter(counterId);
      loadedCounterIdsRef.current.add(counterId);
      counterMapRef.current[counterId] = counter;
      setCounterError("");
      setSelectedCounter(counter);
    } catch (error) {
      setCounterError(
        error instanceof Error ? error.message : "Unable to load counter",
      );
    }
  };

  const ensureGroups = async () => {
    if (
      !user ||
      (!can("finance:group:read") && !user.is_admin) ||
      groupsPageLoadedRef.current
    )
      return;
    try {
      const groupsPage = await financeService.getGroups({ limit: 100 });
      setGroups(groupsPage.items);
      groupsPageLoadedRef.current = true;
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to load finance data",
      );
    }
  };

  const ensureGroup = async (groupId: number) => {
    try {
      await ensureGroups();
      const existing = groups.find((g) => g.id === groupId);
      if (existing) {
        setSelectedGroup(existing);
      } else {
        const fetched = await financeService.getGroup(groupId);
        setSelectedGroup(fetched);
        setGroups((cur) =>
          cur.some((g) => g.id === fetched.id) ? cur : [...cur, fetched],
        );
      }
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to load group",
      );
    }
  };

  const ensureGroupRules = async (groupId: number) => {
    if (loadedGroupRulesIdsRef.current.has(groupId)) return;
    try {
      const nextRules = await financeService.getRules(groupId);
      loadedGroupRulesIdsRef.current.add(groupId);
      setGroupRulesMap((cur) => ({ ...cur, [groupId]: nextRules }));
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to load group rules",
      );
    }
  };

  const ensureRule = async (ruleId: number) => {
    try {
      await ensureGroups();
      let rule = selectedRule;
      if (!rule || rule.id !== ruleId) {
        rule = await financeService.getRule(ruleId);
        setSelectedRule(rule);
      }
      if (!loadedRuleTargetsIdsRef.current.has(ruleId)) {
        const targets = await financeService.getTargets(ruleId);
        loadedRuleTargetsIdsRef.current.add(ruleId);
        setRuleTargetsMap((cur) => ({ ...cur, [ruleId]: targets }));
      }
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to load rule details",
      );
    }
  };

  // A stable identity for the current route. Query params (e.g. ?tab=) change
  // location.search and recompute `route`, but the view + ids stay the same —
  // so we must NOT re-run syncViewFromLocation, or it would wipe the selected
  // entity and blank the detail page when switching tabs.
  const routeKey = [
    route.view,
    route.userId,
    route.roleId,
    route.counterId,
    route.groupId,
    route.ruleId,
  ].join("|");

  const lastSyncedRouteKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastSyncedRouteKeyRef.current === routeKey) return;
    lastSyncedRouteKeyRef.current = routeKey;
    syncViewFromLocation();
  }, [routeKey]);

  useEffect(() => {
    if (!user) return;
    if (activeNav === "Users" || activeNav === "User details")
      void ensureUsers().catch(() => undefined);
    if (
      activeNav === "Roles" ||
      activeNav === "Role details" ||
      activeNav === "User details"
    )
      void ensureRoles().catch(() => undefined);
    if (activeNav === "Permissions" || activeNav === "Role details")
      void ensurePermissions().catch(() => undefined);
    if (activeNav === "User details" && selectedUserId !== null)
      void ensureUserRoles(selectedUserId).catch(() => undefined);
    if (activeNav === "Role details" && selectedRoleId !== null) {
      void ensureRole(selectedRoleId);
      void ensureRolePermissions(selectedRoleId).catch(() => undefined);
    }
    if (activeNav === "Counter details" && selectedCounterId !== null)
      void ensureCounter(selectedCounterId);
    if (
      activeNav === "Groups" ||
      activeNav === "Group details" ||
      activeNav === "Rule details"
    )
      void ensureGroups().catch(() => undefined);
    // TODO: Numi place sistema aceasta de activNav
    if (activeNav === "Group details" && selectedGroupId !== null) {
      void ensureGroup(selectedGroupId).catch(() => undefined);
      void ensureGroupRules(selectedGroupId).catch(() => undefined);
    }
    if (activeNav === "Rule details" && selectedRuleId !== null)
      void ensureRule(selectedRuleId).catch(() => undefined);
  }, [
    activeNav,
    selectedUserId,
    selectedRoleId,
    selectedCounterId,
    selectedGroupId,
    selectedRuleId,
    user,
    can,
  ]);

  useEffect(() => {
    if (selectedUserId === null) {
      setSelectedUser(null);
      return;
    }
    const matchingUser = users.find((item) => item.id === selectedUserId);
    if (matchingUser) {
      setSelectedUser(matchingUser);
      return;
    }
    setSelectedUser((current) =>
      current?.id === selectedUserId ? current : null,
    );
  }, [selectedUserId, users]);

  useEffect(() => {
    if (selectedRoleId === null) {
      setSelectedRole(null);
      return;
    }
    const matchingRole = roles.find((item) => item.id === selectedRoleId);
    if (matchingRole) setSelectedRole(matchingRole);
  }, [selectedRoleId, roles]);

  useEffect(() => {
    if (selectedGroupId === null) {
      setSelectedGroup(null);
      return;
    }
    const found = groups.find((item) => item.id === selectedGroupId);
    if (found) setSelectedGroup(found);
  }, [selectedGroupId, groups]);

  const handleUpdateGroup = async (groupId: number, payload: GroupCreate) => {
    try {
      const updated = await financeService.updateGroup(groupId, payload);
      setGroups((cur) => cur.map((g) => (g.id === groupId ? updated : g)));
      if (selectedGroupId === groupId) setSelectedGroup(updated);
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to update group",
      );
      throw err;
    }
  };

  const handleDeleteGroup = async (groupToDelete: Group) => {
    try {
      await financeService.removeGroup(groupToDelete.id);
      setGroups((cur) => cur.filter((g) => g.id !== groupToDelete.id));
      setFinanceError("");
      if (selectedGroupId === groupToDelete.id) setRoute("groups");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to delete group",
      );
    }
  };

  const handleCreateRule = async (payload: RuleCreate) => {
    try {
      const created = await financeService.createRule(payload);
      setGroupRulesMap((cur) => ({
        ...cur,
        [payload.group_id]: [...(cur[payload.group_id] ?? []), created],
      }));
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to create rule",
      );
      throw err;
    }
  };

  const handleUpdateRule = async (ruleId: number, payload: RuleCreate) => {
    try {
      const updated = await financeService.updateRule(ruleId, payload);
      setGroupRulesMap((cur) => ({
        ...cur,
        [payload.group_id]: (cur[payload.group_id] ?? []).map((r) =>
          r.id === ruleId ? updated : r,
        ),
      }));
      if (selectedRuleId === ruleId) setSelectedRule(updated);
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to update rule",
      );
      throw err;
    }
  };

  const handleDeleteRule = async (ruleToDelete: Rule) => {
    try {
      await financeService.removeRule(ruleToDelete.id);
      setGroupRulesMap((cur) => ({
        ...cur,
        [ruleToDelete.group_id]: (cur[ruleToDelete.group_id] ?? []).filter(
          (r) => r.id !== ruleToDelete.id,
        ),
      }));
      setFinanceError("");
      if (selectedRuleId === ruleToDelete.id)
        setRoute("group", { groupId: ruleToDelete.group_id });
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to delete rule",
      );
    }
  };

  const handleCreateTarget = async (payload: TargetCreate) => {
    try {
      const created = await financeService.assignTarget(
        payload.rule_id,
        payload,
      );
      setRuleTargetsMap((cur) => ({
        ...cur,
        [payload.rule_id]: [...(cur[payload.rule_id] ?? []), created],
      }));
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to create target",
      );
      throw err;
    }
  };

  const handleUpdateTarget = async (
    ruleId: number,
    targetId: number,
    payload: TargetCreate,
  ) => {
    try {
      const updated = await financeService.updateTarget(
        ruleId,
        targetId,
        payload,
      );
      setRuleTargetsMap((cur) => ({
        ...cur,
        [ruleId]: (cur[ruleId] ?? []).map((t) =>
          t.id === targetId ? updated : t,
        ),
      }));
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to update target",
      );
      throw err;
    }
  };

  const handleDeleteTarget = async (targetToDelete: Target) => {
    try {
      await financeService.revokeTarget(
        targetToDelete.rule_id,
        targetToDelete.id,
      );
      setRuleTargetsMap((cur) => ({
        ...cur,
        [targetToDelete.rule_id]: (cur[targetToDelete.rule_id] ?? []).filter(
          (t) => t.id !== targetToDelete.id,
        ),
      }));
      setFinanceError("");
    } catch (err) {
      setFinanceError(
        err instanceof Error ? err.message : "Failed to delete target",
      );
    }
  };

  const toggleUserRole = async (userId: number, roleId: number) => {
    const assigned = (userRoleMap[userId] ?? []).some(
      (item) => item.id === roleId,
    );
    try {
      if (assigned) await userService.removeRoleFromUser(userId, roleId);
      else await userService.assignRoleToUser(userId, roleId);
      setAssignmentError("");
      setUserRoleMap((current) =>
        assignmentService.toggleRoleMembership(
          current,
          userId,
          roleId,
          assigned,
          roles.find((item) => item.id === roleId)!,
        ),
      );
    } catch (error) {
      setAssignmentError(
        error instanceof Error ? error.message : "Unable to update user roles",
      );
    }
  };

  const toggleUserAdmin = async (targetUser: User) => {
    try {
      const updated = targetUser.is_admin
        ? await userService.revokeAdmin(targetUser.id)
        : await userService.grantAdmin(targetUser.id);
      setAssignmentError("");
      setUsers((current) =>
        current.map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item,
        ),
      );
    } catch (error) {
      setAssignmentError(
        error instanceof Error
          ? error.message
          : "Unable to update admin access",
      );
    }
  };

  const toggleRolePermission = async (roleId: number, permissionId: number) => {
    const assigned = (rolePermissionMap[roleId] ?? []).some(
      (item) => item.id === permissionId,
    );
    try {
      if (assigned)
        await roleService.removePermissionFromRole(roleId, permissionId);
      else await roleService.assignPermissionToRole(roleId, permissionId);
      setAssignmentError("");
      setRolePermissionMap((current) =>
        assignmentService.togglePermissionMembership(
          current,
          roleId,
          permissionId,
          assigned,
          permissions.find((item) => item.id === permissionId)!,
        ),
      );
    } catch (error) {
      setAssignmentError(
        error instanceof Error
          ? error.message
          : "Unable to update role permissions",
      );
    }
  };

  const openUser = (item: User) => {
    setSelectedUser(item);
    setSelectedUserId(item.id);
    setSelectedRole(null);
    setSelectedRoleId(null);
    setRoute("user", { userId: item.id });
  };
  const openRole = (item: Role) => {
    setSelectedRole(item);
    setSelectedRoleId(item.id);
    setSelectedUser(null);
    setSelectedUserId(null);
    setRoute("role", { roleId: item.id });
  };
  const openCounter = (item: Counter) => {
    setSelectedCounter(item);
    setSelectedCounterId(item.id);
    setRoute("counter", { counterId: item.id });
  };
  const openUserEditor = (item: User | null) => {
    setEditingUser(item);
    setUserForm({
      username: item?.username ?? "",
      password: "",
      is_admin: item?.is_admin ?? false,
    });
    setUserError("");
    setUserModalOpen(true);
  };
  const openRoleEditor = (item: Role | null) => {
    setEditingRole(item);
    setRoleForm({
      name: item?.name ?? "",
      description: item?.description ?? "",
    });
    setRoleError("");
    setRoleModalOpen(true);
  };
  const openCounterEditor = (item: Counter | null) => {
    setEditingCounter(item);
    setCounterFormError("");
    setCounterModalOpen(true);
  };

  const saveCounter = async (values: CounterUpdateFormValues) => {
    const payload = { ...values, comment: values.comment ?? "" };
    try {
      const saved = editingCounter
        ? await counterService.updateCounter(editingCounter.id, payload)
        : await counterService.createCounter(payload);
      loadedCounterIdsRef.current.add(saved.id);
      counterMapRef.current[saved.id] = saved;
      if (selectedCounter?.id === saved.id) setSelectedCounter(saved);
      setCounterModalOpen(false);
      setCounterRefreshKey((current) => current + 1);
    } catch (error) {
      setCounterFormError(
        error instanceof Error ? error.message : "Unable to save counter",
      );
    }
  };

  const removeCounter = async (item: Counter) => {
    if (!window.confirm(`Delete counter ${item.id_counter}?`)) return;
    try {
      await counterService.deleteCounter(item.id);
      loadedCounterIdsRef.current.delete(item.id);
      delete counterMapRef.current[item.id];
      setCounterError("");
      setCounterRefreshKey((current) => current + 1);
      if (selectedCounter?.id === item.id) setRoute("counters");
    } catch (error) {
      setCounterError(
        error instanceof Error ? error.message : "Unable to delete counter",
      );
    }
  };

  const saveUser = async () => {
    if (!userForm.username.trim() || (!editingUser && !userForm.password))
      return;
    try {
      const saved = editingUser
        ? await userService.updateUser(editingUser.id, {
            username: userForm.username.trim(),
            ...(userForm.password ? { password: userForm.password } : {}),
            is_admin: userForm.is_admin,
          })
        : await userService.createUser({
            username: userForm.username.trim(),
            password: userForm.password,
            is_admin: userForm.is_admin,
          });
      setUsers((current) =>
        editingUser
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [...current, saved],
      );
      if (selectedUser?.id === saved.id) setSelectedUser(saved);
      setUserModalOpen(false);
    } catch (error) {
      setUserError(
        error instanceof Error ? error.message : "Unable to save user",
      );
    }
  };

  const saveRole = async () => {
    if (!roleForm.name.trim()) return;
    try {
      const saved = editingRole
        ? await roleService.updateRole(editingRole.id, {
            name: roleForm.name.trim(),
            description: roleForm.description.trim() || null,
          })
        : await roleService.createRole(
            roleForm.name.trim(),
            roleForm.description.trim() || null,
          );
      setRoles((current) =>
        editingRole
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [...current, saved],
      );
      if (selectedRole?.id === saved.id) setSelectedRole(saved);
      setRoleModalOpen(false);
    } catch (error) {
      setRoleError(
        error instanceof Error ? error.message : "Unable to save role",
      );
    }
  };

  const removeUser = async (item: User) => {
    if (!window.confirm(`Delete ${item.username}?`)) return;
    try {
      await userService.deleteUser(item.id);
      setUsers((current) => current.filter((entry) => entry.id !== item.id));
      if (selectedUser?.id === item.id) setRoute("users");
    } catch (error) {
      setUserError(
        error instanceof Error ? error.message : "Unable to delete user",
      );
    }
  };
  const removeRole = async (item: Role) => {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    try {
      await roleService.deleteRole(item.id);
      setRoles((current) => current.filter((entry) => entry.id !== item.id));
      if (selectedRole?.id === item.id) setRoute("roles");
    } catch (error) {
      setRoleError(
        error instanceof Error ? error.message : "Unable to delete role",
      );
    }
  };

  const submitLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      await login(username, password);
      setPassword("");
      setRoute("me");
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Unable to sign in",
      );
    } finally {
      setLoggingIn(false);
    }
  };

  if (checkingSession)
    return (
      <div className="auth-screen">
        <div className="auth-panel">
          <span className="brand-mark">
            <Database size={18} />
          </span>
          <p>Connecting to Ledgerline...</p>
        </div>
      </div>
    );
  if (!user)
    return (
      <div className="auth-screen">
        <form className="auth-panel" onSubmit={submitLogin}>
          <div className="brand auth-brand">
            <span className="brand-mark">
              <Database size={18} />
            </span>
            <span>ledgerline</span>
          </div>
          <p className="eyebrow">SECURE CONSOLE</p>
          <h1>Sign in to your workspace</h1>
          <p className="subtitle">Use your FastAPI account to continue.</p>
          <label>
            Username
            <input
              autoFocus
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {loginError && <p className="auth-error">{loginError}</p>}
          <button className="primary-button auth-submit" disabled={loggingIn}>
            {loggingIn ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    );

  return (
    <div className="app-shell">
      <AdminSidebar activeNav={activeNav} />
      <main className="main-content">
        {/* <header className="topbar">
          <div className="breadcrumbs">
            <span>Workspace</span>
            <span>/</span>
            <strong>{activeNav}</strong>
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <button className="help-button">
              <CircleHelp size={16} /> Support
            </button>
          </div>
        </header> */}
        {activeNav === "Me" && <MePage user={user} />}
        {activeNav === "Users" && (
          <UsersPage
            canCreate={can("user:create")}
            canEdit={can("user:update")}
            canDelete={can("user:delete")}
            onCreate={() => openUserEditor(null)}
            onOpen={openUser}
            onEdit={openUserEditor}
            onDelete={removeUser}
            error={userError}
          />
        )}
        {activeNav === "User details" && selectedUser && (
          <UserDetailPage
            user={selectedUser}
            roles={roles}
            assignedRoles={userRoleMap[selectedUser.id] ?? []}
            canEdit={can("user:update")}
            canAssign={can("user_role:assign")}
            canManageAdmin={user.is_admin}
            onBack={() => setRoute("users")}
            onEdit={() => openUserEditor(selectedUser)}
            onOpenRole={openRole}
            onToggleRole={(roleId) => toggleUserRole(selectedUser.id, roleId)}
            onToggleAdmin={() => toggleUserAdmin(selectedUser)}
            error={assignmentError}
          />
        )}
        {activeNav === "Roles" && (
          <RolesPage
            canCreate={can("role:create")}
            canEdit={can("role:update")}
            canDelete={can("role:delete")}
            onCreate={() => openRoleEditor(null)}
            onOpen={openRole}
            onEdit={openRoleEditor}
            onDelete={removeRole}
            error={roleError}
          />
        )}
        {activeNav === "Role details" && selectedRole && (
          <RoleDetailPage
            role={selectedRole}
            permissions={permissions}
            assignedPermissions={rolePermissionMap[selectedRole.id] ?? []}
            canEdit={can("role:update")}
            canAssign={can("role_permission:assign")}
            onBack={() => setRoute("roles")}
            onEdit={() => openRoleEditor(selectedRole)}
            onTogglePermission={(permissionId) =>
              toggleRolePermission(selectedRole.id, permissionId)
            }
            error={roleError || assignmentError}
          />
        )}
        {activeNav === "Role details" && !selectedRole && (
          <section className="detail-page">
            {roleError ? (
              <p className="auth-error">{roleError}</p>
            ) : (
              <p className="subtitle">Loading role...</p>
            )}
          </section>
        )}
        {activeNav === "Permissions" && (
          <PermissionCatalogPage permissions={permissions} />
        )}
        {activeNav === "Counters" && <CounterExceptionsPage />}
        {activeNav === "Counter details" && selectedCounter && (
          <CounterDetailPage
            counter={selectedCounter}
            onBack={() => setRoute("counters")}
            onEdit={() => openCounterEditor(selectedCounter)}
            onDelete={() => removeCounter(selectedCounter)}
            error={counterError}
          />
        )}
        {activeNav === "Groups" && (
          <GroupsPage
            onOpenGroup={(g) => setRoute("group", { groupId: g.id })}
          />
        )}
        {activeNav === "Divisions" && <DivisionsPage />}
        {activeNav === "Group details" && selectedGroup && (
          <GroupDetailPage
            group={selectedGroup}
            allGroups={groups}
            rules={groupRulesMap[selectedGroup.id] ?? []}
            canEditGroup={can("finance:group:update")}
            canDeleteGroup={can("finance:group:delete")}
            canCreateRule={can("finance:rule:create")}
            canEditRule={can("finance:rule:update")}
            canDeleteRule={can("finance:rule:delete")}
            onBack={() => setRoute("groups")}
            onSelectGroup={(groupId) => setRoute("group", { groupId })}
            onUpdateGroup={handleUpdateGroup}
            onDeleteGroup={handleDeleteGroup}
            onOpenRule={(r) => setRoute("rule", { ruleId: r.id })}
            onCreateRule={handleCreateRule}
            onUpdateRule={handleUpdateRule}
            onDeleteRule={handleDeleteRule}
            error={financeError}
          />
        )}
        {activeNav === "Rule details" && selectedRule && (
          <RuleDetailPage
            rule={selectedRule}
            group={
              groups.find((g) => g.id === selectedRule.group_id) ??
              selectedGroup
            }
            allGroups={groups}
            targets={ruleTargetsMap[selectedRule.id] ?? []}
            canEditRule={can("finance:rule:update")}
            canDeleteRule={can("finance:rule:delete")}
            canCreateTarget={can("finance:rule_target:create")}
            canEditTarget={can("finance:rule_target:update")}
            canDeleteTarget={can("finance:rule_target:delete")}
            onBack={() => setRoute("group", { groupId: selectedRule.group_id })}
            onOpenGroup={(groupId) => setRoute("group", { groupId })}
            onUpdateRule={handleUpdateRule}
            onDeleteRule={handleDeleteRule}
            onCreateTarget={handleCreateTarget}
            onUpdateTarget={handleUpdateTarget}
            onDeleteTarget={handleDeleteTarget}
            error={financeError}
          />
        )}
        {activeNav === "Scripts" && <ScriptsPage username={user.username} />}
      </main>
      {userModalOpen && (
        <UserFormModal
          user={editingUser}
          isAdmin={user.is_admin}
          form={userForm}
          error={userError}
          onChange={setUserForm}
          onClose={() => setUserModalOpen(false)}
          onSubmit={saveUser}
        />
      )}
      {roleModalOpen && (
        <RoleFormModal
          role={editingRole}
          form={roleForm}
          error={roleError}
          onChange={setRoleForm}
          onClose={() => setRoleModalOpen(false)}
          onSubmit={saveRole}
        />
      )}
      {counterModalOpen && (
        <CounterUpdateForm
          counter={editingCounter}
          error={counterFormError}
          onClose={() => setCounterModalOpen(false)}
          onSubmit={saveCounter}
        />
      )}
    </div>
  );
}

export default AdminConsolePage;
